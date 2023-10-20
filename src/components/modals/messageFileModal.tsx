"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/fileUpload";
import { useModal } from "@/hooks/useModalStore";

const formValidation = z.object({
  fileUrl: z.string().url({ message: "Attachment is required." }),
});

function MessageFileModal() {
  const router = useRouter();

  const { isOpen, type, onClose, data } = useModal();

  const isOpenModal = isOpen && type === "MESSAGE_FILE";

  const form = useForm({
    resolver: zodResolver(formValidation),
    defaultValues: {
      fileUrl: "",
    },
  });

  function handleCloseModal() {
    form.reset();
    onClose();
  }
  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formValidation>) {
    try {
      const url = qs.stringifyUrl({
        url: data.apiUrl!,
        query: data.query,
      });

      await axios.post(url, { ...values, content: values.fileUrl });

      form.reset();
      router.refresh();
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} type="submit" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MessageFileModal;
