import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadToCloudinary, deleteFromCloudinary, uploadRemoteToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const generateAccessandRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Error generating tokens")
    }
}

const googleClient = new OAuth2Client();

// Google gives no username, so build one from the email and make sure it is free
const makeUniqueUsername = async (email) => {
    const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";
    let username = base;
    while (await User.exists({ username })) {
        username = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    }
    return username;
};

//Tested(-avatar -coverImage) and working fine
const registerUser = asyncHandler(async (req, res) => {

    // 1. Get details from frontend wtever we are taking ..
    // 2. Now validate these like not empty or not.
    // 3. Check if User already exists in the database or not from : username ,email..
    // 4. Check for images, check for avatar
    // 5. Upload these to cloudinary , avatar
    // 6. Create user object --create entry in db
    // 7. From response --remove password and refresh token 
    // 8. Check for user creation---return response

    //Step1
    const { fullname, username, email, password } = req.body;

    //Step2
    //some ka use krke check kr rhe ki koi bhi field empty to nhi hai normal if else se bhi hoskta hai but ye short way hai
    if ([fullname, username, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }
    const emailRegex = /^\S+@\S+\.\S+$/   // kuch@kuch.kuch format
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Email is not valid")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters");
    }

    //Step3
    const existedUser = await User.findOne({
        $or: [{ email: email.trim().toLowerCase() }, { username: username.trim().toLowerCase() }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    //Step4
    //Optimal way to check for files and get their path jo humare public folder me save ho rhe hai(before cloudinary upload)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    //Step5
    //upload to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
        ? await uploadToCloudinary(coverImageLocalPath)
        : null;
    if (!avatar) {
        throw new ApiError(400, "Avatar is required ")
    }

    //Step6
    //create user in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", //optional
        username: username.toLowerCase(),
        email,
        password,
    })

    //Step7
    //remove password and refresh token from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "User not created")
    }

    // Step8-->return response to frontend
    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully in db yahhu"))
});


const loginUser = asyncHandler(async (req, res) => {

    //1. Get details from frontend (req body se ->data)
    //2. Now check that this user exists or not in db from email or username
    //3. If not redirect to register page , 
    //4. If yes then check password ... password matches then 
    //5. Generate access and refresh token 
    //6. Send them in cookies 
    //7. response bhej do ki validate hogya y nhi

    //Step1
    const { email, username, password } = req.body;
    if (!(email || username)) {
        throw new ApiError(400, "Email or username is required")
    }

    //Step2
    const existUser = await User.findOne({ $or: [{ email }, { username: username?.toLowerCase() }] })
    if (!existUser) { //if user doesn't exist(Step3)
        throw new ApiError(404, "User doesn't exists please register first")
    }

    //Step4
    const isPassValid = await existUser.iscorrectpassword(password)
    if (!isPassValid) {
        throw new ApiError(401, "Password is incorrect")
    }

    //5. Generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(existUser._id);


    const loggedInUser = await User.findById(existUser._id).select("-password -refreshToken")

    const isProd = process.env.NODE_ENV === "production"
    const baseOptions = { httpOnly: true, secure: true, sameSite: isProd ? "none" : "lax" }
    const accessOptions = { ...baseOptions, maxAge: 24 * 60 * 60 * 1000 }
    const refreshOptions = { ...baseOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }

    //6. Send them in cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(new ApiResponse(200,
            {
                user: loggedInUser
            },
            "User logged in successfully")
        )

})


const googleAuth = asyncHandler(async (req, res) => {

    //1. Get the Google ID token (credential) from frontend
    //2. Verify it with Google (signature + audience = our client id)
    //3. Find user by googleId or email, else create a new one
    //4. Generate tokens, send cookies (same as normal login)

    //1. Get the Google access token from frontend
    //2. Check it was issued for our app, then read the profile from Google
    //3. Find user by googleId or email, else create a new one
    //4. Generate tokens, send cookies (same as normal login)

    const { accessToken: googleToken } = req.body;
    if (!googleToken) {
        throw new ApiError(400, "Google access token is required")
    }

    let profile;
    try {
        // 1. Make sure this token was issued for OUR app (blocks tokens made for other apps)
        const info = await googleClient.getTokenInfo(googleToken);
        if (info.aud !== process.env.GOOGLE_CLIENT_ID) {
            throw new Error("Token audience mismatch");
        }

        // 2. Read name, email and photo from Google
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${googleToken}` },
        });
        if (!response.ok) throw new Error("Could not read Google profile");
        profile = await response.json();
    } catch {
        throw new ApiError(401, "Google sign-in failed, please try again")
    }

    const { sub, email, email_verified, name, picture } = profile;
    if (!email || !email_verified) {
        throw new ApiError(401, "Your Google email is not verified")
    }

    let user = await User.findOne({ $or: [{ googleId: sub }, { email: email.toLowerCase() }] });

    if (!user) {
        // First time: create the account from Google info
        const uploaded = picture ? await uploadRemoteToCloudinary(picture) : null;
        const fullname = name || email.split("@")[0];

        user = await User.create({
            googleId: sub,
            fullname,
            username: await makeUniqueUsername(email),
            email,
            avatar: uploaded?.url || picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}`,
            coverImage: "",
            // Required by the schema; random so password login is not possible for this account
            password: crypto.randomBytes(32).toString("hex"),
        });
    } else if (!user.googleId) {
        // Existing email/password account with the same verified email: link it
        user.googleId = sub;
        await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -googleId")

    const isProd = process.env.NODE_ENV === "production"
    const baseOptions = { httpOnly: true, secure: true, sameSite: isProd ? "none" : "lax" }
    const accessOptions = { ...baseOptions, maxAge: 24 * 60 * 60 * 1000 }
    const refreshOptions = { ...baseOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(new ApiResponse(200, { user: loggedInUser }, "Logged in with Google"))
})


