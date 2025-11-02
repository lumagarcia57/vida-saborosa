"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import menuItems from "@/data/menuItems"
import { Restaurant } from "@/data/restaurants"
import { useCartStore, useFavoritesStore } from "@/store/cart-store"
import { ChevronLeft, Clock, Heart, MapPin, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MenuItemsDisplay({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    cart,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalPrice,
    getTotalItems,
    isHydrated,
    userId
  } = useCartStore()

  const { toggleFavorite, isFavorite } = useFavoritesStore()

  useEffect(() => {
    useCartStore.getState().setUserId(userId)
    useFavoritesStore.getState().setUserId(userId)
    setIsLoading(false)
  }, [userId])

  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BBF7D0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-emerald-700">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#BBF7D0]">
      {/* Header with restaurant image */}
      <div className="relative h-64 w-full">
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent">
          <div className="p-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => router.back()}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurant info */}
      <div className="bg-white p-6 flex-1">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
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
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{restaurant.priceRange}</span>
        </div>

        {/* Menu sections */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Menu</h2>

          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <h3
                          className="font-medium text-emerald-700 cursor-pointer hover:underline"
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.name}
                        </h3>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.name}</DialogTitle>
                          <DialogDescription className="pt-4">
                            <div className="flex flex-col items-center mb-4">
                              <div className="relative h-40 w-40 mb-4">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <p className="text-center mb-4">{item.description}</p>
                              <p className="text-emerald-700 font-bold text-xl">
                                R$ {item.price.toFixed(2).replace(".", ",")}
                              </p>
                            </div>
                            <div className="flex justify-center gap-2 mt-4">
                              <Button
                                className="bg-emerald-700 hover:bg-emerald-600"
                                onClick={() => addToCart(item)}
                              >
                                Adicionar ao carrinho
                              </Button>
                              <Button
                                variant="outline"
                                className={isFavorite(item.id) ? "text-red-500 border-red-500" : ""}
                                onClick={() => toggleFavorite(item.id)}
                              >
                                <Heart
                                  className="h-4 w-4 mr-2"
                                  fill={isFavorite(item.id) ? "currentColor" : "none"}
                                />
                                {isFavorite(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                              </Button>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-emerald-700 font-medium mt-2">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="h-20 w-20 bg-gray-200 rounded-md relative overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={isFavorite(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={isFavorite(item.id) ? "currentColor" : "none"}
                          stroke={isFavorite(item.id) ? "none" : "currentColor"}
                        />
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      {getItemQuantity(item.id) > 0 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2 font-medium">{getItemQuantity(item.id)}</span>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-emerald-700 text-white hover:bg-emerald-600 border-0"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky cart button */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-white p-4 border-t shadow-md">
          <Button
            className="w-full bg-emerald-700 hover:bg-emerald-600 flex justify-between items-center"
            onClick={() => router.push("/carrinho")}
          >
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span>
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"}
              </span>
            </div>
            <span>R$ {getTotalPrice().toFixed(2).replace(".", ",")}</span>
          </Button>
        </div>
      )}
    </div>
  )
}