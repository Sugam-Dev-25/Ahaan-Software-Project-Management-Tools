const mongoose =require('mongoose')
const {Schema} =require('mongoose')

const BoardSchema = new Schema({
    name: {type: String, required: true},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    columns:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    }]
}, {timestamps: true})

module.exports=mongoose.model('Board', BoardSchema)