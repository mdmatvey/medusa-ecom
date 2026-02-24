"use client"

import { useState } from "react"
import { useProducts } from "@/lib/hooks/use-products"
import { useDefaultRegion } from "@/lib/hooks/use-regions"
import { ProductGrid } from "@/components/sections/product-grid"
import { ProductFilters, type FilterState } from "@/components/sections/product-filters"

/**
 * Product listing page
 *
 * FEATURES:
 * - Fetch products with sdk.store.product.list({ limit, offset, filters })
 * - Pagination or "load more" button
 * - Filters: Price range, category, in-stock only
 * - Sorting: Price, newest, bestsellers
 * - Show 12-24 products per page
 * - Empty state handling
 */

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({ categories: [] })
  const [page, setPage] = useState(0)
  const limit = 12
  const { region } = useDefaultRegion()

  // Build query params from filters
  const queryParams = {
    limit,
    offset: page * limit,
    category_id: filters.categories.length > 0 ? filters.categories : undefined,
    order: filters.sort || undefined,
    region_id: region?.id,
  }

  const { data, isLoading } = useProducts(queryParams)
  const products = data?.products || []
  const totalCount = data?.count || 0
  const hasMore = (page + 1) * limit < totalCount

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(0) // Reset pagination when filters change
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-mint to-sage/20 py-12">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-charcoal mb-4">
            All Teas
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl">
            Explore our complete collection of premium European teas. From delicate greens to
            robust blacks, find your perfect brew.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results count */}
            {!isLoading && (
              <div className="mb-6">
                <p className="text-sm text-charcoal/70">
                  Showing {products.length} of {totalCount} products
                </p>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              emptyMessage="No products match your filters"
            />

            {/* Load More Button */}
            {!isLoading && hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
                >
                  Load More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
