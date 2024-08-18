import axios from "axios";
import { createContext, useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";

export const TaskManagerContext = createContext(null)
function TaskManagerProvider({children}){
    const [user , setUser] = useState(null);;
const navigate = useNavigate()

   
  useEffect(() => {
    // Check if the user is logged in by verifying the token
    const checkUserLoggedIn = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/check-login', { withCredentials: true });
        
        console.log(response.data, "from useEffect");
        if (response.data.success) {
          setUser(response.data.user);
          navigate('/tasks/list'); // Use navigate instead of history
        } else {
            navigate('/auth'); // Use navigate instead of history
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        navigate('/auth'); // Use navigate instead of history
    }
};

checkUserLoggedIn();
}, [navigate]); 
console.log(user)
    
    
    return (
        <TaskManagerContext.Provider value={null}>
        {children}
        </TaskManagerContext.Provider>
    )
} 

export default TaskManagerProvider