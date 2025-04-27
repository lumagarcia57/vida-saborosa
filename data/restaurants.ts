export type Restaurant = {
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

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Burger King",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: "R$ 5,99",
    distance: "2.5 km",
    categories: ["Hambúrguer", "Fast Food"],
    priceRange: "$$",
  },
  {
    id: "2",
    name: "McDonald's",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.3,
    deliveryTime: "20-30 min",
    deliveryFee: "R$ 4,99",
    distance: "1.8 km",
    categories: ["Hambúrguer", "Fast Food"],
    priceRange: "$$",
  },
  {
    id: "3",
    name: "Sabor Caseiro",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    deliveryTime: "30-45 min",
    deliveryFee: "R$ 6,99",
    distance: "3.2 km",
    categories: ["Hambúrguer", "Caseiro"],
    priceRange: "$$$",
  },
  {
    id: "4",
    name: "Pizzaria Bella Napoli",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.7,
    deliveryTime: "35-50 min",
    deliveryFee: "R$ 7,99",
    distance: "4.0 km",
    categories: ["Pizza", "Italiana"],
    priceRange: "$$$",
  },
  {
    id: "5",
    name: "Sushi Express",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.6,
    deliveryTime: "40-55 min",
    deliveryFee: "R$ 8,99",
    distance: "5.1 km",
    categories: ["Saudável", "Japonesa"],
    priceRange: "$$$",
  },
  {
    id: "6",
    name: "Bebidas & Cia",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.4,
    deliveryTime: "15-25 min",
    deliveryFee: "R$ 3,99",
    distance: "1.5 km",
    categories: ["Bebidas", "Conveniência"],
    priceRange: "$$",
  },
  {
    id: "7",
    name: "Lanchonete do Zé",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.2,
    deliveryTime: "20-30 min",
    deliveryFee: "R$ 4,99",
    distance: "2.0 km",
    categories: ["Lanche", "Salgados"],
    priceRange: "$",
  },
  {
    id: "8",
    name: "Salada Gourmet",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: "R$ 5,99",
    distance: "3.0 km",
    categories: ["Saudável", "Saladas"],
    priceRange: "$$$",
  },
  {
    id: "9",
    name: "Doce Sabor",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "R$ 4,99",
    distance: "2.2 km",
    categories: ["Sobremesas", "Doces"],
    priceRange: "$$",
  },
  {
    id: "10",
    name: "Pizza Hut",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.4,
    deliveryTime: "30-45 min",
    deliveryFee: "R$ 6,99",
    distance: "3.5 km",
    categories: ["Pizza", "Fast Food"],
    priceRange: "$$$",
  },
]

export function getRestaurantsByCategory(category: string): Restaurant[] {
  return restaurants.filter((restaurant) =>
    restaurant.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
  )
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.id === id)
}
