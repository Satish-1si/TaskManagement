import React from 'react'
import { Outlet } from 'react-router-dom'

const CommonLayout = () => {
  return (
    <div>
      <h1>Common Layout</h1>
      <Outlet/>
    </div>
  )
}

export default CommonLayout
