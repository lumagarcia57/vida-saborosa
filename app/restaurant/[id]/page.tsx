import MenuItemsDisplay from "@/components/menu-items-display"
import { getRestaurantById } from "@/data/restaurants"
import { notFound } from "next/navigation"

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const restaurant = getRestaurantById(id)

  if (!restaurant) notFound()
  return <MenuItemsDisplay restaurant={restaurant} />;
}
