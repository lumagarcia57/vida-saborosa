import RestaurantList from "@/components/restaurant-list"
import { getRestaurantsByCategory } from "@/data/restaurants"

export default function PizzaPage() {
  const restaurants = getRestaurantsByCategory("Pizza")

  return <RestaurantList category="Pizza" restaurants={restaurants} />
}
