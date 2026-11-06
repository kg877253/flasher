import React from 'react'

const Login = () => {
  return (
    <>
    <div className='login flex flex-col items-center justify-center '>
        <form action="submit" method="post" className='flex flex-col gap-4 h-[50%] w-[50%] m-10 p-4 rounded-lg shadow-md'>
            <input type="text" placeholder="Username/email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
    </>
  )
}

export default Login
