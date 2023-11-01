"use server";

import { connectToDatabase } from "@/database/dbConnection";
import User from "@/database/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const users = await User.find({}).sort({ joinedAt: -1 });

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    connectToDatabase();

    //Get the user
    const user = await User.findOne({ clerkId: id });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    connectToDatabase();

    //Create the user
    const user = await User.create(params);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    //Update the user
    const user = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

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
    console.log(error);
    throw error;
  }
}
