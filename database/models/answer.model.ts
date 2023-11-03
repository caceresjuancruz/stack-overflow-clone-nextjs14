import { Schema, model, models } from "mongoose";

export interface IAnswer extends Document {
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: Date;
}

const AnswerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
