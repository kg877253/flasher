import React from 'react'

const Login = () => {
  return (
    <>
    <div>
        <form action="submit">
            <input type="text" placeholder="Username/email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
    </>
  )
}

export default Login
