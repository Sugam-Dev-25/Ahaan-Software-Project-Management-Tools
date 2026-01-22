const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const Notification = require('./Notification');
const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,

    }
}, { timestamps: true });

const activitySchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g., "Updated status"
    details: {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed
    }
}, { timestamps: true });

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        Min: 0,
        Max: 100,
        default: 0
    },
    position: { type: Number, default: 0 },
    description: { type: String },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    dueDate: Date,
    startDate: Date,
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },

    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    comments: [commentSchema],
    activityLog: [activitySchema],
    // Add to your TaskSchema
    timeManagement: {
        estimatedTime: { type: Number, default: 0 }, 
        totalLoggedTime: { type: Number, default: 0 }, 
        delay: { type: Number, default: 0 },
        dailyLogs: [{
            date: { type: String }, 
            duration: { type: Number, default: 0 } 
        }],
        activeStartTime: { type: Date, default: null },
        isRunning: { type: Boolean, default: false }
    }
}, { timestamps: true })

TaskSchema.pre('save', async function (next) {
    if (this.isNew || !this._userContext) return next();

    const modifiedPaths = this.modifiedPaths();

    const ignoreFields = ['activityLog', 'updatedAt', 'comments', 'board', '__v'];

    for (const path of modifiedPaths) {
        if (ignoreFields.some(field => path.startsWith(field))) continue;

        const newValue = this.get(path);
        const oldValue = this._originalValues ? this._originalValues[path] : null;

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            let actionText = `updated the ${path}`;
            if (path === 'priority') {
                actionText = `changed priority from ${oldValue || 'none'} to ${newValue}`;
            }
            else if (path === 'labels') {
                const oldNames = oldValue?.map(l => l.name) || [];
                const newNames = newValue?.map(l => l.name) || [];
                const added = newNames.filter(n => !oldNames.includes(n));
                if (added.length > 0) actionText = `added label: ${added.join(', ')}`;
                else continue;
            }
            else if (path === 'assignedTo') {
                const oldIds = (oldValue || []).map(id => id.toString());
                const newIds = (newValue || []).map(id => id.toString());
                const addedId = newIds.find(id => !oldIds.includes(id));

                if (addedId) {
                    const User = mongoose.model('User');
                    const user = await User.findById(addedId).select('name');
                    actionText = `assigned task to ${user ? user.name : 'a user'}`;
                } else {
                    continue;
                }
            }
            this.activityLog.push({
                user: this._userContext,
                action: actionText,
                details: { field: path, oldValue, newValue }
            });
        }
    }
    next();
});
TaskSchema.post('save', async function (doc) {
    console.log("--- Post Save Hook Triggered ---");
    
    if (!doc._userContext) {
        console.log("Exit: No _userContext found on document.");
        return;
    }

    const lastActivity = doc.activityLog[doc.activityLog.length - 1];
    if (!lastActivity) {
        console.log("Exit: No activity log found.");
        return;
    }

    // Check if there are other people assigned
    const recipients = doc.assignedTo.filter(
        id => id.toString() !== doc._userContext.toString()
    );

    console.log(`Context User: ${doc._userContext}`);
    console.log(`Total Assigned: ${doc.assignedTo.length}`);
    console.log(`Recipients to notify: ${recipients.length}`);

    if (recipients.length > 0) {
        const notifications = recipients.map(recipientId => ({
            recipient: recipientId,
            sender: doc._userContext,
            task: doc._id,
            action: lastActivity.action,
            isRead: false
        }));

        try {
            const result = await Notification.insertMany(notifications);
            console.log("Success: Notifications created in DB:", result.length);
        } catch (err) {
            console.error("DB Error during notification creation:", err.message);
        }
    } else {
        console.log("Exit: No one to notify (You are the only one assigned).");
    }
});

module.exports = mongoose.model('Task', TaskSchema)