import "@uploadthing/react/styles.css";

import Image from "next/image"

import { X } from "lucide-react";

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
