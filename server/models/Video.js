const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const videoSchema = mongoose.Schema({
    
    writer:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title :{
        type:String,
        maxLength:50
    },
    description:{
        type:String
    },
    privacy:{
        type:Number
    },
    filePath:{
        type:String
    },
    views:{
        type:String,
        default:0
    },
    duration:{
        type:String
    },
    thumbnail:{
        type:String
    }

},{timestamps:true});

const Video = mongoose.model('Video', videoSchema);

module.exports = {Video}