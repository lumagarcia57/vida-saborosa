import RestaurantList from "@/components/restaurant-list"
import { getRestaurantsByCategory } from "@/data/restaurants"

export default function BebidasPage() {
  const restaurants = getRestaurantsByCategory("Bebidas")

  return <RestaurantList category="Bebidas" restaurants={restaurants} />
}
