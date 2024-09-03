import React, { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate()
  // State to handle form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation (can be expanded)
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('https://task-management-mern-app.onrender.com/api/user/register', formData, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message);
        // console.log(response.data)
        // Reset form data
        navigate('/tasks/list')
        setFormData({
          name: '',
          email: '',
          password: ''
        });
      } else {
        toast.error(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle the case where email is already registered
        toast.error(error.response.data.message);
      } else {
        // Handle other errors (e.g., network issues)
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-[70vh] w-[90vw]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your name..."
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 border rounded-b-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
