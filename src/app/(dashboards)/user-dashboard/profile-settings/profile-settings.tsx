"use client"

import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Key, LogOut, Shield, User } from "lucide-react"
import { UserContext } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { ProfileFormData, ProfileSchema, PasswordFormData, PasswordSchema } from "@/utils/schemas/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/api/axios"
import toast from "react-hot-toast"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary"

export default function ProfileSettingsPage() {
  const { user, logout, loading: userLoading, updateUser } = useContext(UserContext)
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pictureError, setPictureError] = useState<string | null>(null)

  // local file + preview URL
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const lastObjectUrl = useRef<string | null>(null)

  const router = useRouter()

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
    }
  }, [])

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "",
      profilePicture: user?.profilePicture?.url
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
      })
    }
  }, [user, resetProfile])

  if (!user) {
    router.push("/login")
    return null
  }

  // ----- Picture selection / validation -----
  async function handleProfilePictureChange(file: File) {
    setPictureError(null)

    // size
    if (file.size > 10 * 1024 * 1024) {
      setPictureError("Profile picture must be less than 10MB.")
      toast.error("Profile picture must be less than 10MB")
      return
    }
    // type
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      setPictureError("Please select a PNG, JPG, or WebP image.")
      toast.error("Please select a PNG, JPG, or WebP image")
      return
    }

    // dimensions
    const tmpUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        URL.revokeObjectURL(tmpUrl)
        setPictureError("Image should be at least 100×100 pixels.")
        toast.error("Image should be at least 100×100 pixels")
        return
      }
      // success
      if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
      lastObjectUrl.current = tmpUrl
      setPreviewUrl(tmpUrl)
      setProfileFile(file)
      toast.success("Image selected!")
    }
    img.onerror = () => {
      URL.revokeObjectURL(tmpUrl)
      setPictureError("Invalid image file.")
      toast.error("Invalid image file")
    }
    img.src = tmpUrl
  }

  async function removeProfilePicture() {
    try {
      setIsUploadingPicture(true)
      setUploadProgress(0)
      const { data } = await api.delete("/profile/picture")
      updateUser?.(data.user)
      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current)
        lastObjectUrl.current = null
      }
      setPreviewUrl(null)
      setProfileFile(null)
      toast.success("Profile picture removed")
    } catch (e: any) {
      console.log("This is the error", e)
      toast.error(e?.response?.data?.message || "Failed to remove picture")
    } finally {
      setIsUploadingPicture(false)
    }
  }

  // Upload file -> Cloudinary (with progress) -> save to backend
  async function uploadAndSavePictureIfNeeded() {
    if (!profileFile) return

    try {
      setIsUploadingPicture(true)
      setUploadProgress(0)
      const { url, publicId } = await uploadToCloudinary(profileFile, {
        onProgress: (p) => setUploadProgress(p),
      })

      const { data } = await api.patch("/profile/picture", { url, publicId })
      updateUser?.(data.user)
      console.log("This is the data", data);
      toast.success("Profile picture updated")
      // Once persisted, clear local file (keep preview as server image)
      setProfileFile(null)
      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current)
        lastObjectUrl.current = null
      }
      setPreviewUrl(null)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to upload picture")
      throw e
    } finally {
      setIsUploadingPicture(false)
      setUploadProgress(0)
    }
  }

  // ----- Submit profile (fields + picture if selected) -----
  const handleProfileUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmittingProfile(true)
    setSuccessMessage("")
    try {
      // 1) If user picked a new file, upload + persist first
      if (profileFile) {
        await uploadAndSavePictureIfNeeded()
      }

      // 2) Save other profile fields
      const { data: resp } = await api.patch("/profile", {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      })

      if (updateUser && resp.user) updateUser(resp.user)

      setSuccessMessage("Your profile has been updated successfully")
      toast.success("Profile updated!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      console.log("This is the error", error)
      toast.error(error?.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  const handlePasswordChange: SubmitHandler<PasswordFormData> = async (data) => {
    setIsSubmittingPassword(true)
    setSuccessMessage("")
    try {
      // Keep your existing password endpoint if it differs
      await api.patch("/users/changePassword", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setSuccessMessage("Your password has been updated successfully")
      toast.success("Password updated!")
      resetPassword()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update password")
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  function handleLogout() {
    logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" className="gap-2 w-full md:w-auto" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {successMessage && (
        <Alert className="mb-4 md:mb-6 mx-4 md:mx-0 bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-4 md:px-0">
        {/* Sidebar */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center">
                <div className="relative mb-3 group">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-muted">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture.url} alt="Profile picture" />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <h3 className="font-semibold text-base md:text-lg text-center">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center">{user.email}</p>
                <Badge variant="outline" className="mt-2">
                  {user.accountLevel} Account
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 px-2 md:px-4">
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 h-10 md:h-12 text-sm md:text-base">
                  <User className="h-4 w-4" />
                  <span>Personal Information</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-10 md:h-12 text-sm md:text-base">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 md:mt-6">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm md:text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs md:text-sm">Account Security</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Strong</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-600" />
                  <span className="text-xs md:text-sm">Two-Factor Auth</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs">
                  {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <div className="col-span-1 md:col-span-8 lg:col-span-9">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 md:mb-8 w-full">
              <TabsTrigger value="personal" className="text-sm md:text-base">
                Personal
              </TabsTrigger>
              <TabsTrigger value="security" className="text-sm md:text-base">
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal */}
            <TabsContent value="personal">
              <Card>
                <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                  <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <form onSubmit={handleProfileSubmit(handleProfileUpdate)} className="space-y-6">
                    {/* Avatar */}
                    <div className="space-y-2">
                      <ProfilePictureUpload
                        currentProfilePicture={user?.profilePicture?.url}
                        previewUrl={previewUrl}
                        onPictureChange={handleProfilePictureChange}
                        onPictureRemove={removeProfilePicture}
                        isUploading={isUploadingPicture}
                        uploadProgress={uploadProgress}
                        disabled={isSubmittingProfile}
                        error={pictureError}
                      />
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...registerProfile("firstName")} disabled={isSubmittingProfile} />
                        {profileErrors.firstName && (
                          <p className="text-sm text-red-600">{profileErrors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...registerProfile("lastName")} disabled={isSubmittingProfile} />
                        {profileErrors.lastName && (
                          <p className="text-sm text-red-600">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...registerProfile("email")} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" {...registerProfile("phoneNumber")} disabled={isSubmittingProfile} />
                        {profileErrors.phoneNumber && (
                          <p className="text-sm text-red-600">{profileErrors.phoneNumber.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...registerProfile("address")} disabled={isSubmittingProfile} />
                        {profileErrors.address && (
                          <p className="text-sm text-red-600">{profileErrors.address.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...registerProfile("city")} disabled={isSubmittingProfile} />
                        {profileErrors.city && <p className="text-sm text-red-600">{profileErrors.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...registerProfile("state")} disabled={isSubmittingProfile} />
                        {profileErrors.state && <p className="text-sm text-red-600">{profileErrors.state.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...registerProfile("postalCode")} disabled={isSubmittingProfile} />
                        {profileErrors.postalCode && (
                          <p className="text-sm text-red-600">{profileErrors.postalCode.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...registerProfile("country")} disabled={isSubmittingProfile} />
                        {profileErrors.country && (
                          <p className="text-sm text-red-600">{profileErrors.country.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmittingProfile || isUploadingPicture}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSubmittingProfile || isUploadingPicture ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            {isUploadingPicture ? "Uploading..." : "Saving Changes..."}
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                  <CardTitle className="text-lg md:text-xl">Security Settings</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Manage your password and account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6 space-y-4 md:space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base md:text-lg font-medium">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-xs">{passwordErrors.currentPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                        {passwordErrors.newPassword && (
                          <p className="text-red-500 text-xs">{passwordErrors.newPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />
                        {passwordErrors.confirmPassword && (
                          <p className="text-red-500 text-xs">{passwordErrors.confirmPassword.message}</p>
                        )}
                      </div>
                      <Button type="submit" disabled={isSubmittingPassword} className="w-full md:w-auto">
                        {isSubmittingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
