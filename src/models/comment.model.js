import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // main feature of mongodb. #POWERFUL

const commentSchema = new Schema(
    {
        comment:{
            type: String,
            required: true
        },
        video:{
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        Owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate) // ye hme paginate ki ability deta hai.

export const Comment = mongoose.model("Comment", commentSchema)