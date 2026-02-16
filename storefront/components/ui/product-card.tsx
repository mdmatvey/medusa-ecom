"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import type { HttpTypes } from "@medusajs/types"
import { formatPrice, getCheapestPrice } from "@/lib/hooks/use-products"
import { useAddToCart } from "@/lib/hooks/use-cart"

/**
 * Reusable product card component
 *
 * FEATURES:
 * - Image with lazy loading
 * - Title and price (displayed as-is from Medusa, NOT divided by 100)
 * - "Add to Cart" button
 * - Hover effects (smooth scale 1.02)
 * - Links to /products/[handle] dynamic route
 *
 * CRITICAL: Prices from Medusa are as-is (49.99 NOT in cents)
 */

interface ProductCardProps {
  product: HttpTypes.StoreProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const addToCart = useAddToCart()

  // Get cheapest variant price for display
  const price = getCheapestPrice(product)
  const defaultVariant = product.variants?.[0]

  // Get currency code from variant
  const currencyCode =
    defaultVariant?.calculated_price?.currency_code?.toUpperCase() || "EUR"

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent link navigation
    e.stopPropagation()

    if (!defaultVariant) return

    setIsAdding(true)
    try {
      await addToCart.mutateAsync({
        variantId: defaultVariant.id,
        quantity: 1,
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block rounded-lg overflow-hidden bg-white border border-gray-light hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title || "Product image"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />
        ) : (
          // Placeholder if no image
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-16 h-16 text-charcoal/20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-medium text-charcoal mb-2 line-clamp-2 group-hover:text-sage transition-colors">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-sm text-charcoal/60 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="text-lg font-semibold text-charcoal">
            {price !== null ? (
              <>
                {formatPrice(price, currencyCode)}
                {(product.variants?.length || 0) > 1 && (
                  <span className="text-xs font-normal text-charcoal/60 ml-1">from</span>
                )}
              </>
            ) : (
              <span className="text-sm text-charcoal/60">Price unavailable</span>
            )}
          </div>

          {/* Add to Cart Button */}
          {defaultVariant && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Add ${product.title} to cart`}
            >
              {isAdding ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Add"
              )}
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
