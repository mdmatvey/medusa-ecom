"use client"

import type { HttpTypes } from "@medusajs/types"
import { ProductCard } from "@/components/ui/product-card"

/**
 * Product grid component
 *
 * FEATURES:
 * - Grid layout responsive (1/2/3/4 columns)
 * - Uses ProductCard component
 * - Loading states with skeleton loaders
 * - Empty state handling
 */

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  isLoading?: boolean
  emptyMessage?: string
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "No products found",
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-gray-light animate-pulse rounded-lg"
          />
        ))}
      </div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-24 h-24 text-charcoal/20 mx-auto mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <h3 className="text-xl font-medium text-charcoal mb-2">{emptyMessage}</h3>
        <p className="text-charcoal/60 mb-6">
          Try adjusting your filters or browse our featured categories.
        </p>
        <a
          href="/products"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
        >
          View all teas
        </a>
      </div>
    )
  }

  // Product grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
