import { connectToDatabase } from "@/database/dbConnection";
import { GetAllTagsParams } from "./shared.types";
import Tag from "@/database/models/tag.model";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({}).sort({ createdOn: -1 });

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
