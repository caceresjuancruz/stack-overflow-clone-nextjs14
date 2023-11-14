import * as z from "zod";

export const QuestionFormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(130, {
      message: "Title can have a maximum of 130 characters.",
    }),
  explanation: z.string().min(20, {
    message: "Explanation must be at least 20 characters.",
  }),
  tags: z
    .array(
      z
        .string()
        .min(1, {
          message: "Tags must be at least 1 character.",
        })
        .max(15, {
          message: "Tags can have a maximum of 15 characters.",
        })
    )
    .min(1, {
      message: "You must add at least 1 tag.",
    })
    .max(3, {
      message: "You can only add a maximum of 3 tags.",
    }),
});

export const AnswerFormSchema = z.object({
  answer: z.string().min(20, {
    message: "Answer must be at least 20 characters.",
  }),
});

export const ProfileFormSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url(),
  location: z.string().min(5).max(50),
});
