const express=require('express')
const router=express.Router()
const { createBoard, getBoardsForUser, getBoardById, addMemberToBoard  } =require("../controller/boardController")
const { protect, hasAdminPrivileges } =require( "../middleware/authMiddleware")
const columnRoutes=require('../routes/columnRoute')

router.post('/', protect, hasAdminPrivileges,  createBoard)

router.get('/', protect, getBoardsForUser)

router.get('/:id', getBoardById)

router.use('/:boardId/columns', columnRoutes);

router.patch('/:boardId/add-member', hasAdminPrivileges, addMemberToBoard)


module.exports=router;