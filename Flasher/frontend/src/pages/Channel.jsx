import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {getUserChannelProfile} from '../api/user.api.js'

const Channel = () => {

    const { username } = useParams()
    const [channelProfile,setchannelProfile] =useState([])

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
        <div>
            <h1>Channel: {channelProfile?.name}</h1>
            <h2>{username}</h2>
            <p>{channelProfile?.description}</p>
            <h2>{channelProfile?.name}</h2>
        </div>
    )
}

export default Channel
