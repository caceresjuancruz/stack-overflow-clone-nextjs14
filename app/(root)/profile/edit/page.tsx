import ProfileForm from "@/components/forms/ProfileForm";
import { getUserById } from "@/database/actions/user.action";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Edit Profile | Dev Overflow",
};

export default async function EditProfilePage() {
  const { userId } = auth();

  if (!userId) return null;

  const user = await getUserById({ userId: userId as string });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Suspense>
          <ProfileForm clerkId={userId} user={JSON.stringify(user)} />
        </Suspense>
      </div>
    </>
  );
}
