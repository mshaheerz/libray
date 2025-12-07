"use client";

import {
  Image as IKImage,
  ImageKitProvider,
  upload,
  Video as IKVideo,
} from "@imagekit/next";
import config from "@/lib/config";

import { useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onValidate = (file: File): boolean => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "Please upload a file that is less than 20MB in size",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "Please upload a file that is less than 50MB in size",
        });
        return false;
      }
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file
    if (!onValidate(selectedFile)) {
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Fetch authentication parameters from the API
      const authResponse = await fetch(
        `${config.env.apiEndpoint}/api/imagekit/upload-auth`
      );

      if (!authResponse.ok) {
        throw new Error("Failed to get upload authentication");
      }

      const authParams = await authResponse.json();

      // Upload the file using ImageKit's upload function
      const uploadResponse = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        folder: folder,
        useUniqueFileName: true,
        publicKey: publicKey,
        signature: authParams.signature,
        token: authParams.token,
        expire: authParams.expire,
        onProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        },
      });

      // Handle success
      const uploadedFilePath =
        uploadResponse.filePath || uploadResponse.url || "";
      setFile({ filePath: uploadedFilePath });
      onFileChange(uploadedFilePath);

      toast.success(`${type} uploaded successfully`, {
        description: `${uploadedFilePath} uploaded successfully!`,
      });

      setProgress(100);
    } catch (error) {
      console.error("Upload error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : `Your ${type} could not be uploaded. Please try again.`;

      toast.error(`${type} upload failed`, {
        description: errorMessage,
      });

      setProgress(0);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
        disabled={uploading}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>
          {uploading ? "Uploading..." : placeholder}
        </p>

        {file && file.filePath && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file &&
        file.filePath &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            src={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            src={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
