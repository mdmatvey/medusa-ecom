"use client"

import { useFeaturedProducts } from "@/lib/hooks/use-products"
import { ProductCard } from "@/components/ui/product-card"

/**
 * Featured products section
 *
 * FEATURES:
 * - Product slider/grid
 * - Fetch with sdk.store.product.list({ limit: 8 })
 * - Use ProductCard component
 * - "Add to Cart" functionality
 * - Show price as-is (no division by 100)
 */

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts(8)

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-charcoal mb-4">
            Featured Selection
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Handpicked favorites and bestsellers from our premium collection.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-light animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-charcoal/60">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
