import { NextResponse } from "next/server";

import * as z from "zod";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { channel as channelSchema } from "@/db/schema/channel";
import { member as memberSchema } from "@/db/schema/member";

import { currentProfile } from "@/lib/currentProfile";
import { randomShortString } from "@/lib/randomShortString";

export const runtime = "edge";

export const formValidation = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().url({ message: "Server image is required." }),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const parsedData = formValidation.parse(data);

    // const newServer = await db.transaction(async () => {
    //   const [server] = await db.insert(serverSchema).values({
    //     profileId: profile.id,
    //     name: parsedData.name,
    //     imageUrl: parsedData.imageUrl,
    //     inviteCode: randomShortString(),
    //     createdAt: new Date(),
    //   }).returning();

    //   await db.insert(channelSchema).values({
    //     profileId: profile.id,
    //     serverId: server.id,
    //     name: "general",
    //     createdAt: new Date(),
    //   });

    //   const member = await db.insert(memberSchema).values({
    //     profileId: profile.id,
    //     serverId: server.id,
    //     role: "ADMIN",
    //     createdAt: new Date(),
    //   });
    // });

    // console.log(newServer);

    return NextResponse.json({ message: "Server added with success" }, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message:
            "Form not validate please check your server name or image server",
        },
        { status: 400 },
      );
    }
    console.log("[SERVER_POST]", error);
    return NextResponse.json({ message: "Something went wrong." }, {
      status: 500,
    });
  }
}
