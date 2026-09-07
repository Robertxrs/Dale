"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox" // Need to add checkbox
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart, Gift } from "lucide-react"
import { useState } from "react"

type Item = {
    id: string
    name: string
    price: number
    checked: boolean
}

export default function ShoppingPage() {
    const [marketItems, setMarketItems] = useState<Item[]>([
        { id: "1", name: "Milk", price: 4.50, checked: false },
        { id: "2", name: "Eggs", price: 6.00, checked: true },
        { id: "3", name: "Bread", price: 3.50, checked: false },
    ])

    const [wishlistItems, setWishlistItems] = useState<Item[]>([
        { id: "1", name: "New Monitor", price: 350.00, checked: false },
        { id: "2", name: "Ergonomic Chair", price: 500.00, checked: false },
    ])

    const toggleMarket = (id: string) => {
        setMarketItems(marketItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
    }

    const toggleWishlist = (id: string) => {
        setWishlistItems(wishlistItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
    }

    const marketTotal = marketItems.reduce((acc, item) => acc + item.price, 0)
    const wishlistTotal = wishlistItems.reduce((acc, item) => acc + item.price, 0)

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <CardTitle>Market List</CardTitle>
                    </div>
                    <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {marketItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox id={`market-${item.id}`} checked={item.checked} onCheckedChange={() => toggleMarket(item.id)} />
                                    <label htmlFor={`market-${item.id}`} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                                        {item.name}
                                    </label>
                                </div>
                                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="pt-4 border-t flex justify-between font-bold">
                            <span>Total Estimated</span>
                            <span>${marketTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5" />
                        <CardTitle>Wishlist</CardTitle>
                    </div>
                    <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox id={`wish-${item.id}`} checked={item.checked} onCheckedChange={() => toggleWishlist(item.id)} />
                                    <label htmlFor={`wish-${item.id}`} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                                        {item.name}
                                    </label>
                                </div>
                                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="pt-4 border-t flex justify-between font-bold">
                            <span>Total Estimated</span>
                            <span>${wishlistTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
