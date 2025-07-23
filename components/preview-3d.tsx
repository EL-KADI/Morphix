"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileImage, Video, Loader2 } from "lucide-react"

interface Preview3DProps {
  file: File | null
  type: "image" | "video"
  isConverting?: boolean
}

export function Preview3D({ file, type, isConverting }: Preview3DProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)

      if (type === "image") {
        setImageUrl(url)
        setVideoUrl(null)
      } else if (type === "video") {
        setVideoUrl(url)
        setImageUrl(null)
      }

      return () => {
        URL.revokeObjectURL(url)
        setImageUrl(null)
        setVideoUrl(null)
      }
    } else {
      setImageUrl(null)
      setVideoUrl(null)
    }
  }, [file, type])

  if (isConverting) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Converting...</p>
          <p className="text-sm text-muted-foreground">Please wait while we process your file</p>
        </div>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileImage className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm text-muted-foreground">Upload a file to see preview</p>
        </div>
      </div>
    )
  }

  if (type === "image" && imageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full rounded-lg overflow-hidden bg-muted"
      >
        <div className="relative w-full h-full">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={file.name}
            className="w-full h-full object-contain"
            onError={() => {
              console.error("Error loading image")
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs opacity-75">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === "video" && videoUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full rounded-lg overflow-hidden bg-muted"
      >
        <div className="relative w-full h-full">
          <video src={videoUrl} className="w-full h-full object-contain" controls preload="metadata" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs opacity-75">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <Video className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-lg font-medium">Preview not available</p>
        <p className="text-sm text-muted-foreground">File format not supported for preview</p>
      </div>
    </div>
  )
}
