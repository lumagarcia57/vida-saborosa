"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Bell, User, CreditCard, Lock, HelpCircle, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { updateUserSettings } from "@/actions/user-actions"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Sample user data - in a real app, this would be fetched from the server
  const [userData, setUserData] = useState({
    fullName: "Usuário Exemplo",
    email: "usuario@exemplo.com",
    phone: "(11) 99999-9999",
    profileImage: "",
    notifications: {
      promotions: true,
      orderUpdates: true,
      newRestaurants: false,
    },
    paymentMethods: [{ id: 1, type: "Cartão de Crédito", last4: "4242", default: true }],
  })

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true)

    try {
      await updateUserSettings(userData, section)

      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar suas configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#BBF7D0] flex flex-col">
      {/* Header */}
      <div className="bg-emerald-700 rounded-b-[2rem] px-4 py-6 relative">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-emerald-600/20"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <h1 className="text-white text-2xl font-bold">Configurações</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 px-4 py-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
          </TabsList>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Bell className="h-6 w-6 mr-3 text-emerald-700" />
                  <h2 className="text-xl font-semibold">Notificações</h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="promotions" className="flex-1">
                    Promoções e descontos
                  </Label>
                  <Switch
                    id="promotions"
                    checked={userData.notifications.promotions}
                    onCheckedChange={(checked) => {
                      setUserData({
                        ...userData,
                        notifications: {
                          ...userData.notifications,
                          promotions: checked,
                        },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="orderUpdates" className="flex-1">
                    Atualizações de pedidos
                  </Label>
                  <Switch
                    id="orderUpdates"
                    checked={userData.notifications.orderUpdates}
                    onCheckedChange={(checked) => {
                      setUserData({
                        ...userData,
                        notifications: {
                          ...userData.notifications,
                          orderUpdates: checked,
                        },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="newRestaurants" className="flex-1">
                    Novos restaurantes
                  </Label>
                  <Switch
                    id="newRestaurants"
                    checked={userData.notifications.newRestaurants}
                    onCheckedChange={(checked) => {
                      setUserData({
                        ...userData,
                        notifications: {
                          ...userData.notifications,
                          newRestaurants: checked,
                        },
                      })
                    }}
                  />
                </div>

                <Button
                  className="w-full bg-emerald-700 hover:bg-emerald-600 mt-4"
                  onClick={() => handleSaveSettings("notifications")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar preferências
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-3 text-emerald-700" />
                  <h2 className="text-xl font-semibold">Dados Pessoais</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                    <User className="h-12 w-12 text-emerald-700" />
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar foto
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={userData.fullName}
                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                </div>

                <Button
                  className="w-full bg-emerald-700 hover:bg-emerald-600 mt-4"
                  onClick={() => handleSaveSettings("profile")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar alterações
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-emerald-700" />
                  <h2 className="text-xl font-semibold">Métodos de Pagamento</h2>
                </div>
              </div>

              <div className="space-y-4">
                {userData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{method.type}</p>
                      <p className="text-sm text-gray-500">**** **** **** {method.last4}</p>
                    </div>
                    {method.default && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Padrão</span>
                    )}
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  Adicionar novo método de pagamento
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-emerald-700" />
                  <h2 className="text-xl font-semibold">Segurança</h2>
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Alterar senha
                </Button>

                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactor" className="flex-1">
                    Autenticação de dois fatores
                  </Label>
                  <Switch id="twoFactor" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="biometric" className="flex-1">
                    Login biométrico
                  </Label>
                  <Switch id="biometric" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <HelpCircle className="h-6 w-6 mr-3 text-emerald-700" />
                  <h2 className="text-xl font-semibold">Suporte</h2>
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Falar com atendente
                </Button>

                <Button variant="outline" className="w-full">
                  Perguntas frequentes
                </Button>

                <Button variant="outline" className="w-full">
                  Reportar um problema
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-24 h-24 mb-4">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4931877402758459127.jpg-l7qsgS4l5UK4sUMrPGnvZazj09SI2W.jpeg"
                    alt="Vida Saborosa Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold">Vida Saborosa</h2>
                <p className="text-gray-500">Versão 1.0.0</p>
                <p className="text-sm text-center mt-4">© 2025 Vida Saborosa. Todos os direitos reservados.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
