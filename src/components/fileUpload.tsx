import "@uploadthing/react/styles.css";

import Image from "next/image"

import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadThing";
import { Button } from "./ui/button";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile"
  value: string
  onChange: (url?: string) => void
}

function FileUpload(props: FileUploadProps) {

  const fileType = props.value.split(".").pop()

  if (props.value && fileType !== "pdf") {
    return (
      <div className="relative h-40 w-40">
        <Image 
          fill
          src={props.value}
          alt="Image upload"
          className="rounded-full"
        />
        <Button onClick={() => props.onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-2 shadow-sm hover:text-black" type="button">
          <X className="h-4 w-[2rem]" />
        </Button>
      </div>
    )
  }

  if (props.value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mr-2 rounded-md bg-background/10">

        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

        <a href={props.value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">{props.value}</a>

        <Button onClick={() => props.onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute -bottom-4 -right-4 shadow-sm hover:text-black" type="button">
          <X className="h-4 w-[2rem]" />
        </Button>
      </div>
    )
  }
  
  return (
    <UploadDropzone
      endpoint={props.endpoint}
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        props.onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! uploadThing ${error.message}`);
      }}
    />
  );
}

export default FileUpload;
