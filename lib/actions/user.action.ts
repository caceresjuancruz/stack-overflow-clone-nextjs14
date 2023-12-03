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
import { assignBadges, getErrorMessage } from "../utils";
import Tag from "@/database/models/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/models/answer.model";
import { BadgeCriteriaType } from "@/types";

export async function getAllUsers(params: GetAllUsersParams) {
  const { page = 1, pageSize = 20, searchQuery, filter } = params;
  try {
    await connectToDatabase();

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const totalResults = await User.countDocuments(query);

    const isNext = totalResults > (page - 1) * pageSize + users.length;

    return { users, isNext, totalResults, showingResults: users.length };
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

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
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
  const { clerkId, page = 1, pageSize = 19, filter, searchQuery } = params;
  try {
    await connectToDatabase();

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: (page - 1) * pageSize,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    const totalResults = await Question.countDocuments({
      _id: { $in: user.saved },
    });
    const isNext = user.saved.length > pageSize;

    return {
      questions: savedQuestions,
      isNext,
      totalResults,
      showingResults: savedQuestions.length,
    };
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

    const totalResults = await Question.countDocuments({ author: userId });

    const questions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate([
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ]);

    const isNext = totalResults > (page - 1) * pageSize + questions.length;

    return {
      questions,
      isNext,
      totalResults,
      showingResults: questions.length,
    };
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

    const totalResults = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate([
        { path: "question", model: Question, select: "_id title" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ]);

    const isNext = totalResults > (page - 1) * pageSize + answers.length;
    return { answers, isNext, totalResults, showingResults: answers.length };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}
