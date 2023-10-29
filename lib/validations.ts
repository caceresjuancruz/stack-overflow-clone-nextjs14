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
