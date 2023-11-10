"use server";

import { connectToDatabase } from "@/database/dbConnection";
import { GetAllTagsParams, GetQuestionsByTagIdParams } from "./shared.types";
import Tag, { ITag } from "@/database/models/tag.model";
import { getErrorMessage } from "../utils";
import { FilterQuery } from "mongoose";
import Question from "@/database/models/question.model";
import User from "@/database/models/user.model";

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  const { tagId, page = 1, pageSize = 10, searchQuery } = params;
  try {
    await connectToDatabase();

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name avatar" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  const { page = 1, pageSize = 10, searchQuery, filter } = params;
  try {
    await connectToDatabase();

    const tags = await Tag.find({}).sort({ createdOn: -1 });

    return { tags };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}
