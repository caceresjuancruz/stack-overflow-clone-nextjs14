"use server";

import { connectToDatabase } from "@/database/dbConnection";
import { GetAllTagsParams } from "./shared.types";
import Tag from "@/database/models/tag.model";
import { getErrorMessage } from "../utils";

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
