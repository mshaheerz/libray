"use client";
import React from "react";
import { ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
      <video
        src={`${config.env.imagekit.urlEndpoint}/${videoUrl}`}
        controls
        className="w-full rounded-xl"
      />
    </ImageKitProvider>
  );
};
export default BookVideo;
