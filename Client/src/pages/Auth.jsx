import React, { useState } from 'react'
import SignIn from '../components/auth/SignIn'
import SignUp from '../components/auth/SignUp'

const Auth = () => {
  const [authView , setauthView] = useState(false)
  return (
    <div className='flex flex-col pt-8 items-center justify-normal min-h-screen h-full w-full bg-zinc-700 text-white'>
    <h1 className='text-3xl font-bold'>Welcome</h1>
   {
      authView ? <SignIn /> : <SignUp/>
   }
    <button
    className='py-2 px-8 bg-zinc-900 mt-5 rounded-md'
    onClick={() => setauthView(!authView)}
    >
      {authView ? 'Create an account' : ' I have already account'}
    </button>
    </div>
  )
}

export default Auth
