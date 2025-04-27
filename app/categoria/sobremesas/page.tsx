import RestaurantList from "@/components/restaurant-list"
import { getRestaurantsByCategory } from "@/data/restaurants"

export default function SobremesasPage() {
  const restaurants = getRestaurantsByCategory("Sobremesas")

  return <RestaurantList category="Sobremesas" restaurants={restaurants} />
}
