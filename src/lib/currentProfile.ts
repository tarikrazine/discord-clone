import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profile as profileSchema } from "@/db/schema/profile";

export async function currentProfile() {
  const currentUser = auth();

  if (!currentUser.userId) {
    return null;
  }

  const [profile] = await db.select().from(profileSchema).where(
    eq(profileSchema.userId, currentUser.userId),
  );

  return profile;
}
