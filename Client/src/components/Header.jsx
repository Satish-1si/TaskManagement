import axios from "axios";
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TaskManagerContext } from "../Context/Context";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const Header = () => {
  const { user, setUser, tasks, fetchUserTasks } = useContext(TaskManagerContext);
  const [filter, setFilter] = useState({ input: "", priority: "", status: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/logout",
        { withCredentials: true }
      );
      if (response.data.success) {
        setUser(null);
        toast.success(response.data.message);
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };
  let Data=(tasks?.records)? tasks?.records:[]
  // Debounced Input Change Handler
  const debouncedHandleInputChange = debounce((value) => {
    if (value.length > 0) {
      const filteredTasks = Data
        ?.filter((task) =>
          task.title.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredTasks);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    setFilter({ ...filter, input: e.target.value });
    debouncedHandleInputChange(e.target.value);
  };

  // Handle Search Button Click
  const handleSearch = () => {
    console.log("Searching for:", filter);
    fetchUserTasks(1, 10, filter.input, filter.priority, filter.status);
  };

  // Handle Selecting a Suggested Task
  const handleSelectSuggestion = (title) => {
    setFilter({ ...filter, input: title });
    setShowSuggestions(false);
  };

  // Close Suggestions on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-zinc-950 sticky z-30 top-0 h-15 border-b-2 flex items-center justify-between border-white-600 text-white w-full py-4 px-5">
      {/* Priority Filter */}
      <select
        id="priorityFilter"
        name="priorityFilter"
        className="p-2 rounded w-48 text-black"
        value={filter.priority}
        onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
      >
        <option value="">Select Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Status Filter */}
      <select
        id="statusFilter"
        name="statusFilter"
        className="p-2 rounded w-48 text-black"
        value={filter.status}
        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
      >
        <option value="">Select Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {/* Search Input with Typeahead */}
      <div className="relative w-1/2" ref={inputRef}>
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full p-2 rounded text-black"
          value={filter.input}
          onChange={handleInputChange}
        />
        {showSuggestions && (
      <ul className="absolute left-0 w-full bg-white text-black border rounded shadow-lg z-10">
      {suggestions.length > 0 ? (
        suggestions.map((task, index) => (
          <li
            key={index}
            className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
            onClick={() => handleSelectSuggestion(task.title)}
          >
            <span className="font-bold">{task.title}</span>
            
            <span className={`font-semibold ${task.status === 'DONE' ? 'text-green-600' : 'text-red-600'}`}>
              {task.status}{<>({task.priority.charAt(0)})</>}
            </span>
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-500">No matches found</li>
      )}
    </ul>
    
      
        )}
      </div>

      {/* Search Button */}
      <button
        className="bg-blue-600 px-3 py-1 rounded font-medium hover:bg-blue-700 transition"
        onClick={handleSearch}
      >
        Search
      </button>

      {/* Logout Button */}
      <button onClick={handleLogout} className="text-white flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-box-arrow-right"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
          />
          <path
            fillRule="evenodd"
            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Header;
