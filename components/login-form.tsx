"use client"

import type React from "react"

import { verifyUser } from "@/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useCartStore } from "@/store/cart-store"
import { Lock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setUserId = useCartStore(s => s.setUserId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const isValid = await verifyUser(email, password)

      if (isValid) {
        setUserId(email)
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para o dashboard...",
        })

        router.push("/dashboard")

      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-700 to-emerald-600 flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col items-center px-4">
        {/* Logo and mascot section */}
        <div className="flex flex-col items-center mt-16 mb-8">
          <div className="w-40 h-40 relative mb-4">
            <Image
              src="https://github.com/lumagarcia57/public-blob/blob/main/4931877402758459127-removebg-preview.png?raw=true"
              alt="Fork mascot"
              width={160}
              height={160}
              className="object-contain"
              style={{
                filter: " invert(0)",
              }}
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-wide">
              VIDA <span className="text-yellow-300">SABOROSA</span>
            </h1>
            <p className="text-white text-xl tracking-wide mt-1">DELIVERY APP</p>
          </div>
        </div>

        {/* Login form card */}
        <div className="bg-white w-full rounded-3xl shadow-lg p-6 pb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-full bg-gray-200 border-0"
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-full bg-gray-200 border-0"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                  className="border-gray-400"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-full text-lg font-medium"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Não possui cadastro?{" "}
              <Link href="/criar-conta" className="text-emerald-600 hover:text-emerald-500">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
