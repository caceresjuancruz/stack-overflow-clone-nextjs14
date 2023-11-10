"use server";

import { connectToDatabase } from "@/database/dbConnection";
import { ViewQuestionParams } from "./shared.types";
import { getErrorMessage } from "../utils";
import Question from "@/database/models/question.model";
import Interaction from "@/database/models/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  const { questionId, userId } = params;

  try {
    await connectToDatabase();

    //Update view count for the question
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (!existingInteraction) {
        await Interaction.create({
          user: userId,
          question: questionId,
          action: "view",
        });
      }
    }
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}
