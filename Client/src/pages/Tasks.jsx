import React, { useContext, useState } from 'react';
import axios from 'axios';
import { TaskManagerContext } from '../Context/Context';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [open, setOpen] = useState(false);

 const {taskData, setTaskData,tasks, setTasks, handleDelete} = useContext(TaskManagerContext);
//  console.log(tasks)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(taskData,"from handle submit")
    try {
      // Sending a POST request to the backend to add a new task
      const response = await axios.post('http://localhost:3000/api/task/create-task',taskData,{
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message)
        // Update the task list with the newly added task
        setTasks([...tasks, response.data.task]);
        // Reset form data
        setTaskData({
          title: '',
          description: '',
          priority: 'Low',
          status: 'To Do',
        });
        handleClose(); // Close the dialog
      }
    } catch (error) {
       console.error('Error adding task:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message)
    }
  };

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>

      <button
        onClick={handleOpen}
        className="bg-blue-500  font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Add Task
      </button>

      {/* Task Creation Dialog */}
      {open && (
        <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-zinc-600 text-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create a New Task</h2>
            <form >
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-gray-500  font-semibold py-2 px-4 rounded mr-2 hover:bg-gray-600 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500  font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Create Task
              </button>
            </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold  h-auto mt-8 mb-4">Task List</h2>
      <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="relative p-6 bg-zinc-600 rounded-lg shadow-md flex flex-col"
        >
         

          {/* Task Details */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Title: {task.title}</h3>
            </div>
            <p className="text-gray-300 mb-4">Description: {task.description}</p>

            <div className="flex gap-5 items-center">
              <span className=" text-sm font-medium text-white  ">
                Priority: {task.priority}
              </span>
              <span className=" text-sm font-medium text-white ">
                Status: {task.status}
              </span>
            </div>
             {/* Icons */}
          <div className="relative mt-4 flex space-x-3">
            <button
              className="text-white bg-gray-800 py-1 px-6 rounded-md hover:text-blue-300 transition duration-300 ease-in-out"
              onClick={() => handleEdit(task)}
            >
              <i className="ri-edit-line text-xl"></i>
            </button>

            <button
              className="bg-gray-800 text-red-400 py-1 px-6 rounded-md hover:text-red-300 transition duration-300 ease-in-out"
              onClick={() => handleDelete(task._id)}
            >
              <i className="ri-delete-bin-line text-xl"></i>
            </button>
          </div>
          </div>
        </li>
      ))}
    </ul>

    </div>
  );
};

export default Tasks;
