"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = {
    "image/*": [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".bmp",
      ".gif",
      ".ico",
      ".avif",
    ],
    "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".webm"],
  },
  maxSize = 100 * 1024 * 1024,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        console.log("File selected:", file.name, file.type, file.size);
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  const removeFile = () => {
    setSelectedFile(null);
    onFileRemove?.();
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps()}>
        <motion.div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{
                y: isDragActive ? -10 : 0,
                rotate: isDragActive ? 5 : 0,
              }}
              className="p-4 bg-primary/10 rounded-full"
            >
              <Upload className="h-8 w-8 text-primary" />
            </motion.div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop your file here"
                  : "Drag & drop a file here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports images and videos up to 100MB
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {fileRejections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <p className="text-sm text-destructive font-medium">
            File rejected: {fileRejections[0].errors[0].message}
          </p>
        </motion.div>
      )}

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-muted rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-background rounded-full transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
