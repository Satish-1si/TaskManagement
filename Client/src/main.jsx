import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskManagerProvider from './Context/Context.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <TaskManagerProvider>
    <App />
    <ToastContainer />
    </TaskManagerProvider>
  </BrowserRouter>
)
