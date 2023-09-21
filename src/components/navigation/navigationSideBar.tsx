import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { member } from "@/db/schema/member";
import { server } from "@/db/schema/server";

import { currentProfile } from "@/lib/currentProfile";

import NavigationAction from "./navigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./navigationItem";
import { ModeToggle } from "../modeToggle";
import { UserButton } from "@clerk/nextjs";

async function NavigationSideBar() {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const servers = await db.query.server.findMany({
    with: {
     members: {
      where: eq(member.profileId, profile.id)
     } 
    }
  })

  return (
    <div className="flex flex-col items-center h-full w-full space-y-4 text-primary dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => {
          return (
            <div key={server?.id} className="mb-4">
              <NavigationItem
                id={server?.id}
                name={server?.name!}
                imageUrl={server?.imageUrl!}
              />
            </div>
          );
        })}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />{" "}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSideBar;
