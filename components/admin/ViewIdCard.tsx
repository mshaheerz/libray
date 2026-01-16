"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import { Image as IKImage, ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";

interface Props {
  userName: string;
  idCardUrl: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

const ViewIdCard = ({
  userName,
  idCardUrl,
  buttonText = "View ID",
  icon = <Eye className="size-4 mr-1" />,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary-admin hover:text-primary-admin hover:bg-blue-50"
        onClick={() => setIsOpen(true)}
      >
        {icon}
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${userName}'s University ID Card`}
      >
        <div className="relative aspect-3/2 w-full overflow-hidden rounded-lg bg-slate-100">
          <IKImage
            src={idCardUrl}
            alt="University ID Card"
            fill
            className="object-contain"
          />
        </div>
      </Modal>
    </ImageKitProvider>
  );
};

export default ViewIdCard;
