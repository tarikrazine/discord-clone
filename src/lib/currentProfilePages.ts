import { NextApiRequest } from "next";

import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profile as profileSchema } from "@/db/schema/profile";

export async function currentProfile(request: NextApiRequest) {
  const currentUser = getAuth(request);

  if (!currentUser.userId) {
    return null;
  }

  const [profile] = await db.select().from(profileSchema).where(
    eq(profileSchema.userId, currentUser.userId),
  );

  return profile;
}
