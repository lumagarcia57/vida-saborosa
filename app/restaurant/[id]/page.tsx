import { getRestaurantById } from "@/data/restaurants"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Star, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = getRestaurantById(params.id)

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
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
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

        {/* Menu sections - placeholder */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Menu</h2>

          <div className="space-y-4">
            {/* Placeholder menu items */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-50 p-4 rounded-lg flex justify-between">
                <div>
                  <h3 className="font-medium">Item do Menu #{item}</h3>
                  <p className="text-sm text-gray-500 mt-1">Descrição do item do menu</p>
                  <p className="text-emerald-700 font-medium mt-2">R$ {(Math.random() * 30 + 10).toFixed(2)}</p>
                </div>
                <div className="h-20 w-20 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky order button */}
      <div className="sticky bottom-0 bg-white p-4 border-t">
        <Button className="w-full bg-emerald-700 hover:bg-emerald-600">Ver Carrinho</Button>
      </div>
    </div>
  )
}
