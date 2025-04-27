"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250214_201052_Canva.jpg-ZkB1cOwzeVzxh5cYYlPecPg218AOiv.jpeg"
              alt="Fork mascot"
              width={200}
              height={200}
              className="object-contain"
              style={{
                filter: "brightness(0) invert(1)",
                opacity: 0.9,
              }}
            />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-wide">
              VIDA <span className="text-yellow-300">SABOROSA</span>
            </h1>
            <p className="text-white text-xl tracking-wide">DELIVERY APP</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg">
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-14 rounded-full bg-gray-100"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-14 rounded-full bg-gray-100"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Lembrar-me
                </Label>
              </div>
              <Link href="/esqueci-senha" className="text-sm text-emerald-600 hover:text-emerald-500">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-full text-lg font-medium"
              type="submit"
            >
              Entrar
            </Button>

            <div className="text-center text-sm text-gray-600">
              Não possui cadastro?{" "}
              <Link href="#" className="text-emerald-600 hover:text-emerald-500">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

