"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Key, LogOut, Shield, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserContext } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { ProfileFormData, ProfileSchema, PasswordFormData, PasswordSchema } from "@/utils/schemas/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/api/axios"
import toast from "react-hot-toast"

export default function ProfileSettingsPage() {
  const { user, logout, loading: userLoading } = useContext(UserContext);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      postalCode: user?.postalCode || '',
      country: user?.country || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  });

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
      });
    }
  }, [user, resetProfile]);

  const handleProfileUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmittingProfile(true);
    setSuccessMessage('');
    try {
      await api.patch('/users/updateDetails', data);
      setSuccessMessage('Your profile has been updated successfully');
      toast.success('Profile updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordChange: SubmitHandler<PasswordFormData> = async (data) => {
    setIsSubmittingPassword(true);
    setSuccessMessage('');
    try {
      await api.patch('/users/changePassword', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccessMessage('Your password has been updated successfully');
      toast.success('Password updated!');
      resetPassword();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.log("This is the error", error);
      toast.error(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!user) {
    router.push('/login');
    return null;
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
                    <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="font-semibold text-base md:text-lg text-center">{user.firstName} {user.lastName}</h3>
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
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-8 lg:col-span-9">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 md:mb-8 w-full">
              <TabsTrigger value="personal" className="text-sm md:text-base">Personal</TabsTrigger>
              <TabsTrigger value="security" className="text-sm md:text-base">Security</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                  <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
                  <CardDescription className="text-sm md:text-base">Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <form onSubmit={handleProfileSubmit(handleProfileUpdate)} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm md:text-base">First Name</Label>
                        <Input id="firstName" {...registerProfile('firstName')} className="h-9 md:h-10" />
                        {profileErrors.firstName && (
                          <p className="text-red-500 text-xs">{profileErrors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm md:text-base">Last Name</Label>
                        <Input id="lastName" {...registerProfile('lastName')} className="h-9 md:h-10" />
                        {profileErrors.lastName && (
                          <p className="text-red-500 text-xs">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm md:text-base">Email Address</Label>
                        <Input id="email" type="email" {...registerProfile('email')} className="h-9 md:h-10" />
                        {profileErrors.email && (
                          <p className="text-red-500 text-xs">{profileErrors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm md:text-base">Phone Number</Label>
                        <Input id="phoneNumber" type="tel" {...registerProfile('phoneNumber')} className="h-9 md:h-10" />
                        {profileErrors.phoneNumber && (
                          <p className="text-red-500 text-xs">{profileErrors.phoneNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm md:text-base">Address</Label>
                      <Textarea id="address" {...registerProfile('address')} className="min-h-[80px] md:min-h-[100px]" />
                      {profileErrors.address && (
                        <p className="text-red-500 text-xs">{profileErrors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm md:text-base">City</Label>
                        <Input id="city" {...registerProfile('city')} className="h-9 md:h-10" />
                        {profileErrors.city && (
                          <p className="text-red-500 text-xs">{profileErrors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm md:text-base">State</Label>
                        <Input id="state" {...registerProfile('state')} className="h-9 md:h-10" />
                        {profileErrors.state && (
                          <p className="text-red-500 text-xs">{profileErrors.state.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm md:text-base">ZIP Code</Label>
                        <Input id="postalCode" {...registerProfile('postalCode')} className="h-9 md:h-10" />
                        {profileErrors.postalCode && (
                          <p className="text-red-500 text-xs">{profileErrors.postalCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm md:text-base">Country</Label>
                      <Input id="country" {...registerProfile('country')} className="h-9 md:h-10" />
                      {profileErrors.country && (
                        <p className="text-red-500 text-xs">{profileErrors.country.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmittingProfile} className="w-full md:w-auto">
                        {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                  <CardTitle className="text-lg md:text-xl">Security Settings</CardTitle>
                  <CardDescription className="text-sm md:text-base">Manage your password and account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6 space-y-4 md:space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base md:text-lg font-medium">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm md:text-base">Current Password</Label>
                        <Input id="currentPassword" type="password" {...registerPassword('currentPassword')} className="h-9 md:h-10" />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-xs">{passwordErrors.currentPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm md:text-base">New Password</Label>
                        <Input id="newPassword" type="password" {...registerPassword('newPassword')} className="h-9 md:h-10" />
                        {passwordErrors.newPassword && (
                          <p className="text-red-500 text-xs">{passwordErrors.newPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm md:text-base">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} className="h-9 md:h-10" />
                        {passwordErrors.confirmPassword && (
                          <p className="text-red-500 text-xs">{passwordErrors.confirmPassword.message}</p>
                        )}
                      </div>
                      <Button type="submit" disabled={isSubmittingPassword} className="w-full md:w-auto">
                        {isSubmittingPassword ? 'Updating...' : 'Update Password'}
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
  );
}
