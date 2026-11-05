import React from 'react'
import Navbar from './Navbar'

const Home = () => {
  return (
    <>
      <div className='bg-black min-h-screen'>

        <Navbar />
        <div className="main flex">

          <div className="sidebar w-[20%] h-[89vh] text-white p-4 flex flex-col justify-between">
            <div className="info flex flex-col gap-1">
              <div className='border border-white p-2 font-bold text-[18px]'>Home</div>
              <div className='border border-white p-2 font-bold text-[18px]'>Liked Videos</div>
              <div className='border border-white p-2 font-bold text-[18px]'>History</div>
              <div className='border border-white p-2 font-bold text-[18px]'>My Content</div>
              <div className='border border-white p-2 font-bold text-[18px]'>Collection</div>
              <div className='border border-white p-2 font-bold text-[18px]'>Subscribers</div>
            </div>

            <div className="configure flex flex-col gap-1">
              <div className='border border-white p-3 font-bold text-[18px]'>Setting</div>
              <div className='border border-white p-3 font-bold text-[18px]'>Suppprt</div>
            </div>

          </div>

          <div className="line w-1 bg-gray-400"></div>

          <div className="videstab w-[80%] h-[89vh] text-white p-4"></div>
        </div>
      </div>
    </>
  )
}

export default Home
