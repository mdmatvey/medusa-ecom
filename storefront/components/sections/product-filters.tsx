"use client"

import { useState } from "react"
import { useCategoryTree } from "@/lib/hooks/use-categories"

/**
 * Product filters sidebar
 *
 * FEATURES:
 * - Price range slider
 * - Category checkboxes (fetched from Medusa)
 * - In-stock toggle
 * - Sort dropdown
 * - Clear filters button
 * - Mobile-friendly drawer
 */

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  categories: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
}

export function ProductFilters({ onFiltersChange, initialFilters }: ProductFiltersProps) {
  const { categoryTree, isLoading: categoriesLoading } = useCategoryTree()
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || { categories: [] }
  )

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const categories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId]

    updateFilters({ categories })
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = { categories: [] }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-charcoal">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-sage hover:text-accent transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-charcoal mb-2">
            Sort by
          </label>
          <select
            value={filters.sort || ""}
            onChange={(e) => updateFilters({ sort: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="created_desc">Newest First</option>
            <option value="title_asc">Name: A to Z</option>
          </select>
        </div>

        {/* Categories */}
        {!categoriesLoading && categoryTree.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-charcoal mb-3">Categories</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categoryTree.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-sage border-gray-light rounded focus:ring-sage focus:ring-2"
                  />
                  <span className="text-sm text-charcoal/80">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-charcoal mb-3">Price Range</h4>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) =>
                updateFilters({
                  minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              min="0"
              step="0.01"
            />
            <span className="text-charcoal/60">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                updateFilters({
                  maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* In Stock Toggle */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => updateFilters({ inStock: e.target.checked })}
              className="w-4 h-4 text-sage border-gray-light rounded focus:ring-sage focus:ring-2"
            />
            <span className="text-sm text-charcoal/80">In stock only</span>
          </label>
        </div>
      </div>
    </aside>
  )
}
