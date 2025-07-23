"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, FileImage, Video, Download, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import { Preview3D } from "@/components/preview-3d"

type ConversionType = {
  from: string[]
  to: string[]
  type: string
}

const conversions: Record<string, ConversionType> = {
  image: {
    from: ["jpg", "jpeg", "png", "webp", "bmp", "gif", "avif"],
    to: ["jpg", "png", "webp", "ico", "avif"],
    type: "image",
  },
  video: {
    from: ["mp4", "avi", "mov", "wmv", "mkv", "webm"],
    to: ["mp4", "avi", "wmv", "webm"],
    type: "video",
  },
}

export default function ConvertPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversionMode, setConversionMode] = useState<string>("")
  const [outputFormat, setOutputFormat] = useState<string>("")
  const [quality, setQuality] = useState([80])
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileSelect = useCallback((file: File) => {
    console.log("File selected:", file.name, file.type)
    setSelectedFile(file)
    setConvertedFile(null)
    setOutputFormat("")

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (fileExtension) {
      for (const [mode, config] of Object.entries(conversions)) {
        if (config.from.includes(fileExtension)) {
          setConversionMode(mode)
          break
        }
      }
    }
  }, [])

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null)
    setConversionMode("")
    setOutputFormat("")
    setConvertedFile(null)
  }, [])

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) {
      toast({
        title: "Missing Information",
        description: "Please select a file and output format",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      const conversionTime = selectedFile.type.startsWith("video/") ? 4000 : 2000
      await new Promise((resolve) => setTimeout(resolve, conversionTime))

      const originalName = selectedFile.name.split(".")[0]
      const convertedFileName = `${originalName}_converted.${outputFormat}`
      const convertedBlob = selectedFile
      const mockUrl = URL.createObjectURL(convertedBlob)
      setConvertedFile(mockUrl)

      const conversionData = {
        id: Date.now().toString(),
        originalName: selectedFile.name,
        convertedName: convertedFileName,
        outputFormat,
        quality: quality[0],
        timestamp: new Date().toISOString(),
        size: selectedFile.size,
        originalFormat: selectedFile.name.split(".").pop()?.toLowerCase() || "",
      }

      const history = JSON.parse(localStorage.getItem("morphix-history") || "[]")
      history.unshift(conversionData)
      localStorage.setItem("morphix-history", JSON.stringify(history.slice(0, 50)))

      toast({
        title: "Conversion Successful! 🎉",
        description: `File converted from ${conversionData.originalFormat.toUpperCase()} to ${outputFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return FileImage
      case "video":
        return Video
      default:
        return FileImage
    }
  }

  const getFileType = (file: File): "image" | "video" => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (
      file.type.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "bmp", "gif", "ico", "avif"].includes(extension || "")
    ) {
      return "image"
    } else if (
      file.type.startsWith("video/") ||
      ["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(extension || "")
    ) {
      return "video"
    }

    return "image"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Universal File Converter</h1>
            <p className="text-xl text-muted-foreground">Convert images and videos between formats</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload File</span>
                  </CardTitle>
                  <CardDescription>Select an image or video to convert</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileSelect={handleFileSelect} onFileRemove={handleFileRemove} />

                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Badge variant="secondary">{selectedFile.name.split(".").pop()?.toUpperCase()}</Badge>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {conversionMode && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Conversion Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="output-format">Output Format</Label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select output format" />
                          </SelectTrigger>
                          <SelectContent>
                            {conversions[conversionMode].to.map((format) => (
                              <SelectItem key={format} value={format}>
                                {format.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Quality: {quality[0]}%</Label>
                        <Slider
                          value={quality}
                          onValueChange={setQuality}
                          max={100}
                          min={10}
                          step={10}
                          className="mt-2"
                        />
                      </div>

                      <Button
                        onClick={handleConvert}
                        disabled={!outputFormat || isConverting}
                        className="w-full"
                        size="lg"
                      >
                        {isConverting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Converting...
                          </>
                        ) : (
                          "Convert File"
                        )}
                      </Button>

                      {convertedFile && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => {
                              const a = document.createElement("a")
                              a.href = convertedFile
                              a.download = `converted.${outputFormat}`
                              a.click()
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Converted File
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>File Preview</CardTitle>
                  <CardDescription>Preview of your uploaded file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg">
                    <Preview3D
                      file={selectedFile}
                      type={selectedFile ? getFileType(selectedFile) : "image"}
                      isConverting={isConverting}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Supported Formats</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(conversions).map(([key, config]) => {
                const Icon = getFileIcon(config.type)
                return (
                  <Card key={key} className="text-center">
                    <CardHeader>
                      <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="capitalize">{key} Conversion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">From:</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {config.from.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">To:</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {config.to.map((format) => (
                              <Badge key={format} variant="secondary" className="text-xs">
                                {format.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}