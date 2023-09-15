import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@/lib/uploadThing";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile"
  value: string
  onChange: (url?: string) => void
}

function FileUpload(props: FileUploadProps) {

  console.log("imageUrl", props.value)
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
