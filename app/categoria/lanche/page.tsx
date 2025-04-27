import RestaurantList from "@/components/restaurant-list"
import { getRestaurantsByCategory } from "@/data/restaurants"

export default function LanchePage() {
  const restaurants = getRestaurantsByCategory("Lanche")

  return <RestaurantList category="Lanche" restaurants={restaurants} />
}
