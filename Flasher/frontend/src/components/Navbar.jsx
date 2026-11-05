import React from 'react'
import reactLogo from '../assets/react.svg'
import Signup from './Signup'

const Navbar = () => {
    return (
        <>
            <div className='bg-black text-white flex justify-between items-center p-4'>
                <div className=''>
                    <img src={reactLogo} alt="React logo" />
                </div>
                <search className='border border-gray-300 rounded-md p-2 pr-20'>
                    <input type="text" placeholder="Search..." />
                </search>
                <ul className='flex gap-4'>
                    <li>:</li>
                    <li>Login</li>
                    <li><Signup /></li>
                </ul>
            </div>
            <div className='w-full h-1 bg-gray-400'></div>
        </>
    )
}

export default Navbar
