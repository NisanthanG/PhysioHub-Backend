const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

patient:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

physio:{
type:mongoose.Schema.Types.ObjectId,
ref:"Physio"
},

bookingType:{
type:String,
enum:["home","clinic","online"]
},

date:Date,

status:{
type:String,
enum:[
"pending",
"accepted",
"completed",
"cancelled"
],
default:"pending"
},

paymentStatus:{
type:String,
default:"unpaid"
}

},
{
timestamps:true
});

module.exports = mongoose.model("Booking",bookingSchema);