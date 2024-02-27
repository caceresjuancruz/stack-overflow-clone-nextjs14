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
import { getErrorMessage } from "../../lib/utils";
import Interaction from "@/database/models/interaction.model";
import User from "@/database/models/user.model";

export async function getAnswers(params: GetAnswersParams) {
  const { questionId, sortBy, page = 1, pageSize = 10 } = params;
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
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const totalResults = await Answer.countDocuments({ question: questionId });
    const isNext = totalResults > (page - 1) * pageSize + answers.length;

    return { answers, isNext, totalResults, showingResults: answers.length };
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
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: answer._id,
      tags: questionObject.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });
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

    if (updatedAnswer.author.toString() !== userId) {
      // Increment author's reputation
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasUpvoted ? -2 : 2 },
      });

      await User.findByIdAndUpdate(updatedAnswer.author, {
        $inc: { reputation: hasUpvoted ? -10 : 10 },
      });
    }
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

    if (updatedAnswer.author.toString() !== userId) {
      // Increment author's reputation
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasDownvoted ? -2 : 2 },
      });

      await User.findByIdAndUpdate(updatedAnswer.author, {
        $inc: { reputation: hasDownvoted ? -10 : 10 },
      });
    }
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

    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: -10 } });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}
