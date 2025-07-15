"use client"

import { useState } from "react"
import { Save, RefreshCw } from "lucide-react"
import { DashboardLayout } from "../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsTab } from "./general-settings-tab"
import { AdminManagementTab } from "./admin-management-tab"
import { BrandingSettingsTab } from "./branding-settings-tab"
import { SecuritySettingsTab } from "./security-settings-tab"
import { PaymentMethodsTab } from "./payment-methods-tab"
import { toast } from "@/components/ui/use-toast"
import { InvestmentPlansTab } from "./investment-plans-tab"
import { LoanProductsTab } from "./loan-products-tab"

export function SettingsManagement() {
  const [activeTab, setActiveTab] = useState("general")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAll = async () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setHasUnsavedChanges(false)
      toast({
        title: "Settings saved successfully",
        description: "All changes have been applied to your banking application.",
      })
    }, 2000)
  }

  const handleReset = () => {
    setHasUnsavedChanges(false)
    toast({
      title: "Settings reset",
      description: "All unsaved changes have been discarded.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold md:text-xl">Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Changes
              </Button>
            )}
            <Button size="sm" onClick={handleSaveAll} disabled={isSaving || !hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              {/* <TabsTrigger value="general">General</TabsTrigger> */}
              <TabsTrigger value="admin">Admin</TabsTrigger>
              {/* <TabsTrigger value="branding">Branding</TabsTrigger> */}
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              {/* <TabsTrigger value="loans">Loans</TabsTrigger> */}
            </TabsList>

            {/* <TabsContent value="general" className="space-y-4">
              <GeneralSettingsTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent> */}

            <TabsContent value="admin" className="space-y-4">
              <AdminManagementTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent>

            {/* <TabsContent value="branding" className="space-y-4">
              <BrandingSettingsTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent> */}

            <TabsContent value="security" className="space-y-4">
              <SecuritySettingsTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <PaymentMethodsTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent>

            <TabsContent value="investments" className="space-y-4">
              <InvestmentPlansTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent>

            {/* <TabsContent value="loans" className="space-y-4">
              <LoanProductsTab onSettingsChange={() => setHasUnsavedChanges(true)} />
            </TabsContent> */}
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  )
}