const logoutUser = asyncHandler(async (req, res) => {

    // req.user is set in verifyJWT middleware, so we can access the logged-in user from req.user
    //1. Get user from req.user
    //2. Remove refresh token from db
    //3. Clear cookies from frontend
    //4. Send response to frontend

    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }, //this removes the field from the document
        { returnDocument: 'after' }
    );

    const isProd = process.env.NODE_ENV === "production"
    const baseOptions = { httpOnly: true, secure: true, sameSite: isProd ? "none" : "lax" }

    return res
        .status(200)
        .clearCookie("accessToken", baseOptions)
        .clearCookie("refreshToken", baseOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    //1. Get refresh token from cookies or request body
    //2. Verify it with jwt.verify() (fail ho to 401)
    //3. User dhundo aur DB wale token se match karo
    //4. Naye access + refresh token banao (DB me bhi save hota hai)
    //5. Cookies aur response me bhejo

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    // try/catch sirf jwt.verify ke liye (invalid/expired token => 401)
    let decodedToken
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token")
    }

    const user = await User.findById(decodedToken._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // purana/reuse hua token yahan pakda jayega
    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is expired or already used")
    }

    // naam wahi jo generateAccessandRefreshToken return karta hai
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const isProd = process.env.NODE_ENV === "production"
    const baseOptions = { httpOnly: true, secure: true, sameSite: isProd ? "none" : "lax" }
    const accessOptions = { ...baseOptions, maxAge: 24 * 60 * 60 * 1000 }
    const refreshOptions = { ...baseOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(new ApiResponse(200,
            {},
            "Access token refreshed successfully"
        ))
})


const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters");
    }
    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from the old one");
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isOldPasswordValid = await user.iscorrectpassword(oldPassword);
    if (!isOldPasswordValid) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})


const getcurrentuser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Current user details fetched successfully"));
})


const updateaccountdetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    if (!fullname?.trim() || !email?.trim()) {
        throw new ApiError(400, "Full name and email are required");
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        throw new ApiError(400, "Email is not valid");
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailTaken = await User.exists({ email: cleanEmail, _id: { $ne: req.user._id } });
    if (emailTaken) {
        throw new ApiError(409, "This email is already in use");
    }

    const user = await User.findByIdAndUpdate(req.user._id,
        { $set: { fullname: fullname.trim(), email: cleanEmail } },
        { returnDocument: 'after' }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
})


const updateuseravatar = asyncHandler(async (req, res) => {
    const avatarlocalPath = req.file?.path;
    if (!avatarlocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const oldAvatarUrl = user.avatar;
    const avatar = await uploadToCloudinary(avatarlocalPath);
    if (!avatar?.url) {
        throw new ApiError(500, "Error uploading avatar to Cloudinary");
    }

    user.avatar = avatar.url;
    await user.save();

    if (oldAvatarUrl) {
        await deleteFromCloudinary(oldAvatarUrl, "image");
    }

    const updatedUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Avatar updated successfully")
    );
});


const updateusercoverimage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is required");
    }

    // purana URL pehle hi rakh lo (req.user me coverImage aati hai)
    const oldCoverImage = req.user.coverImage

    const coverImage = await uploadToCloudinary(coverImageLocalPath)
    if (!coverImage?.url) {
        throw new ApiError(500, "Error uploading cover image to cloudinary");
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        { $set: { coverImage: coverImage.url } },
        { returnDocument: 'after' }
    ).select("-password -refreshToken");

    // save ke baad purana delete (khaali "" ho to function khud chhod deta hai)
    await deleteFromCloudinary(oldCoverImage, "image")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover image updated successfully"));
})


const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions", //in model its name is Subscription but in db it will be subscriptions
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedtochannels"
            }
        },
        {
            $addFields: {
                // ye jo humne 1st lookup me subscribers ka array banaya uska size count krke subscribersCount me dal diya
                subscribersCount: { $size: "$subscribers" },
                //ye jo humne 2nd lookup me subscribedtochannels ka array banaya uska size count krke subscribedToChannelsCount me dal diya
                subscribedToChannelsCount: { $size: "$subscribedtochannels" },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                subscribedToChannelsCount: 1,
                isSubscribed: 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "Channel profile fetched successfully"))
})

const searchUsers = asyncHandler(async (req, res) => {
    const query = req.query.query?.trim()
    if (!query) {
        return res.status(200).json(new ApiResponse(200, [], "Users fetched successfully"))
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const users = await User.find({
        $or: [
            { username: { $regex: safeQuery, $options: "i" } },
            { fullname: { $regex: safeQuery, $options: "i" } }
        ]
    })
        .select("username fullname avatar")
        .sort({ fullname: 1 })
        .limit(8)

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"))
})


const getWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                //ye sidha mongo db me jata hai isiliye humne mongoose.Types.ObjectId ka use kiya hai 
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    { $match: { isPublished: true } },
                    {
                        $project: { viewedBy: 0 }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $arrayElemAt: ["$owner", 0] }
                        }
                    }
                ]
            }
        }
    ])
    // $lookup returns the videos in database order, not in watch order,
    // so sort them by their position in the user's watchHistory array (newest first)
    const watchedIds = (user[0]?.watchHistory || []).map(String)
    const history = (user[0]?.videos || []).sort(
        (a, b) => watchedIds.indexOf(String(a._id)) - watchedIds.indexOf(String(b._id))
    )

    return res
        .status(200)
        .json(new ApiResponse(200, history, "Watch history fetched successfully"))
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getcurrentuser, updateaccountdetails, updateuseravatar, updateusercoverimage, getUserChannelProfile, searchUsers, getWatchHistory, googleAuth }