import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import Tasks from './pages/Tasks'
import CommonLayout from './components/Layout/CommonLayout'
import ScrumBoard from './pages/ScrumBoard'

const App = () => {
  return (
   <>
   <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path='/tasks' element={<CommonLayout/>}> 
        <Route path='list' element={<Tasks/>} />
        <Route path='scrum-board' element={<ScrumBoard />}/>
    </Route>
      
      <Route path="/*" element={<NotFound/>} />
   </Routes>
   </>
  )
}

export default App
