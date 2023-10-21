"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus } from "lucide-react";
import axios from "axios";
import qs from "query-string";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModalStore";
import Emoji from "../emoji";

interface ChatInputProps {
  name: string;
  query: Record<string, any>;
  apiUrl: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

function ChatInput(props: ChatInputProps) {
  const router = useRouter()
  
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function handleFormSubmission(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: props.apiUrl,
        query: props.query,
      });

      await axios.post(url, values);

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmission)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6 ">
                    <button
                      disabled={isLoading}
                      type="button"
                      onClick={() => {
                        onOpen("MESSAGE_FILE", {
                          apiUrl: props.apiUrl,
                          query: props.query,
                        });
                      }}
                      className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-500 dark:hover:bg-zinc-300 transition rounded-full p1 flex items-center justify-center"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder={`Message ${
                        props.type === "channel" ? "#" + props.name : props.name
                      }`}
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    />
                    <div className="absolute top-7 right-8">
                      <Emoji onChange={(emoji: any) => {
                        console.log(emoji)
                        return field.onChange(`${field.value} ${emoji.native}`)
                      }} />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}

export default ChatInput;
