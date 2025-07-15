"use client"

import { useState } from "react"
import { Shield, Lock, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SecuritySettings {
  loginEnabled: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  autoLockout: boolean;
  lockoutDuration: number;
  ipWhitelist: string[];
  maintenanceMode: boolean;
  auditLogging: boolean;
  emailNotifications: boolean;
}

interface SecuritySettingsTabProps {
  onSettingsChange: (settings: SecuritySettings) => void;
}

export function SecuritySettingsTab({ onSettingsChange }: SecuritySettingsTabProps) {
  const [security, setSecurity] = useState<SecuritySettings>({
    loginEnabled: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    autoLockout: true,
    lockoutDuration: 15,
    ipWhitelist: [],
    maintenanceMode: false,
    auditLogging: true,
    emailNotifications: true,
  })

  const handleChange = (key: keyof SecuritySettings, value: SecuritySettings[keyof SecuritySettings]) => {
    const newSettings = { ...security, [key]: value }
    setSecurity(newSettings)
    onSettingsChange(newSettings)
  }

  const sessionTimeouts = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
    { value: "240", label: "4 hours" },
    { value: "480", label: "8 hours" },
  ]

  const lockoutDurations = [
    { value: "5", label: "5 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
    { value: "1440", label: "24 hours" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Control
          </CardTitle>
          <CardDescription>Configure login settings and access restrictions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-enabled">Enable Login</Label>
              <div className="text-sm text-muted-foreground">Allow users to log into the banking system</div>
            </div>
            <Switch
              id="login-enabled"
              checked={security.loginEnabled}
              onCheckedChange={(checked) => handleChange("loginEnabled", checked)}
            />
          </div>

          {!security.loginEnabled && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Login Disabled</AlertTitle>
              <AlertDescription>
                All user login attempts will be blocked. Only administrators can access the system.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <div className="text-sm text-muted-foreground">Display maintenance message to users</div>
            </div>
            <Switch
              id="maintenance-mode"
              checked={security.maintenanceMode}
              onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
              <div className="text-sm text-muted-foreground">Require 2FA for all admin accounts</div>
            </div>
            <Switch
              id="two-factor-auth"
              checked={security.twoFactorAuth}
              onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <Select
                value={security.sessionTimeout.toString()}
                onValueChange={(value) => handleChange("sessionTimeout", parseInt(value))}
              >
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTimeouts.map((timeout) => (
                    <SelectItem key={timeout.value} value={timeout.value}>
                      {timeout.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input
                id="max-login-attempts"
                type="number"
                min="1"
                max="10"
                value={security.maxLoginAttempts}
                onChange={(e) => handleChange("maxLoginAttempts", parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Policy
          </CardTitle>
          <CardDescription>Configure password requirements and security rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password-min-length">Minimum Password Length</Label>
            <Input
              id="password-min-length"
              type="number"
              min="6"
              max="32"
              value={security.passwordMinLength}
              onChange={(e) => handleChange("passwordMinLength", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-special-chars">Require Special Characters</Label>
                <div className="text-sm text-muted-foreground">
                  Password must contain at least one special character
                </div>
              </div>
              <Switch
                id="require-special-chars"
                checked={security.requireSpecialChars}
                onCheckedChange={(checked) => handleChange("requireSpecialChars", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-numbers">Require Numbers</Label>
                <div className="text-sm text-muted-foreground">Password must contain at least one number</div>
              </div>
              <Switch
                id="require-numbers"
                checked={security.requireNumbers}
                onCheckedChange={(checked) => handleChange("requireNumbers", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-uppercase">Require Uppercase Letters</Label>
                <div className="text-sm text-muted-foreground">Password must contain at least one uppercase letter</div>
              </div>
              <Switch
                id="require-uppercase"
                checked={security.requireUppercase}
                onCheckedChange={(checked) => handleChange("requireUppercase", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Account Lockout
          </CardTitle>
          <CardDescription>Configure automatic account lockout settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-lockout">Enable Auto Lockout</Label>
              <div className="text-sm text-muted-foreground">
                Automatically lock accounts after failed login attempts
              </div>
            </div>
            <Switch
              id="auto-lockout"
              checked={security.autoLockout}
              onCheckedChange={(checked) => handleChange("autoLockout", checked)}
            />
          </div>

          {security.autoLockout && (
            <div className="space-y-2">
              <Label htmlFor="lockout-duration">Lockout Duration</Label>
              <Select
                value={security.lockoutDuration.toString()}
                onValueChange={(value) => handleChange("lockoutDuration", parseInt(value))}
              >
                <SelectTrigger id="lockout-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {lockoutDurations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ip-whitelist">IP Whitelist (Optional)</Label>
            <Input
              id="ip-whitelist"
              placeholder="192.168.1.1, 10.0.0.1, 172.16.0.1"
              value={security.ipWhitelist.join(", ")}
              onChange={(e) => handleChange("ipWhitelist", e.target.value.split(", ").map(ip => ip.trim()))}
            />
            <div className="text-sm text-muted-foreground">
              Comma-separated list of allowed IP addresses. Leave empty to allow all IPs.
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <CardTitle>Monitoring & Notifications</CardTitle>
          <CardDescription>Configure security monitoring and alert settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="audit-logging">Audit Logging</Label>
              <div className="text-sm text-muted-foreground">Log all administrative actions and security events</div>
            </div>
            <Switch
              id="audit-logging"
              checked={security.auditLogging}
              onCheckedChange={(checked) => handleChange("auditLogging", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="text-sm text-muted-foreground">Send email alerts for security events</div>
            </div>
            <Switch
              id="email-notifications"
              checked={security.emailNotifications}
              onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card> */}

      <Alert>
        <AlertTitle>Security Recommendations</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Enable two-factor authentication for enhanced security</li>
            <li>Set a reasonable session timeout to prevent unauthorized access</li>
            <li>Implement a strong password policy with regular expiration</li>
            <li>Monitor failed login attempts to detect potential attacks</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
