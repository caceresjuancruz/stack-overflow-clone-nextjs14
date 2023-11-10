"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../../database/dbConnection";
import Tag from "@/database/models/tag.model";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  ToggleSaveQuestionParams,
} from "./shared.types";
import User from "@/database/models/user.model";
import { getErrorMessage } from "../utils";

export async function getQuestions(params: GetQuestionsParams) {
  const { page = 1, pageSize = 10, searchQuery, filter } = params;
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  const { title, content, tags, author, path } = params;
  try {
    await connectToDatabase();

    //Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    //Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    //Create an interaction record for the user's ask_question action

    //Increment author's reputation by +5 for creating question
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  const { questionId } = params;
  try {
    await connectToDatabase();

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name avatar",
      });

    if (!question) {
      throw new Error("Question not found");
    }

    return question;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
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

    //update question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      query,
      { $new: true }
    );

    if (!updatedQuestion) {
      throw new Error("Question not found");
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

export async function downvoteQuestion(params: QuestionVoteParams) {
  const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
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
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      query,
      { $new: true }
    );

    if (!updatedQuestion) {
      throw new Error("Question not found");
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

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  const { questionId, userId, path } = params;
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      //Remove question from user's saved list
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      //Add question to user's saved list
      await User.findByIdAndUpdate(
        userId,
        { $push: { saved: questionId } },
        { new: true }
      );
    }
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}
