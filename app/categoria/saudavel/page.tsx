import RestaurantList from "@/components/restaurant-list"
import { getRestaurantsByCategory } from "@/data/restaurants"

export default function SaudavelPage() {
  const restaurants = getRestaurantsByCategory("Saudável")

  return <RestaurantList category="Saudável" restaurants={restaurants} />
}
