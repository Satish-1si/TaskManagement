import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

const CommonLayout = () => {
  return (
    <div className='bg-black min-h-[100vh] pb-10 text-white w-full  '>
      <Header/>
      <Outlet/>
    </div>
  )
}

export default CommonLayout
