import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const variantConfig = {
  success: {
    icon: CheckCircle2,
    title: "Berhasil",
  },
  warning: {
    icon: AlertTriangle,
    title: "Perhatian",
  },
  error: {
    icon: AlertCircle,
    title: "Terjadi Kesalahan",
  },
  info: {
    icon: Info,
    title: "Informasi",
  },
};

const FlashAlert = ({
  variant = "info",
  title,
  description,
  onClose,
  className = "",
}) => {
  if (!title && !description) return null;

  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.icon;

  return (
    <Alert
      variant={variant === "error" ? "destructive" : variant}
      className={`relative ${className}`}
    >
      <Icon className="h-4 w-4" />
      <div className="space-y-1">
        <AlertTitle>{title || config.title}</AlertTitle>
        {description ? (
          <AlertDescription>{description}</AlertDescription>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Tutup alert"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </Alert>
  );
};

export default FlashAlert;
