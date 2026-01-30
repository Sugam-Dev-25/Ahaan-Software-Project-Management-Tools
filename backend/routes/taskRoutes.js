// routes/taskRoutes.js

const express = require('express');
const router = express.Router(); 
const { moveTask, updateTask, deleteTask, addTaskComment,  toggleTimer, getTasks } = require('../controller/taskController');
const { protect } = require('../middleware/authMiddleware');

router.patch('/:taskId/move', protect, moveTask);
router.patch("/:taskId", protect, updateTask)
router.delete("/:taskId", protect, deleteTask)
router.post('/:taskId/comments', protect, addTaskComment)
router.post('/:taskId/timer',protect, toggleTimer)
router.get('/', protect, getTasks);
module.exports = router;