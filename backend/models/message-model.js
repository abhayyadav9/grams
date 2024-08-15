import mongoose from "mongoose";



const mesasgeSchema=   mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    message:{
        type:String,
        require:true
    }

})

export default Message = mongoose.model('Message',mesasgeSchema)