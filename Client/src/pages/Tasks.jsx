import React, { useContext, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskManagerContext } from '../Context/Context';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';

const Tasks = () => {
  const [open, setOpen] = useState(false);

  const { taskData, setTaskData, tasks, setTasks, onDragEnd, handleDelete, fetchUserTasks } = useContext(TaskManagerContext);
  let Data=(tasks?.records)?tasks?.records:[]
  let totalPages = tasks?.totalPages || 1;
  let currentPage = tasks?.currentPage || 1;

  const [activePage, setActivePage] = useState(currentPage);
  const tasksPerPage = 10;

 

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
    console.log(taskData, "from handleSubmit"); 
  
    try {
      // Sending a POST request to add a new task
      const response = await axios.post('https://task-management-git-main-satish-manepallis-projects.vercel.app/api/task/create-task', taskData, {
        withCredentials: true,
      });
  
      console.log(response, "0000");
  
      if (response.data.success) {
        toast.success(response.data.message);
       console.log(response.data)
        setTasks([...Data, response.data.task]);
  
        fetchUserTasks();
  
        setTaskData({
          title: '',
          description: '',
          priority: 'Low',
          status: 'To Do',
        });
        console.log("((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((")
        handleClose(); // Close the dialog/modal
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(error.response?.data?.message || 'Failed to add task');
    }
  };
  
  // Filter tasks by priority
  const highPriorityTasks = Data.filter(task => task.priority === 'HIGH');
  const mediumPriorityTasks = Data.filter(task => task.priority === 'MEDIUM');
  const lowPriorityTasks = Data.filter(task => task.priority === 'LOW');
  const [editingTask, setEditingTask] = useState(null); // State for tracking the task being edit
  //handle update task details
  
 

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    console.log(pageNumber, tasksPerPage)
    fetchUserTasks(pageNumber, tasksPerPage, "", "", ""); 
  };
  

  const handleEditClick = (task) => {
    setEditingTask(task); 
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://task-management-git-main-satish-manepallis-projects.vercel.app/api/task/update-task/${editingTask._id}`, editingTask, {
        withCredentials: true,
      });
      //  console.log(response.data,"from handleupdate task frontend")
      if (response.data.success) {
        // Update the tasks in the state
        setTasks((prevTasks) =>
          prevTasks.records.map((task) => (task._id === editingTask._id ? response.data.task : task))
        );
        fetchUserTasks()
        toast.success(response.data.message);
        setEditingTask(null); // Close the form after updating
      } else {
        console.error('Failed to update task:', response.data.message);
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating task26785679809-:', error);
      toast.error(error.response?.data?.message || error.message)
    }
  };




  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-semibold font-roboto
      b-2  text-center">Task Manager</h1>

      <button
        onClick={handleOpen}
        className="bg-blue-500  font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Add Task
      </button>

      {/* Task Creation Dialog */}
      {open && (
        <div className="fixed inset-0 z-10 bg-slate-950
         bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-500
           text-white  p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create a New Task</h2>
            <form >
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-600 border border-gray-300 rounded mb-4"
                required
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={taskData.description}
                onChange={handleChange}
                className="w-full p-2 border bg-zinc-600 border-gray-300 rounded mb-4"
                required
              />
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full p-2 border bg-zinc-600 border-gray-300 rounded mb-4"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                className="w-full p-2 border bg-zinc-600 border-gray-300 rounded mb-4"
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

<div className="flex items-center justify-between mt-8 mb-4">
  <h2 className="text-2xl font-bold">Task List</h2>
  <div className="flex justify-center my-4">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === activePage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
          />
        </Pagination>
      </div>

</div>


      <DragDropContext onDragEnd={onDragEnd}>
        <div className="px-4 max-w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Priority Column */}
            <Droppable droppableId="highPriority">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-2xl font-bold mb-4 text-red-600">High Priority</h2>
                  <ul className="space-y-4 bg-slate-600 min-h-[50vh] py-3 px-3 rounded-md border-[1px] border-dashed border-gray-400">
                    {highPriorityTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-red-300 rounded shadow-md relative"
                          >
                            <h3 className="text-lg font-bold">Title: {task.title}</h3>
                            <p className="text-gray-700 overflow-hidden">Desc: {task.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <div className='flex gap-3'>
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">{task.status}</span>
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">{task.priority}</span>


                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => handleEditClick(task)} // Handle edit click
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className="text-red-500 hover:text-red-700"><i className="ri-delete-bin-line"></i></button>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>

            {/* Medium Priority Column */}
            <Droppable droppableId="mediumPriority">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-2xl font-bold mb-4 text-yellow-600">Medium Priority</h2>
                  <ul className="space-y-4 bg-slate-600 min-h-[50vh] py-3 px-3 rounded-md border-[1px] border-dashed border-gray-400">
                    {mediumPriorityTasks.map((task, index) =>{
                      return (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 bg-yellow-400 rounded shadow-md relative"
                            >
                              <h3 className="text-lg font-bold">Title: {task.title}</h3>
                              <p className="text-gray-700  overflow-hidden">Desc: {task.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <div className='flex gap-3'>
                                  <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium rounded">{task.status}</span>
                                  <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium rounded">{task.priority}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => handleEditClick(task)} // Handle edit click
                                  >
                                    <i className="ri-edit-line"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(task._id)}
                                    className="text-red-500 hover:text-red-700"><i className="ri-delete-bin-line"></i></button>
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      )
                    }
                    
                    )}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>

            {/* Low Priority Column */}
            <Droppable droppableId="lowPriority">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-2xl font-bold mb-4 text-green-600">Low Priority</h2>
                  <ul className="space-y-4 bg-slate-600 min-h-[50vh] py-3 px-3 rounded-md border-[1px] border-dashed border-gray-400">
                    {lowPriorityTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-green-400 rounded shadow-md relative"
                          >
                            <h3 className="text-lg font-bold">Title: {task.title}</h3>
                            <p className="text-gray-700  overflow-hidden">Desc: {task.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <div className='flex gap-3'>
                                <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">{task.status}</span>
                                <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">{task.priority}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => handleEditClick(task)} // Handle edit click
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className="text-red-500 hover:text-red-700"><i className="ri-delete-bin-line"></i></button>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Edit Task Form */}
      {editingTask && (
        <form onSubmit={handleUpdateTask} className="p-4 bg-gray-600 text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-md mt-6 max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-2">Edit Task</h3>
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            className="w-full bg-zinc-600 p-2 mb-3 border rounded"
            placeholder="Task Title"
          />
          <textarea
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            className="w-full bg-zinc-600 p-2 mb-3 border rounded"
            placeholder="Task Description"
          />
          <select
            name="status"
            value={editingTask.status}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
            className="w-full p-2 border bg-zinc-600 border-gray-300 rounded mb-4"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Task
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            onClick={() => setEditingTask(null)} // Cancel button
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Tasks;
