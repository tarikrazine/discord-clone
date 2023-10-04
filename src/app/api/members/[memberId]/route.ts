import { NextResponse } from "next/server";

import { sql } from "drizzle-orm";

import { db } from "@/db";
import { member as memberSchema, MemberType } from "@/db/schema/member";
import { server as serverSchema } from "@/db/schema/server";
import { currentProfile } from "@/lib/currentProfile";

export const runtime = "edge";

export async function PATCH(
  request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ message: "UNAUTHORIZE" }, { status: 401 });
    }

    const { role } = (await request.json()) as { role: MemberType["role"] };

    const memberId = params.memberId;

    const url = new URL(request.url);

    const serverId = url.searchParams.get("serverId");

    console.log("serverid", serverId, "role", role, "member", memberId);

    if (!serverId) {
      return NextResponse.json({ message: "Missing server id" }, {
        status: 400,
      });
    }

    if (!memberId) {
      return NextResponse.json({ message: "Missing member id" }, {
        status: 400,
      });
    }

    await db
      .update(memberSchema)
      .set({
        role: role,
        updatedAt: new Date(),
      })
      .where(
        sql`${memberSchema.id} =  ${memberId} AND ${memberSchema.serverId} = ${serverId!}`,
      );

    const serverResponse = await db.query.server.findFirst({
      where: sql`${serverSchema.id} =  ${serverId}`,
      with: {
        channels: {
          orderBy: (channels, { desc }) => desc(channels.createdAt),
        },
        members: {
          orderBy: (members, { asc }) => asc(members.role),
          with: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({ server: serverResponse }, { status: 200 });
  } catch (error) {
    console.log("[MEMBER_ID_PATCH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ message: "UNAUTHORIZE" }, { status: 401 });
    }

    const memberId = params.memberId;

    const url = new URL(request.url);

    const serverId = url.searchParams.get("serverId");

    if (!serverId) {
      return NextResponse.json({ message: "Missing server id" }, {
        status: 400,
      });
    }

    if (!memberId) {
      return NextResponse.json({ message: "Missing member id" }, {
        status: 400,
      });
    }

    await db
      .delete(memberSchema)
      .where(
        sql`${memberSchema.id} =  ${memberId} AND ${memberSchema.serverId} = ${serverId!}`,
      );

    const serverResponse = await db.query.server.findFirst({
      where: sql`${serverSchema.id} =  ${serverId}`,
      with: {
        channels: {
          orderBy: (channels, { desc }) => desc(channels.createdAt),
        },
        members: {
          orderBy: (members, { asc }) => asc(members.role),
          with: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({ server: serverResponse }, { status: 200 });
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
