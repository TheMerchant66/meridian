"use client"

import { useState } from "react"
import { Palette, Upload, ImageIcon, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  logo: string | null;
  favicon: string | null;
  loginBackground: string | null;
}

interface BrandingSettingsTabProps {
  onSettingsChange: () => void;
}

type BrandingField = keyof BrandingSettings;

export function BrandingSettingsTab({ onSettingsChange }: BrandingSettingsTabProps) {
  const [branding, setBranding] = useState<BrandingSettings>({
    primaryColor: "#0ea5e9",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    logo: null,
    favicon: null,
    loginBackground: null,
  })

  const handleColorChange = (field: BrandingField, value: string) => {
    setBranding((prev) => ({ ...prev, [field]: value }))
    onSettingsChange()
  }

  const handleFileUpload = (field: BrandingField, file: File | null) => {
    if (!file) {
      // Handle removal by setting the field to null
      setBranding((prev) => ({ ...prev, [field]: null }))
      onSettingsChange()
      return
    }

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setBranding((prev) => ({ ...prev, [field]: result }))
        onSettingsChange()
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (field: BrandingField, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file instanceof File) {
        handleFileUpload(field, file)
      }
    }
  }

  const colorPresets = [
    { name: "Blue", primary: "#0ea5e9", secondary: "#64748b", accent: "#10b981" },
    { name: "Green", primary: "#10b981", secondary: "#64748b", accent: "#f59e0b" },
    { name: "Purple", primary: "#8b5cf6", secondary: "#64748b", accent: "#ef4444" },
    { name: "Orange", primary: "#f97316", secondary: "#64748b", accent: "#3b82f6" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
          <CardDescription>Customize the color palette for your banking application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  placeholder="#0ea5e9"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  placeholder="#64748b"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => handleColorChange("accentColor", e.target.value)}
                  className="w-12 h-10 p-1 border Rounded"
                />
                <Input
                  value={branding.accentColor}
                  onChange={(e) => handleColorChange("accentColor", e.target.value)}
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-color">Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="background-color"
                  type="color"
                  value={branding.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={branding.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={branding.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={branding.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  placeholder="#1f2937"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color Presets</Label>
            <div className="flex gap-2">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleColorChange("primaryColor", preset.primary)
                    handleColorChange("secondaryColor", preset.secondary)
                    handleColorChange("accentColor", preset.accent)
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                  </div>
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div
            className="p-4 border rounded-lg"
            style={{
              backgroundColor: branding.backgroundColor,
              color: branding.textColor,
              borderColor: branding.secondaryColor,
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: branding.primaryColor }}>
              Color Preview
            </h3>
            <p className="text-sm mb-2">This is how your banking application will look with the selected colors.</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                style={{
                  backgroundColor: branding.primaryColor,
                  color: branding.backgroundColor,
                }}
              >
                Primary Button
              </Button>
              <Button
                variant="outline"
                size="sm"
                style={{
                  borderColor: branding.accentColor,
                  color: branding.accentColor,
                }}
              >
                Accent Button
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo & Images
          </CardTitle>
          <CardDescription>Upload your bank's logo, favicon, and other branding images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Main Logo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {branding.logo ? (
                  <div className="space-y-2">
                    <img src={branding.logo || "/placeholder.svg"} alt="Logo preview" className="max-h-20 mx-auto" />
                    <Button variant="outline" size="sm" onClick={() => handleFileUpload("logo", null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Upload your main logo
                      <br />
                      (PNG, JPG, SVG)
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange("logo", e)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {branding.favicon ? (
                  <div className="space-y-2">
                    <img
                      src={branding.favicon || "/placeholder.svg"}
                      alt="Favicon preview"
                      className="w-8 h-8 mx-auto"
                    />
                    <Button variant="outline" size="sm" onClick={() => handleFileUpload("favicon", null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Upload favicon
                      <br />
                      (16x16 or 32x32 px)
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange("favicon", e)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Login Background</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {branding.loginBackground ? (
                  <div className="space-y-2">
                    <img
                      src={branding.loginBackground || "/placeholder.svg"}
                      alt="Background preview"
                      className="max-h-20 mx-auto rounded"
                    />
                    <Button variant="outline" size="sm" onClick={() => handleFileUpload("loginBackground", null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Upload background
                      <br />
                      (1920x1080 recommended)
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange("loginBackground", e)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Brand Kit
            </Button>
            <Button variant="outline" size="sm">
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}