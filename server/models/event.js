var mongoose=require('mongoose');



const eventSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    url:{
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    startdatetime:{
        type:String,
        required: true,
    },
    enddatetime:{
        type:String,
        

    },
    postedby:{
        type: String
    },
    tags:{
        type: [String], index: true
    }
}, { timestamps: true } )  ;





module.exports=mongoose.model('Event',eventSchema);