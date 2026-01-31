const Board = require("../models/Board");
const User = require("../models/User");
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
    const { name, role, email, password } = req.body
    const creatingRole = req.user.role;
    if (role === "super-admin") {
        return res.status(403).json({ message: "Super admin only create there account via seeds only" })
    }
    if (creatingRole === "admin" && admin === "admin") {
        return res.status(403).json({ message: "Admin can not create another admin account" })
    }
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(403).json({ message: "User already have an account" })
        }
        const newUser = new User({ name, email, password, role })
        await newUser.save()
        res.status(201).json({
            message: `User creates successfully user Name:${newUser.name}`, user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            }
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }

}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = User.findOne({ email })
        if (!user) return res.status(404).json({ message: "Invalid credentails" })
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) return res.status(404).json({ message: "Invalid Credentials" })
        const token = user.generateJwt()
        res.cookie("authToken", token, cookieOptions)
    }
    catch (error) {
        console.log("server error", error);
        return res.status(500).json({ message: "Internal Server error" })
    }
}

const logoutUser = async (req, res) => {
    await res.clearCokies('authToken', cookieOptions)
    res.status(200).json({ message: "Logout successfully" })
}

const getProfile = (req, res) => {
    res.status(200).json({
        message: "Profile data",
        user: req.user
    })
}

const SearchUsers = async (req, res) => {
    const { query, boardId } = req.query;
    if (!query || query.length < 2) {
        return res.status(400).json({ message: "atltest 2 character is required for search" })
    }
    try {
        let search = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }
        const users = await User.find(search)
            .select('_id name email role')
            .limit(10)
        res.status(200).json(users)
    }
    catch (error) {
        console.log("server error", error)
        res.status(500).json({ message: "Internal Server error" })
    }

}

const Max_age = 3 * 24 * 60 * 60 * 1000

const cookieOptions = {
    httpOnly: true,
    maxAge: Max_age,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'Strict'

}


const createBoard = async (req, res) => {
    const { name, members } = req.body
    const ownerId = req.user._id
    try {
        const newBoard = new Board({
            name,
            owner: ownerId,
            members: [ownerId, ...(members || [])]
        })
        await newBoard.save()
        await User.updateMany(
            { _id: { $in: newBoard.members } },
            { $addToSet: { memberOfBoards: newBoard._id } }
        )
        res.status(201).json(newBoard)

    }
    catch (error) {
        console.log("something went wrong", error)
        res.status(500).json({ message: "Something erron in Internal server" })
    }

}

const getBoardsForUser = async (req, res) => {
    try {
        const boards = await Board.find({
            members: req.user._id
        })
            .select("_id name owner members")
            .populate("owner", "name email role")
            .populate("members", "name email role")

        res.status(200).json(boards)
    }
    catch (error) {
        res.status(500).json({ message: "Internale server error" })
    }
}

const getboardById = async (req, res) => {
    const boardId = req.params.id
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'columns',
                populate: {
                    path: tasks,
                    model: Task,
                    populate: {
                        path: 'assignedTo',
                        model: 'User',
                        select: 'name email role profilepicture'
                    }
                }
            })
            .populate("owner", "name email")
            .populate("members", "name email role")
        if (!board) return res.status(404).json({ message: "Board not found" })
        const isMember = Array.isArray(board.members) && board.members.some(member => member?._id?.toString() === req.user._id?.toString())
        if (!isMember) return res.status(403).json({ message: "Access denied: You are not member of Board" })
        res.status(200).json(board)

    }
    catch (error) {
        console.log("something went wrong please check logic", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const addMemberToBoard = async (req, res) => {
    const { boardId } = req.params
    const { memberId } = req.body
    try{
        const board=await Board.findById(boardId)
        if(!board) return res.status(404).json({message: 'Board not found'})
        if(board.members.includes(memberId)) return res.status(403).status({message: "Member already exist on Board"})
        board.members.push(memberId)
        await board.save()

        await User.findByIdAndUpdate(memberId, {
            $addToSet: {memberOfBoards: board._id}
        })

        await board.populate('members','name email role')
        res.status(200).json()
    }
}