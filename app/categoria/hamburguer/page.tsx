import RestaurantList from "@/components/restaurant-list"
import { getRestaurantsByCategory } from "@/data/restaurants"

export default function HamburguerPage() {
  const restaurants = getRestaurantsByCategory("Hambúrguer")

  return <RestaurantList category="Hambúrguer" restaurants={restaurants} />
}
