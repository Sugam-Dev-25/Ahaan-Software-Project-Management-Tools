const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const notificationSchema = new Schema({
    recipient: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    task: { 
        type: Schema.Types.ObjectId, 
        ref: 'Task' 
    },
    action: { 
        type: String, 
        required: true 
    }, // e.g., "added a comment" or "changed priority"
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// Indexing for faster lookups when a user opens their notifications
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);