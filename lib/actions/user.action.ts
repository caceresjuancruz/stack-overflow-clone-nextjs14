"use server";

import { connectToDatabase } from "@/database/dbConnection";
import User from "@/database/models/user.model";

export async function getUserById(id: string) {
  try {
    connectToDatabase();

    //Get the user
    const user = await User.findOne({ clerkId: id });

    return user;
  } catch (error) {
    console.log(error);
  }
}
