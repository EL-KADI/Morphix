"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Palette, HardDrive, Shield, Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppSettings {
  autoDownload: boolean;
  defaultQuality: number;
  maxFileSize: number;
  autoDelete: boolean;
  showPreview: boolean;
  compressionLevel: string;
}

const defaultSettings: AppSettings = {
  autoDownload: false,
  defaultQuality: 80,
  maxFileSize: 100,
  autoDelete: true,
  showPreview: true,
  compressionLevel: "balanced",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [storageUsed, setStorageUsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem("morphix-settings");
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    const history = localStorage.getItem("morphix-history");
    if (history) {
      setStorageUsed(new Blob([history]).size);
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("morphix-settings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("morphix-settings");
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults",
    });
  };

  const clearStorage = () => {
    localStorage.removeItem("morphix-history");
    setStorageUsed(0);
    toast({
      title: "Storage Cleared",
      description: "All cached files and history have been removed",
    });
  };

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const formatBytes = (bytes: number) => {
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
            <p className="text-xl text-muted-foreground">
              Customize your Morphix experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-preview">Previews</Label>
                    <p className="text-sm text-muted-foreground">
                      Show interactive file previews
                    </p>
                  </div>
                  <Switch
                    id="show-preview"
                    checked={settings.showPreview}
                    onCheckedChange={(checked) =>
                      updateSetting("showPreview", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Conversion</span>
                </CardTitle>
                <CardDescription>
                  Configure default conversion options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Default Quality: {settings.defaultQuality}%</Label>
                  <Slider
                    value={[settings.defaultQuality]}
                    onValueChange={([value]) =>
                      updateSetting("defaultQuality", value)
                    }
                    max={100}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Default quality setting for new conversions
                  </p>
                </div>

                <div>
                  <Label htmlFor="compression">Compression Level</Label>
                  <Select
                    value={settings.compressionLevel}
                    onValueChange={(value) =>
                      updateSetting("compressionLevel", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Faster)</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="high">
                        High (Better Quality)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Balance between speed and quality
                  </p>
                </div>

                <div>
                  <Label>Max File Size: {settings.maxFileSize} MB</Label>
                  <Slider
                    value={[settings.maxFileSize]}
                    onValueChange={([value]) =>
                      updateSetting("maxFileSize", value)
                    }
                    max={500}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum allowed file size for uploads
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription>
                  Control how your data is handled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-download">Auto Download</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically download converted files
                    </p>
                  </div>
                  <Switch
                    id="auto-download"
                    checked={settings.autoDownload}
                    onCheckedChange={(checked) =>
                      updateSetting("autoDownload", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-delete">Auto Delete</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically delete files after conversion
                    </p>
                  </div>
                  <Switch
                    id="auto-delete"
                    checked={settings.autoDelete}
                    onCheckedChange={(checked) =>
                      updateSetting("autoDelete", checked)
                    }
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Privacy Notice</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All files are processed locally in your browser. No data is
                    sent to external servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Storage</span>
                </CardTitle>
                <CardDescription>
                  Manage local storage and cached files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Storage Used</span>
                    <span className="text-sm text-muted-foreground">
                      {formatBytes(storageUsed)} / 5 MB
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (storageUsed / (5 * 1024 * 1024)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for conversion history and cached files
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={clearStorage}
                  className="w-full text-destructive hover:text-destructive bg-transparent"
                >
                  Clear All Storage
                </Button>
              </CardContent>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button onClick={saveSettings} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex-1 bg-transparent"
            >
              Reset to Defaults
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>About Morphix</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Version</h3>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Last Updated</h3>
                    <p className="text-sm text-muted-foreground">
                      July 23, 2025
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Technologies</h3>
                    <p className="text-sm text-muted-foreground">
                      Next.js, Three.js, Tailwind CSS, Framer Motion
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">License</h3>
                    <p className="text-sm text-muted-foreground">MIT License</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Morphix is a dynamic web application built with Next.js,
                    designed to convert images, PDFs, and videos between formats
                    using open-source libraries without external APIs. Featuring
                    engaging file previews with Three.js and responsive
                    design.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
