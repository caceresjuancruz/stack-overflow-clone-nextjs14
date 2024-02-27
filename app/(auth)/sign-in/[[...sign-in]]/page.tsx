import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Dev Overflow",
};

export default function SignInPage() {
  return <SignIn />;
}
