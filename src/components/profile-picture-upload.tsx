"use client"

import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Loader2, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  currentProfilePicture?: string | null
  previewUrl?: string | null
  onPictureChange: (file: File) => void
  onPictureRemove: () => void
  isUploading?: boolean
  uploadProgress?: number
  disabled?: boolean
  error?: string | null
}

export function ProfilePictureUpload({
  currentProfilePicture,
  previewUrl,
  onPictureChange,
  onPictureRemove,
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  error = null,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const src = previewUrl || currentProfilePicture || ""

  function pick() {
    inputRef.current?.click()
  }

  return (
    <div className="flex items-start gap-4">
      <div className="relative">
        <Avatar className={cn("h-24 w-24 ring-1 ring-zinc-200", isUploading && "opacity-60")}>
          {src ? (
            <AvatarImage src={src} alt="Profile picture" />
          ) : (
            <AvatarFallback>IMG</AvatarFallback>
          )}
        </Avatar>

        {/* Upload overlay spinner */}
        {isUploading && (
          <div className="absolute inset-0 grid place-items-center bg-black/10 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <Label className="block text-sm">Profile Picture</Label>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={pick} disabled={disabled || isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            Choose image
          </Button>

          {src ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onPictureRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground">
          PNG, JPG, or WebP. Max 10MB. Minimum 100×100px.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onPictureChange(file)
          }}
        />

        {isUploading ? (
          <div className="space-y-1 mt-1">
            <Progress value={uploadProgress} />
            <div className="text-xs text-muted-foreground">{uploadProgress}%</div>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-center text-xs text-red-600 mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        ) : null}
      </div>
    </div>
  )
}
