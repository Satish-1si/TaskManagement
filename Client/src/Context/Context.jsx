import axios from "axios";
import { createContext, useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const TaskManagerContext = createContext(null)
function TaskManagerProvider({children}){
    const [user , setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({
      title: '',
      description: '',
      priority: 'Low',
      status: 'To Do',
    });
const navigate = useNavigate()

const checkUserLoggedIn = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/user/check-login', { withCredentials: true });
    
    // console.log(response.data, "from useEffect");

    setUser(response.data.user);

     // Use the ternary operator to navigate based on the user's authentication status
     response.data.success
     ? location.pathname === '/auth' && navigate('/tasks/list')
     : location.pathname !== '/auth' && navigate('/auth');

            // Fetch tasks if the user is logged in
            if (response.data.success) {
              await fetchUserTasks();
          }

  } catch (error) {
    console.error('Error checking login status:', error);
    // Navigate to '/auth' if there's an error and the user is not already on '/auth'
    location.pathname !== '/auth' && navigate('/auth');
  }
};


   // Function to fetch tasks for the logged-in user
   const fetchUserTasks = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/task/user-tasks', { withCredentials: true });
        if (response.data.success) {
            setTasks(response.data.tasks);
        } else {
            console.error('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

const handleDelete = async (taskId) => {
  try {
    // Call the API to delete the task
    const response = await axios.delete(`http://localhost:3000/api/task/delete-task/${taskId}`, {
      withCredentials: true,
    });

    if (response.data.success) {
      // Update the task list after deletion
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
     toast.success(response.data.message);
    }
  } catch (error) {
    console.error('Error deleting task:', error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || error.message)
  }
};


const onDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
  ) {
      return;
  }

  const draggedTask = tasks.find(task => task._id === draggableId);

  let newPriority;
  switch (destination.droppableId) {
      case 'highPriority':
          newPriority = 'High';
          break;
      case 'mediumPriority':
          newPriority = 'Medium';
          break;
      case 'lowPriority':
          newPriority = 'Low';
          break;
      default:
          return;
  }

  const updatedTask = { ...draggedTask, priority: newPriority };

  // Update task priority in the state
  const updatedTasks = tasks.map(task =>
      task._id === draggableId ? updatedTask : task
  );
  setTasks(updatedTasks);

  // Update task priority in the database
  try {
      await axios.put(`http://localhost:3000/api/task/update-priority/${draggableId}`, {
          priority: newPriority
      },{
          withCredentials: true,
      });
      toast.success('Task priority updated!');
  } catch (error) {
      console.error('Failed to update task priority:', error);
      toast.error('Failed to update task priority')
  }
};





useEffect(() => {
  if (!user || location.pathname === '/auth') {
      checkUserLoggedIn();
  }
}, [navigate, location, user]);
    
    
    return (
        <TaskManagerContext.Provider value={{user ,handleDelete ,onDragEnd, setUser,taskData, setTaskData,tasks, setTasks}}>
        {children}
        </TaskManagerContext.Provider>
    )
} 

export default TaskManagerProvider