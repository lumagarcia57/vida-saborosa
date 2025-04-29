"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Menu, Star, Clock, MapPin, User, ShoppingCart, ClipboardList, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Restaurant = {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: string
  distance: string
  categories: string[]
  priceRange: string
}

type RestaurantListProps = {
  category: string
  restaurants: Restaurant[]
}

export default function RestaurantList({ category, restaurants }: RestaurantListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#BBF7D0]">
      {/* Header */}
      <div className="bg-emerald-700 px-4 py-3">
        {/* Logo row with navigation buttons */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-emerald-600/20"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <h1 className="text-2xl font-bold text-white">
            VIDA <span className="text-yellow-300">SABOROSA</span>
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-600/20">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
                <User className="mr-2 h-4 w-4" />
                <span>Minha conta</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/carrinho")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Meu carrinho</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/pedidos")}>
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Meus pedidos</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <Home className="mr-2 h-4 w-4" />
                <span>Menu principal</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category title row */}
        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-white">{category}</h2>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="flex-1 px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Restaurantes - {category}</h2>

        <div className="space-y-8">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-40 w-full">
                    <Image
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold">{restaurant.name}</h3>
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{restaurant.distance}</span>
                      <span className="mx-2">•</span>
                      <span>{restaurant.deliveryFee}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {restaurant.categories.map((cat, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {restaurant.priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum restaurante encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
