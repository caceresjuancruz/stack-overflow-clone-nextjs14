"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../dbConnection";
import Tag from "@/database/models/tag.model";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
  ToggleSaveQuestionParams,
} from "./shared.types";
import User from "@/database/models/user.model";
import { getErrorMessage } from "../../lib/utils";
import Answer from "@/database/models/answer.model";
import Interaction from "@/database/models/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  const { page = 1, pageSize = 20, searchQuery, filter } = params;
  try {
    await connectToDatabase();

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      case "recommended":
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const totalResults = await Question.countDocuments(query);

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

    // Create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    return question;
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

    if (updatedQuestion.author.toString() !== userId) {
      // Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasUpvoted ? -1 : 1 },
      });

      // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question
      await User.findByIdAndUpdate(updatedQuestion.author, {
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

    if (updatedQuestion.author.toString() !== userId) {
      // Increment author's reputation
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasDownvoted ? -2 : 2 },
      });

      await User.findByIdAndUpdate(updatedQuestion.author, {
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

export async function deleteQuestion(params: DeleteQuestionParams) {
  const { questionId, path } = params;
  try {
    await connectToDatabase();

    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    await User.findByIdAndUpdate(question.author, { $inc: { reputation: -5 } });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  const { questionId, title, content, path } = params;
  try {
    await connectToDatabase();

    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    //Update the question
    question.title = title;
    question.content = content;

    await question.save();

    return question;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  } finally {
    revalidatePath(path);
  }
}

export async function getHotQuestions() {
  try {
    await connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  const { userId, page = 1, pageSize = 20, searchQuery } = params;
  try {
    await connectToDatabase();

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
}
