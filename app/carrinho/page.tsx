"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// This is a simple cart page. In a real app, you would use a state management solution
// like Context API, Redux, or Zustand to manage the cart state across the app.
export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulating cart data - in a real app, this would come from a state management solution
  useEffect(() => {
    // Simulating loading cart data
    setTimeout(() => {
      setCart([
        {
          id: 1,
          name: "Hambúrguer Clássico",
          price: 25.9,
          quantity: 2,
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 3,
          name: "Milk Shake de Chocolate",
          price: 18.5,
          quantity: 1,
          image: "/placeholder.svg?height=100&width=100",
        },
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    alert("Funcionalidade de checkout será implementada em breve!")
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
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            VIDA <span className="text-yellow-300">SABOROSA</span>
          </h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-white">Meu Carrinho</h2>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Carregando seu carrinho...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Seu carrinho está vazio</h3>
            <p className="text-gray-500 mt-2 text-center">
              Adicione itens do menu de um restaurante para começar seu pedido.
            </p>
            <Button className="mt-6 bg-emerald-700 hover:bg-emerald-600" onClick={() => router.push("/dashboard")}>
              Explorar restaurantes
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 flex items-center">
                  <div className="h-16 w-16 relative mr-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-emerald-700 font-medium">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4">Resumo do pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {getTotalPrice().toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de entrega</span>
                  <span>R$ 5,99</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {(getTotalPrice() + 5.99).toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-white p-4 border-t shadow-md">
          <Button className="w-full bg-emerald-700 hover:bg-emerald-600" onClick={handleCheckout}>
            Finalizar pedido • R$ {(getTotalPrice() + 5.99).toFixed(2).replace(".", ",")}
          </Button>
        </div>
      )}
    </div>
  )
}
