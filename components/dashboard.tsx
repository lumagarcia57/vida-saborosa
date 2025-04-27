"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search, User, MapPin, ShoppingCart, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Fork mascot image URL
  const forkMascotUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4931877402758459127.jpg-l7qsgS4l5UK4sUMrPGnvZazj09SI2W.jpeg"

  return (
    <div className="min-h-screen flex flex-col bg-[#BBF7D0]">
      {/* Header */}
      <div className="bg-emerald-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 mx-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Procurar hambúrguer, massas, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-white border-0 text-sm"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full bg-white p-1">
            <User className="h-6 w-6 text-emerald-700" />
          </Button>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold text-white">
            VIDA <span className="text-yellow-300">SABOROSA</span>
          </h1>
        </div>

        {/* Category buttons */}
        <div className="flex justify-between gap-2 mt-4 pb-2">
          <Button className="flex-1 bg-lime-200 hover:bg-lime-300 text-emerald-800 text-xs rounded-md py-1 h-auto">
            Hambúrguer
          </Button>
          <Button className="flex-1 bg-lime-200 hover:bg-lime-300 text-emerald-800 text-xs rounded-md py-1 h-auto">
            Bebidas
          </Button>
          <Button className="flex-1 bg-lime-200 hover:bg-lime-300 text-emerald-800 text-xs rounded-md py-1 h-auto">
            Lanche
          </Button>
          <Button className="flex-1 bg-lime-200 hover:bg-lime-300 text-emerald-800 text-xs rounded-md py-1 h-auto">
            Saudável
          </Button>
        </div>

        {/* Navigation icons */}
        <div className="flex justify-between mt-4 pb-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
            <MapPin className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
            <ShoppingCart className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
            <Filter className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main Content - Promotions */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Promotion 1 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold uppercase">PEDIDO DE ENTREGA GRÁTIS!</h2>
              <p className="text-sm mt-1">Disponível de 1º a 30 de dezembro de 2025</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">50%</span>
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">35%</span>
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">20%</span>
              </div>
            </div>
            <div className="w-20 h-20 relative">
              <div className="absolute right-0 top-0 w-full h-full">
                <Image
                  src={forkMascotUrl || "/placeholder.svg"}
                  alt="Fork mascot"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Promotion 2 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold uppercase">15% OFF EM RESTAURANTES</h2>
              <p className="text-sm mt-1">Disponível de 15 a 30 de novembro de 2025</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">15%</span>
              </div>
            </div>
            <div className="w-20 h-20 relative">
              <div className="absolute right-0 top-0 w-full h-full">
                <Image
                  src={forkMascotUrl || "/placeholder.svg"}
                  alt="Fork mascot"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Promotion 3 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold uppercase">-30R$ EM PRATOS ESCOLHIDOS</h2>
              <p className="text-sm mt-1">Disponível de 15 a 30 de novembro de 2025</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">30R$</span>
              </div>
            </div>
            <div className="w-20 h-20 relative">
              <div className="absolute right-0 top-0 w-full h-full">
                <Image
                  src={forkMascotUrl || "/placeholder.svg"}
                  alt="Fork mascot"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Promotion 4 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold uppercase">50R$ ACIMA DE 100R$ EM COMPRAS</h2>
              <p className="text-sm mt-1">Disponível de 1 de novembro a 1 de dezembro 2025</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">50R$</span>
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">50R$</span>
                <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded">50R$</span>
              </div>
            </div>
            <div className="w-20 h-20 relative">
              <div className="absolute right-0 top-0 w-full h-full">
                <Image
                  src={forkMascotUrl || "/placeholder.svg"}
                  alt="Fork mascot"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-emerald-700 p-4 mt-auto">
        <Link href="/" className="block text-center text-white hover:opacity-90 transition-opacity">
          Retornar à Página de Login
        </Link>
      </div>
    </div>
  )
}
