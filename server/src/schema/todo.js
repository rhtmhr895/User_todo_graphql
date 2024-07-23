const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name: { type: String },
    todos: [{ type: Object }],
    isDeleted : { type : Boolean, default : false },
    userId : { type : mongoose.Schema.Types.ObjectId, required : true }

}, { timestamps: true });

const Todos = mongoose.model("todo", todoSchema);
module.exports = Todos;