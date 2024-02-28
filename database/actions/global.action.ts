"use server";

import { connectToDatabase } from "@/database/dbConnection";
import { getErrorMessage } from "../../lib/utils";
import { SearchParams } from "./shared.types";
import Question from "@/database/models/question.model";
import Answer from "@/database/models/answer.model";
import User from "@/database/models/user.model";
import Tag from "@/database/models/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  const { query, type } = params;
  try {
    await connectToDatabase();

    const regexQuery = { $regex: query, $options: "i" };

    let results: any = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      //SEARCH ACROSS EVERYTHING

      for (const { model, searchField, type } of modelsAndTypes) {
        const result = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);

        results.push(
          ...result.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkid
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      //SEARCH IN THE SPECIFIED MODEL TYPE

      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const result = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = result.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}
