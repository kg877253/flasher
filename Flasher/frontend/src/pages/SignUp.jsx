import React from 'react'

const SignUp = () => {
  return (
    <div className='signup flex flex-col items-center justify-center '>
      <form action="submit" method="post" className='flex flex-col gap-4 h-[50%] w-[50%] m-10 p-4 rounded-lg shadow-md'>
        <input type="text" placeholder="Username" />
        <input type="text " placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="file" name="avatar" id="avatar" placeholder='Avatar'/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp
