"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart, Star, Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { restaurants } from "@/data/restaurants"

export default function FavoritosPage() {
  const router = useRouter()
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Record<string, boolean>>({})
  const [favoriteItems, setFavoriteItems] = useState<Record<number, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    try {
      // Carregar restaurantes favoritos
      const savedRestaurants = localStorage.getItem("favoriteRestaurants")
      if (savedRestaurants) {
        setFavoriteRestaurants(JSON.parse(savedRestaurants))
      }

      // Carregar itens favoritos
      const savedItems = localStorage.getItem("favoriteItems")
      if (savedItems) {
        setFavoriteItems(JSON.parse(savedItems))
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filtrar restaurantes favoritos
  const favoriteRestaurantsList = restaurants.filter((restaurant) => favoriteRestaurants[restaurant.id])

  // Remover restaurante dos favoritos
  const removeRestaurantFromFavorites = (restaurantId: string) => {
    const newFavorites = { ...favoriteRestaurants }
    delete newFavorites[restaurantId]

    setFavoriteRestaurants(newFavorites)
    localStorage.setItem("favoriteRestaurants", JSON.stringify(newFavorites))
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#BBF7D0]">
      {/* Header */}
      <div className="bg-emerald-700 px-4 py-3">
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
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-white">Meus Favoritos</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <Tabs defaultValue="restaurants" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
            <TabsTrigger value="items">Itens</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : favoriteRestaurantsList.length > 0 ? (
              <div className="space-y-6">
                {favoriteRestaurantsList.map((restaurant) => (
                  <div key={restaurant.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <Link href={`/restaurant/${restaurant.id}`}>
                      <div className="relative h-40 w-full">
                        <Image
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{restaurant.name}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeRestaurantFromFavorites(restaurant.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Remover dos favoritos"
                          >
                            <Heart className="h-5 w-5" fill="currentColor" />
                          </button>
                          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-sm font-medium">{restaurant.rating}</span>
                          </div>
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 flex flex-col items-center">
                <Heart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Você ainda não tem restaurantes favoritos.</p>
                <Button className="mt-4 bg-emerald-700 hover:bg-emerald-600" onClick={() => router.push("/dashboard")}>
                  Explorar restaurantes
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="items">
            <div className="text-center py-8 flex flex-col items-center">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Você ainda não tem itens favoritos.</p>
              <Button className="mt-4 bg-emerald-700 hover:bg-emerald-600" onClick={() => router.push("/dashboard")}>
                Explorar restaurantes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
