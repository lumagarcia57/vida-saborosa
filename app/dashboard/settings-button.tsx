"use client"

import { Settings } from "lucide-react"
import { LinkButton } from "@/components/ui/link-button"

export default function SettingsButton() {
  return (
    <LinkButton href="/configuracoes" variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
      <Settings className="h-6 w-6" />
    </LinkButton>
  )
}
