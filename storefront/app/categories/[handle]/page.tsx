"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useCategory } from "@/lib/hooks/use-categories"
import { useProducts } from "@/lib/hooks/use-products"
import { useDefaultRegion } from "@/lib/hooks/use-regions"
import { ProductGrid } from "@/components/sections/product-grid"
import { ProductFilters, type FilterState } from "@/components/sections/product-filters"

/**
 * Category listing page (dynamic route)
 *
 * CRITICAL: Use dynamic route [handle], NOT static files
 *
 * FEATURES:
 * - Fetch products filtered by category
 * - Similar layout to product listing page
 * - Category-specific banner/description
 */

export default function CategoryPage() {
  const params = useParams()
  const handle = params.handle as string

  const { data: category, isLoading: categoryLoading } = useCategory(handle)
  const { region } = useDefaultRegion()
  const [filters, setFilters] = useState<FilterState>({ categories: [] })
  const [page, setPage] = useState(0)
  const limit = 12

  // Auto-select this category in filters when it loads
  if (category && !filters.categories.includes(category.id)) {
    setFilters((prev) => ({ ...prev, categories: [category.id] }))
  }

  const queryParams = {
    limit,
    offset: page * limit,
    category_id: filters.categories.length > 0 ? filters.categories : category ? [category.id] : undefined,
    order: filters.sort || undefined,
    region_id: region?.id,
  }

  const { data, isLoading: productsLoading } = useProducts(queryParams)
  const products = data?.products || []
  const totalCount = data?.count || 0
  const hasMore = (page + 1) * limit < totalCount

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(0)
  }

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-sage border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Category not found</h1>
          <a
            href="/products"
            className="inline-flex items-center text-sage hover:text-accent transition-colors"
          >
            Browse all products
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Category Header */}
      <div className="bg-gradient-to-br from-mint to-sage/20 py-12">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-charcoal/60">
              <li>
                <a href="/" className="hover:text-sage transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/products" className="hover:text-sage transition-colors">
                  Products
                </a>
              </li>
              <li>/</li>
              <li className="text-charcoal font-medium">{category.name}</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-display font-bold text-charcoal mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-charcoal/70 max-w-2xl">{category.description}</p>
          )}
        </div>
      </div>

      {/* Products Content */}
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
            {!productsLoading && (
              <div className="mb-6">
                <p className="text-sm text-charcoal/70">
                  Showing {products.length} of {totalCount} products
                </p>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={products}
              isLoading={productsLoading}
              emptyMessage={`No products found in ${category.name}`}
            />

            {/* Load More Button */}
            {!productsLoading && hasMore && (
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
