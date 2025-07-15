"use client"

import { useState } from "react"
import { User, Mail, Lock, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string | null;
  avatar: string;
}

interface CurrentAdmin {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface NewAdmin {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AdminManagementTabProps {
  onSettingsChange: () => void;
}

type CurrentAdminField = keyof CurrentAdmin;
type PasswordChangeField = keyof PasswordChange;

export function AdminManagementTab({ onSettingsChange }: AdminManagementTabProps) {
  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin>({
    name: "John Administrator",
    email: "admin@securebank.com",
    role: "Super Admin",
    lastLogin: "2023-06-01T10:30:00Z",
  })

  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      name: "John Administrator",
      email: "admin@securebank.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "2023-06-01T10:30:00Z",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Manager",
      email: "sarah@securebank.com",
      role: "Manager",
      status: "active",
      lastLogin: "2023-05-31T16:45:00Z",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mike Supervisor",
      email: "mike@securebank.com",
      role: "Supervisor",
      status: "inactive",
      lastLogin: "2023-05-28T09:15:00Z",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    name: "",
    email: "",
    role: "Supervisor",
    password: "",
    confirmPassword: "",
  })

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleCurrentAdminChange = (field: CurrentAdminField, value: string) => {
    setCurrentAdmin((prev) => ({ ...prev, [field]: value }))
    onSettingsChange()
  }

  const handlePasswordChange = (field: PasswordChangeField, value: string) => {
    setPasswordChange((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddAdmin = () => {
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    const admin: Admin = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: "active",
      lastLogin: null,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setAdmins((prev) => [...prev, admin])
    setNewAdmin({ name: "", email: "", role: "Supervisor", password: "", confirmPassword: "" })
    setIsAddAdminOpen(false)
    onSettingsChange()
  }

  const handleDeleteAdmin = (id: number) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id))
    onSettingsChange()
  }

  const toggleAdminStatus = (id: number) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id ? { ...admin, status: admin.status === "active" ? "inactive" : "active" } : admin,
      ),
    )
    onSettingsChange()
  }

  const roles = [
    { value: "Super Admin", label: "Super Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Operator", label: "Operator" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Admin Profile
          </CardTitle>
          <CardDescription>Update your personal information and login credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Full Name</Label>
              <Input
                id="admin-name"
                value={currentAdmin.name}
                onChange={(e) => handleCurrentAdminChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  className="pl-8"
                  value={currentAdmin.email}
                  onChange={(e) => handleCurrentAdminChange("email", e.target.value)}
                  placeholder="admin@yourbank.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-role">Role</Label>
              <Select value={currentAdmin.role} onValueChange={(value) => handleCurrentAdminChange("role", value)}>
                <SelectTrigger id="admin-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Last Login</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {new Date(currentAdmin.lastLogin).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your login password for enhanced security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordChange.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordChange.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordChange.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              if (passwordChange.newPassword !== passwordChange.confirmPassword) {
                alert("Passwords don't match!")
                return
              }
              setPasswordChange({ currentPassword: "", newPassword: "", confirmPassword: "" })
              onSettingsChange()
            }}
            disabled={!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin Users Management
            </span>
            <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Administrator</DialogTitle>
                  <DialogDescription>Create a new admin account with appropriate permissions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-name">Full Name</Label>
                    <Input
                      id="new-admin-name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-email">Email Address</Label>
                    <Input
                      id="new-admin-email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@yourbank.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-role">Role</Label>
                    <Select
                      value={newAdmin.role}
                      onValueChange={(value) => setNewAdmin((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger id="new-admin-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-password">Password</Label>
                    <Input
                      id="new-admin-password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-confirm">Confirm Password</Label>
                    <Input
                      id="new-admin-confirm"
                      type="password"
                      value={newAdmin.confirmPassword}
                      onChange={(e) => setNewAdmin((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAdmin}>Add Administrator</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Manage administrator accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Administrator</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                        <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-sm text-muted-foreground">{admin.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{admin.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.status === "active" ? "default" : "secondary"}>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleAdminStatus(admin.id)}>
                        {admin.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={admin.id === 1} // Prevent deleting main admin
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
      <Button
        variant="default"
        className="bg-green-600 hover:bg-green-700"
      >
        Save Changes
      </Button>
    </div>
  )
}
