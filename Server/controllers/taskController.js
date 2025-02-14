const Task = require('../models/task');
const User = require('../models/user');

// Add a New Task
const addTask = async (req, res) => {
    try {
        const { title, description, priority, status } = req.body;

        if (!title || !description || !priority || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const task = await Task.create({
            title,
            description,
            user: req.userId,
            priority: priority.toUpperCase(),
            status: status.toUpperCase(),
        });

        user.tasks.push(task._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Task added successfully",
            task,
        });
    } catch (error) {
        console.error("Error in addTask:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
        });
    }
};

// Get Tasks for a User with Filters and Pagination
const userTask = async (req, res) => {
    try {
        const { input, priority, status, page = 1, limit = 10 } = req.query;

        let filter = { user: req.userId };

        if (input) filter.title = { $regex: input, $options: "i" };
        if (priority) filter.priority = priority.toUpperCase();
        if (status) filter.status = status.toUpperCase();

        const skip = (page - 1) * limit;

        // Fetch paginated tasks
        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Count total records with the filter applied
        const totalTasks = await Task.countDocuments(filter);

        // Count total records in the entire collection (ignoring filters)
        const totalRecords = await Task.countDocuments({ user: req.userId });

        return res.status(200).json({
            success: true,
            records:tasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: parseInt(page),
            totalTasks,
            totalRecords, // Total records without filters
        });
    } catch (error) {
        console.error("Error in userTask:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching tasks.",
        });
    }
};


// Delete a Task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        await User.findByIdAndUpdate(task.user, { $pull: { tasks: taskId } });

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteTask:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
        });
    }
};

// Update a Task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, priority: priority?.toUpperCase(), status: status?.toUpperCase() },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.error("Error in updateTask:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
        });
    }
};

// Update Task Priority
const updateTaskPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { priority: priority.toUpperCase() },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task priority updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.error("Error in updateTaskPriority:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};

module.exports = {
    addTask,
    userTask,
    deleteTask,
    updateTask,
    updateTaskPriority,
};
