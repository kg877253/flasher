import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserChannelProfile } from '../api/user.api.js'

const Channel = () => {

    const { username } = useParams()
    const [channelProfile, setchannelProfile] = useState(null)

    useEffect(() => {
        const fetchChannelProfile = async () => {
            try {
                const channelProfile = await getUserChannelProfile(username)
                setchannelProfile(channelProfile)
                console.log(channelProfile)
            }
            catch (error) {
                console.error(error)
            }
        }
        fetchChannelProfile()
    }, [username])

    return (
        <>
            {channelProfile ? (
                <div className="channelinfo">
                    <img className="absolute w-full h-60 object-cover" src={channelProfile.coverImage} alt="coverImage" />
                    <div className="info">
                        <img className="relative -bottom-54 left-6 w-36 h-36 rounded-full border-4 border-white object-cover" src={channelProfile.avatar} alt="avatar" />
                        <div className="relative -bottom-30 left-52">
                            <h1 className="text-4xl font-semibold">{channelProfile.fullname}</h1>
                            <p className="text-gray-300">@{channelProfile.username}</p>
                            <p className="text-gray-300">{channelProfile.subscribersCount} Subscribers • {channelProfile.subscribedToChannelsCount} Subscribed </p>
                        </div>
                        <div></div>
                    </div>
                </div>
            ) : (
                <p>Loading...........</p>
            )}
        </>
    )
}

export default Channel
