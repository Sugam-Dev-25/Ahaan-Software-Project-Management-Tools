const express=require('express')

const router=express.Router({mergeParams: true})

const {createColumn}= require('../controller/columnController')
const {protect} =require('../middleware/authMiddleware')
const { createTask } = require('../controller/taskController')


router.post('/create', protect, createColumn)

router.post('/:columnId/tasks', protect, createTask)


module.exports= router;