"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  Download,
  Trash2,
  FileImage,
  FileText,
  Video,
  Calendar,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ConversionHistory {
  id: string;
  originalName: string;
  outputFormat: string;
  quality: number;
  timestamp: string;
  size: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem("morphix-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("morphix-history");
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All conversion history has been removed",
    });
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("morphix-history", JSON.stringify(updatedHistory));
    toast({
      title: "Item Deleted",
      description: "Conversion record has been removed",
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "webp", "bmp", "gif", "ico"].includes(ext || "")
    ) {
      return FileImage;
    } else if (ext === "pdf") {
      return FileText;
    } else if (["mp4", "avi", "mov", "wmv", "mkv"].includes(ext || "")) {
      return Video;
    }
    return FileImage;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Conversion History
              </h1>
              <p className="text-xl text-muted-foreground">
                View and manage your past file conversions
              </p>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <History className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                No conversions yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start converting files to see your history here
              </p>
              <Button asChild>
                <a href="/convert">Start Converting</a>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => {
                const FileIcon = getFileIcon(item.originalName);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {item.originalName}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(item.timestamp)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <HardDrive className="h-3 w-3" />
                                  <span>{formatFileSize(item.size)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <Badge variant="secondary" className="mb-1">
                                → {item.outputFormat.toUpperCase()}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Quality: {item.quality}%
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Download Started",
                                    description: "File download initiated",
                                  });
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Information</CardTitle>
                  <CardDescription>
                    Your conversion history is stored locally in your browser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total conversions: {history.length}</span>
                    <span>Storage limit: 5MB</span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((history.length / 50) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    History is automatically limited to the last 50 conversions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
