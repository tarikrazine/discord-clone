import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSideBar from "@/components/navigation/navigationSideBar";
import ServerSideBar from "@/components/server/serverSideBar";

interface MobileToggleProps {
    serverId : string
}

function MobileToggle(props: MobileToggleProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="cursor-pointer" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
            <NavigationSideBar />
        </div>
        <ServerSideBar serverId={props.serverId} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileToggle;
