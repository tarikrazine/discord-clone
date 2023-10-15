import { sql } from "drizzle-orm";

import { db } from "@/db";
import { conversation as conversationSchema } from "@/db/schema/conversation";

export async function getOrCreateConversation(
  memberOneId: string,
  memberTwoId: string,
) {
  let conversation = (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    const newConversation = await createNewConversation(
      memberOneId,
      memberTwoId,
    );
    if (newConversation) {
      conversation = newConversation;
    }
  }

  return conversation;
}

async function findConversation(
  memberOneId: string,
  memberTwoId: string,
) {
  const conversation = await db.query.conversation.findFirst({
    where:
      sql`${conversationSchema.memberOneId} = ${memberOneId} AND ${conversationSchema.memberTwoId} = ${memberTwoId}`,
    with: {
      memberOne: {
        with: {
          profile: true,
        },
      },
      memberTwo: {
        with: {
          profile: true,
        },
      },
    },
  });

  return conversation;
}

async function createNewConversation(
  memberOneId: string,
  memberTwoId: string,
) {
  try {
    const conversation = await db.transaction(async (tx) => {
      const [newConversation] = await tx
        .insert(conversationSchema)
        .values({
          memberOneId,
          memberTwoId,
          createdAt: new Date(),
        })
        .returning();

      return tx.query.conversation.findFirst({
        where:
          sql`${conversationSchema.memberOneId} = ${newConversation.memberOneId} AND ${conversationSchema.memberTwoId} = ${newConversation.memberTwoId}`,
        with: {
          memberOne: {
            with: {
              profile: true,
            },
          },
          memberTwo: {
            with: {
              profile: true,
            },
          },
        },
      });
    });

    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
}
