"use server";

import { connectToDatabase } from "@/database/dbConnection";
import User from "@/database/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";
import { getErrorMessage } from "../utils";

export async function getAllUsers(params: GetAllUsersParams) {
  const { page = 1, pageSize = 10, searchQuery, filter } = params;
  try {
    connectToDatabase();

    const users = await User.find({}).sort({ joinedAt: -1 });

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
    connectToDatabase();

    //Get the user
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    connectToDatabase();

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
    connectToDatabase();

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
    connectToDatabase();

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
