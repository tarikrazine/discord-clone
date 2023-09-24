"use client";

import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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
import FileUpload from "@/components/fileUpload"
import { useModal } from "@/hooks/useModalStore";
import { useEffect } from "react";

const formValidation = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().url({ message: "Server image is required." }),
});

function EditServerModal() {
  const router = useRouter()

  const { isOpen, onClose, type, data: {server} } = useModal()

  const isModalOpen = isOpen && type === "EDIT_SERVER"

  const form = useForm({
    resolver: zodResolver(formValidation),
    defaultValues: {
      imageUrl: "",
      name: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name!)
      form.setValue('imageUrl', server.imageUrl!)
    }
  }, [form, server])

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formValidation>) {
    try {
      await axios.patch(`/api/servers?serverId=${server?.id}`, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  function handleClose() {
    form.reset()
    onClose()
  }
  
  return (
    <Dialog open={isModalOpen}  onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Upload image
                      </FormLabel>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entre server name"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} type="submit" disabled={isLoading}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditServerModal;
