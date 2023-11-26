"use server";

import { connectToDatabase } from "@/database/dbConnection";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Answer from "@/database/models/answer.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";
import { getErrorMessage } from "../utils";
import Interaction from "@/database/models/interaction.model";

export async function getAnswers(params: GetAnswersParams) {
  const { questionId, sortBy } = params;
  try {
    await connectToDatabase();

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    //Get the answers
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name avatar")
      .sort(sortOptions);

    return { answers };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  const { question, content, author, path } = params;
  try {
    await connectToDatabase();

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

    return answer;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
  try {
    await connectToDatabase();

    let query = {};

    if (hasUpvoted) {
      query = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      query = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    } else {
      query = { $addToSet: { upvotes: userId } };
    }

    //update answer
    const updatedAnswer = await Answer.findByIdAndUpdate(answerId, query, {
      $new: true,
    });

    if (!updatedAnswer) {
      throw new Error("Answer not found");
    }

    //TODO: Add reputation logic
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
  try {
    await connectToDatabase();

    let query = {};

    if (hasDownvoted) {
      query = { $pull: { downvotes: userId } };
    } else if (hasUpvoted) {
      query = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    } else {
      query = { $addToSet: { downvotes: userId } };
    }

    //update question
    const updatedAnswer = await Answer.findByIdAndUpdate(answerId, query, {
      $new: true,
    });

    if (!updatedAnswer) {
      throw new Error("Answer not found");
    }

    //TODO: Add reputation logic
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  const { answerId, path } = params;
  try {
    await connectToDatabase();

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}
