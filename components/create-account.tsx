"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Menu, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { createUser } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

export default function CreateAccount() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = "Nome completo é obrigatório"
      isValid = false
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Nome de usuário é obrigatório"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await createUser({
        email: formData.email,
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
      })

      if (result.success) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para a página de login.",
        })

        // Redirect to login page after successful account creation
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        toast({
          title: "Erro ao criar conta",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        <h1 className="text-white text-4xl font-bold tracking-wide px-4 mb-4">CRIE SUA CONTA</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-12 pb-4">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="h-14 rounded-full bg-white border-0 px-6"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1 ml-4">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <Input
                type="text"
                name="fullName"
                placeholder="Nome Completo"
                value={formData.fullName}
                onChange={handleChange}
                className="h-14 rounded-full bg-white border-0 px-6"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm mt-1 ml-4">{errors.fullName}</p>}
          </div>

          <div>
            <div className="relative">
              <Input
                type="text"
                name="username"
                placeholder="Usuário"
                value={formData.username}
                onChange={handleChange}
                className="h-14 rounded-full bg-white border-0 px-6"
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm mt-1 ml-4">{errors.username}</p>}
          </div>

          <div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                className="h-14 rounded-full bg-white border-0 px-6 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1 ml-4">{errors.password}</p>}
          </div>

          <div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repetir Senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-14 rounded-full bg-white border-0 px-6 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-4">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-full py-6 text-lg font-medium mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar uma conta"}
          </Button>
        </form>
      </div>
    </div>
  )
}
