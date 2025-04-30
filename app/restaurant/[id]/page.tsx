"use client"

import { useState, useEffect } from "react"
import { getRestaurantById } from "@/data/restaurants"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample menu items data
const menuItems = [
  {
    id: 1,
    name: "Hambúrguer Clássico",
    description: "Hambúrguer de carne bovina, queijo cheddar, alface, tomate e molho especial.",
    price: 25.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Hambúrgueres",
  },
  {
    id: 2,
    name: "Batata Frita Grande",
    description: "Porção grande de batatas fritas crocantes com sal e temperos especiais.",
    price: 15.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Acompanhamentos",
  },
  {
    id: 3,
    name: "Milk Shake de Chocolate",
    description: "Milk shake cremoso de chocolate com calda e chantilly.",
    price: 18.5,
    image: "/placeholder.svg?height=200&width=200",
    category: "Bebidas",
  },
  {
    id: 4,
    name: "Combo Família",
    description: "4 hambúrgueres, 2 batatas grandes, 4 refrigerantes e 2 sobremesas.",
    price: 89.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Combos",
  },
]

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const restaurant = getRestaurantById(params.id)
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number; image?: string }[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [favoriteItems, setFavoriteItems] = useState<Record<number, boolean>>({})

  // Carregar favoritos do localStorage quando o componente montar
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteItems")
      if (savedFavorites) {
        setFavoriteItems(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorite items from localStorage:", error)
    }
  }, [])

  // Função para alternar o status de favorito
  const toggleFavoriteItem = (itemId: number) => {
    const newFavorites = {
      ...favoriteItems,
      [itemId]: !favoriteItems[itemId],
    }

    setFavoriteItems(newFavorites)

    // Salvar no localStorage
    localStorage.setItem("favoriteItems", JSON.stringify(newFavorites))
  }

  useEffect(() => {
    // Load cart data from localStorage when component mounts
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  if (!restaurant) {
    notFound()
  }

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      let updatedCart
      if (existingItem) {
        // Update quantity if item already exists
        updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        // Add new item to cart
        updatedCart = [
          ...prevCart,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
          },
        ]
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart))

      return updatedCart
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId)

      let updatedCart
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        updatedCart = prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        // Remove item from cart if quantity is 1
        updatedCart = prevCart.filter((item) => item.id !== itemId)
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart))

      return updatedCart
    })
  }

  const getItemQuantityInCart = (itemId: number) => {
    const item = cart.find((item) => item.id === itemId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
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
      <div className="bg-white -mt-6 rounded-t-3xl p-6 flex-1">
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
                                onClick={() => {
                                  addToCart(item)
                                }}
                              >
                                Adicionar ao carrinho
                              </Button>
                              <Button
                                variant="outline"
                                className={favoriteItems[item.id] ? "text-red-500 border-red-500" : ""}
                                onClick={() => toggleFavoriteItem(item.id)}
                              >
                                <Heart
                                  className="h-4 w-4 mr-2"
                                  fill={favoriteItems[item.id] ? "currentColor" : "none"}
                                />
                                {favoriteItems[item.id] ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
                          toggleFavoriteItem(item.id)
                        }}
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={favoriteItems[item.id] ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={favoriteItems[item.id] ? "currentColor" : "none"}
                          stroke={favoriteItems[item.id] ? "none" : "currentColor"}
                        />
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      {getItemQuantityInCart(item.id) > 0 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2 font-medium">{getItemQuantityInCart(item.id)}</span>
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
