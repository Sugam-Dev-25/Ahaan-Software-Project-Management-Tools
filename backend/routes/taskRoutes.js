const express=require('express')
const router=express.Router()
const { getTaskById, moveTask} =require('../controller/taskController')
const {protect}=require('../middleware/authMiddleware')

router.get('/:id', protect, getTaskById)

router.put('/:id/move', protect, moveTask)

module.exports = router;