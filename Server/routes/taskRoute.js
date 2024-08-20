const express = require('express');
const { addTask, userTask, deleteTask, updateTaskPriority, updateTask } = require('../controllers/taskController');
const { isAuth } = require('../middlewares/auth');
const authenticateUser = require('../middlewares/authenticateUser');
const router = express.Router();

router.post('/create-task',authenticateUser,addTask);
router.get('/user-tasks',authenticateUser,userTask);
router.delete('/delete-task/:id',authenticateUser,deleteTask);
router.put('/update-priority/:id',authenticateUser,updateTaskPriority);
router.put('/update-task/:id',authenticateUser, updateTask);



module.exports = router;