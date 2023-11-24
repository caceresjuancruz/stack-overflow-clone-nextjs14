"use server";

import { connectToDatabase } from "@/database/dbConnection";
import User from "@/database/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";
import { getErrorMessage } from "../utils";
import Tag from "@/database/models/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/models/answer.model";

export async function getAllUsers(params: GetAllUsersParams) {
  const { page = 1, pageSize = 10, searchQuery, filter } = params;
  try {
    await connectToDatabase();

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const users = await User.find(query).sort({ joinedAt: -1 });

    return { users };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getUserById(params: GetUserByIdParams) {
  const { userId } = params;
  try {
    await connectToDatabase();

    //Get the user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  const { userId } = params;
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    await connectToDatabase();

    //Create the user
    const user = await User.create(params);

    return user;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function updateUser(params: UpdateUserParams) {
  const { clerkId, updateData, path } = params;
  try {
    await connectToDatabase();

    //Update the user
    const user = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    return user;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  const { clerkId } = params;
  try {
    await connectToDatabase();

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    //Delete user from database
    //and Questions, Answers, Comments, Votes, etc.

    //get user question ids
    // const userQuestions = await Question.find({ author: user._id });

    // delete user questions
    await Question.deleteMany({ author: user._id });

    //TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
  try {
    await connectToDatabase();

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: { sort: { createdAt: -1 } },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  const { userId, page = 1, pageSize = 10 } = params;
  try {
    await connectToDatabase();

    const totalQuestions = await Question.countDocuments({ author: userId });

    const questions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate([
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ]);

    return { questions, totalQuestions };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  const { userId, page = 1, pageSize = 10 } = params;
  try {
    await connectToDatabase();

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate([
        { path: "question", model: Question, select: "_id title" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ]);

    return { answers, totalAnswers };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}
