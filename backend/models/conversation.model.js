import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema(
    {
        participant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        messages : [
            {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Message",
               default : [] 
            }
        ]
    },
    { timestamps: true }
);
const conversation = mongoose.model("conversation", conversationSchema);
export default conversation;