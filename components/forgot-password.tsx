"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Menu, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-[#BBF7D0]">
      {/* Header */}
      <div className="bg-emerald-700 rounded-b-[2rem] px-4 py-6 relative">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-emerald-600/20"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
            <Menu className="h-8 w-8" />
          </Button>
        </div>
        <h1 className="text-white text-4xl font-bold tracking-wide px-4 mb-4">ESQUECI A SENHA</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-12 pb-4">
        <div className="w-20 h-20 bg-emerald-700 rounded-2xl flex items-center justify-center mb-8">
          <Lock className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Problemas para fazer login?</h2>

        <p className="text-center text-gray-600 mb-8">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-14 rounded-full bg-white border-0 mb-6 px-6"
        />

        <Button
          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-full py-6 text-lg font-medium"
          onClick={() => console.log("Reset password")}
        >
          Redefinir senha
        </Button>
      </div>

      {/* Footer */}
      <div className="bg-emerald-700 p-6 mt-auto">
        <Link href="/" className="block text-center text-white text-lg hover:opacity-90 transition-opacity">
          Retornar à Página de Login
        </Link>
      </div>
    </div>
  )
}

