import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { classNames } from "uploadthing/client";

interface UserAvatarProps {
  src?: string;
  name?: string
  className?: string;
}

function UserAvatar(props: UserAvatarProps) {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", classNames)}>

        {
            typeof props.src === "undefined" 
            ? <AvatarFallback>{props.name}</AvatarFallback>
            : <AvatarImage src={props.src} />
        }
    </Avatar>
  );
}

export default UserAvatar;
