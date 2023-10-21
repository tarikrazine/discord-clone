import { Smile } from "lucide-react";
import EmojiPicker from "@emoji-mart/react";
import data from '@emoji-mart/data'
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiProps {
  onChange: (value: any) => void;
}

function Emoji(props: EmojiProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <EmojiPicker data={data} theme={resolvedTheme} onEmojiSelect={(emoji: any) => props.onChange(emoji)} />
      </PopoverContent>
    </Popover>
  );
}

export default Emoji;
