"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ButtonProps } from "@/components/ui/button"

interface LinkButtonProps extends ButtonProps {
  href: string
  children: React.ReactNode
}

export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  const router = useRouter()

  return (
    <Button {...props} onClick={() => router.push(href)}>
      {children}
    </Button>
  )
}
