"use server";

import { connectToDatabase } from "@/database/dbConnection";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Answer from "@/database/models/answer.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    //Get the answers
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name avatar")
      .sort({
        createdAt: -1,
      });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { question, content, author, path } = params;

    //Create the answer
    const answer = await Answer.create({
      question,
      content,
      author,
    });

    //Add the answer to the question answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    revalidatePath(path);

    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
