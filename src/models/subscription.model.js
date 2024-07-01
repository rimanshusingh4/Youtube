import mongoose, {Schema, Types} from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //jisne subscribe kiys hai uska details
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, //jisko, jisne subscribe kiys hai uska details
        ref: "User"
    },

}, 
{
    timestamps: true,
})



export const subscription = mongoose.model("subscription", subscriptionSchema)