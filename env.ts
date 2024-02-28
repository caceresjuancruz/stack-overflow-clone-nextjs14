import { z } from "zod";

const envVariables = z.object({
  OPENAI_API_KEY: z.string(),
  NEXT_PUBLIC_RAPID_API_KEY: z.string(),
  NEXT_PUBLIC_SERVER_URL: z.string(),
  NEXT_CLERK_WEBHOOK_SECRET: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
  NEXT_PUBLIC_TINY_EDITOR_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_NAME: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
