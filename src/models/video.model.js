import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // main feature of mongodb. #POWERFUL


const videoSchema = new Schema(
    {
        videoFile:{
            type: String, //Cloudnary url
            required: true,
        },
        thumbnail:{
            type: String, //Cloudnary url
            required: true,
        },
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        time:{
            type: Number, //Cloudnary url
            required: true,
        },
        views:{
            type: Number, //Cloudnary url
            default: 0,
        },
        isPublished:{
            type: Boolean, 
            default: true,
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps:true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate) // ye mongoose me baad me aaya es liye esko hum plugin ke tarah add karte hai.
// ab esko add krne k baad hum esme aggregation query likh skte hai.
export const Video = mongoose.model("Video",videoSchema);