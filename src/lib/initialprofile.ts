import { db } from "@/db";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { profile } from "@/db/schema/profile";
import { eq } from "drizzle-orm";

export async function initialProfile() {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const [profileExists] = await db.select().from(profile).where(
    eq(profile.userId, user.id),
  );

  if (profileExists) {
    return profileExists;
  }

  const newProfile = await db.insert(profile).values({
    userId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0].emailAddress,
    imageUrl: user.hasImage ? user.imageUrl : null,
    createdAt: new Date(),
  });

  return newProfile;
}
