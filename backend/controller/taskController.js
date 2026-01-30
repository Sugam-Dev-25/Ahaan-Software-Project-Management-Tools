const Task = require('../models/Task')
const Column = require('../models/Column')
const Board = require('../models/Board')
const createTask = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { title, description, priority, assignedTo, dueDate, startDate } = req.body;
  try {
    const board = await Board.findById(boardId).select('members');
    if (!board) {
      return res.status(404).json({ mssage: 'Board not found' })
    }
    const isMember = board.members.some(member => member._id.toString() == req.user._id.toString())
    if (!isMember) {
      return res.status(403).json({ message: 'Access Denied: You must be member' })
    }
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      startDate,
      assignedTo,
      column: columnId,
      board: boardId,
      activityLog: [{
        user: req.user._id,
        action: "Task created"
      }],
      _userContext: req.user._id,

    })
    await newTask.save()
    await Column.findByIdAndUpdate(
      columnId,
      { $push: { task: newTask._id } },
      { new: true }
    )
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask)
  }
  catch (error) {
    console.error(`Error creating task for column ${columnId}:`, error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Id format provided' })
    }
    res.status(500).json({ message: 'Server Error: Failed to create task' });
  }
}

const moveTask = async (req, res) => {
  const { newColumnId, newPosition } = req.body;
  const taskId = req.params.taskId;

  try {
    // IMPORTANT: You must populate 'column' to get the .title for the activity log
    const task = await Task.findById(taskId).populate('column');
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldColumnId = task.column._id;
    const oldColumnTitle = task.column.name;

    if (String(oldColumnId) !== String(newColumnId)) {
      const newCol = await Column.findById(newColumnId);

      // Now oldColumnTitle will work because we populated above
      task.activityLog.push({
        user: req.user._id,
        action: `Moved status from "${oldColumnTitle}" to "${newCol.name}"`
      });

      task.column = newColumnId;

      // Update the Column documents references
      await Column.findByIdAndUpdate(oldColumnId, { $pull: { tasks: taskId } });
      await Column.findByIdAndUpdate(newColumnId, { $push: { tasks: taskId } });
    } else {
      task.activityLog.push({
        user: req.user._id,
        action: `Changed position in ${oldColumnTitle}`
      });
    }

    task.position = newPosition;
    await task.save();

    // 3. Reindex NEW column tasks
    const allTasksInCol = await Task.find({
      column: newColumnId,
      _id: { $ne: taskId }
    }).sort('position');

    allTasksInCol.splice(newPosition, 0, task);

    await Task.bulkWrite(
      allTasksInCol.map((t, i) => ({
        updateOne: {
          filter: { _id: t._id },
          update: { $set: { position: i } }
        }
      }))
    );

    // 4. Reindex OLD column if needed
    if (String(oldColumnId) !== String(newColumnId)) {
      const oldColTasks = await Task.find({ column: oldColumnId }).sort('position');
      await Task.bulkWrite(
        oldColTasks.map((t, i) => ({
          updateOne: {
            filter: { _id: t._id },
            update: { $set: { position: i } }
          }
        }))
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database update failed" });
  }
};
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task._userContext = req.user._id;
    task._originalValues = JSON.parse(JSON.stringify(task));
    Object.keys(updates).forEach((key) => {
        task[key] = updates[key];
    });

    await task.save(); 

    const populatedTask = await Task.findById(taskId)
      .populate('assignedTo', 'name email')
      .populate('activityLog.user', 'name');

    res.status(200).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json("Task already deleted");

    console.log(`User ${req.user._id} deleted task: ${task.title}`);

    await Task.findByIdAndDelete(taskId);

    await Column.findByIdAndUpdate(task.column, { $pull: { tasks: taskId } });

    res.status(200).json("Task deleted successfully");
  } catch (error) {
    res.status(500).json("Failed to delete task");
  }
};
const addTaskComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task._userContext = userId;
    task.comments.push({ user: userId, text: text, createdAt: new Date() });
    task.activityLog.push({
      user: userId,
      action: `added a comment: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`,
      createdAt: new Date()
    });

    // This ONE save triggers the TaskSchema.post('save') notification logic
    await task.save(); 

    const updatedTask = await Task.findById(taskId)
      .populate('comments.user', 'name email')
      .populate('activityLog.user', 'name')
      .populate('assignedTo', 'name email');

    res.status(201).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleTimer = async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const now = new Date();

    if (task.timeManagement.isRunning) {
        const startTime = new Date(task.timeManagement.activeStartTime);
        const workDone = now.getTime() - startTime.getTime();
        const deadline = task.dueDate ? new Date(task.dueDate).getTime() : null;
        const goalMs = (task.timeManagement.estimatedTime || 0) * 3600000;
        
        let sessionDelay = 0;

        // --- CALCULATION A: Check Due Date Delay ---
        if (deadline && now.getTime() > deadline) {
            sessionDelay = startTime.getTime() > deadline 
                ? workDone 
                : now.getTime() - deadline;
        }

        // --- CALCULATION B: Check Estimated Goal Overtime ---
        // If the total time (including this session) exceeds the goal
        const totalAfterSession = task.timeManagement.totalLoggedTime + workDone;
        if (goalMs > 0 && totalAfterSession > goalMs) {
            const overtimeInThisSession = totalAfterSession - Math.max(task.timeManagement.totalLoggedTime, goalMs);
            // Use Math.max to ensure we only add delay that isn't already counted by the deadline
            sessionDelay = Math.max(sessionDelay, overtimeInThisSession);
        }

        // Update Task Fields
        task.timeManagement.delay = (task.timeManagement.delay || 0) + sessionDelay;
        task.timeManagement.totalLoggedTime += workDone;
        
        // Log daily progress
        const todayStr = now.toISOString().split('T')[0];
        const dayEntry = task.timeManagement.dailyLogs.find(log => log.date === todayStr);
        if (dayEntry) dayEntry.duration += workDone;
        else task.timeManagement.dailyLogs.push({ date: todayStr, duration: workDone });

        task.timeManagement.isRunning = false;
        task.timeManagement.activeStartTime = null;
    } else {
        task.timeManagement.isRunning = true;
        task.timeManagement.activeStartTime = now;
    }

    await task.save();
    res.status(200).json(task);
};
const getTasks = async (req, res) => {
  try {
    const { scope, boardId, columnId } = req.query;
    // board view
    if (boardId && columnId) {
      const board = await Board.findById(boardId).select('members');
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }

      if (!board.members.some(m => m.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const tasks = await Task.find({ board: boardId, column: columnId })
        .populate('assignedTo', 'name email role')
        .populate('attachments.uploadedBy', 'name email')
        .populate('comments.user', 'name profilePicture')
        .populate('activityLog.user', 'name')
        .sort({ position: 1 });

      return res.status(200).json(tasks);
    }
// Individual assign task
    if (scope === 'mine') {
      const tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('board', 'name')
        .populate('column', 'name')
        .populate('comments.user', 'name profilePicture') // Added
        .populate('activityLog.user', 'name')
        .sort({ createdAt: -1 });

      return res.status(200).json(tasks);
    }

    // All Task
    const boards = await Board.find({ members: req.user._id }).select('_id');
    const boardIds = boards.map(b => b._id);

    const tasks = await Task.find({ board: { $in: boardIds } })
      .populate('assignedTo', 'name email')
      .populate('board', 'name')
      .populate('column', 'name')
      .populate('comments.user', 'name profilePicture') 
      .populate('activityLog.user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};


module.exports = { createTask, moveTask, updateTask, deleteTask, addTaskComment,  toggleTimer, getTasks }