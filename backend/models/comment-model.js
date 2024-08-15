
import  mongoose from "mongoose";


const commentSchema= ()=>mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    required:true
    }
})



export const commentSchema= mongoose.model('Comment',commentSchema)