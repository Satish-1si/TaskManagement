import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TaskManagerContext } from '../Context/Context'
import { toast } from 'react-toastify'

const Header = () => {
    const {user,setUser} = useContext(TaskManagerContext);
    const navigate = useNavigate()
    // console.log(user,"form logout ")
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get('http://localhost:3000/api/user/logout', { withCredentials: true });
          if(response.data.success){
            setUser(null);
            toast.success( response.data.message);
            navigate('/auth')
          }

        } catch (error) {
          console.log(error);
        }
      };
  return (
    <div className='bg-zinc-700 sticky top-0 h-15 border-b-2 flex items-center justify-between border-gray-600 text-white w-full py-4 px-5'>
      <h1 className='font-bold text-2xl'>Header</h1>
      <div className='flex gap-3 items-center justify-center text-sm font-semibold'>
        <Link to={'list'} className='hover:text-gray-300'>Home</Link>
        <Link to={'scrum-board'} className='hover:text-gray-300'>Board</Link>
        <button onClick={handleLogout}  className='hover:text-gray-300 bg-red-600 py-2 px-4 rounded-md'>Logout</button>

      </div>

    </div>
  )
}

export default Header
