"use client"

import Link from "next/link"
import { useCategoryTree } from "@/lib/hooks/use-categories"

/**
 * Featured categories section
 *
 * CRITICAL: NEVER hardcode categories - ALWAYS fetch from Medusa
 *
 * FEATURES:
 * - Grid of tea types (Green, Black, Herbal, etc.)
 * - Fetch categories from Medusa backend
 * - Category images and links
 * - Hover effects
 */

export function FeaturedCategories() {
  const { categoryTree, isLoading } = useCategoryTree()

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-charcoal">
              Explore Our Collection
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-light animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Show first 6 categories
  const displayCategories = categoryTree.slice(0, 6)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-charcoal mb-4">
            Explore Our Collection
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            From delicate greens to robust blacks, discover your perfect cup among our
            carefully curated selection.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-mint/30 to-sage/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Category Icon/Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-16 h-16 text-sage/40 group-hover:text-sage/60 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>

              {/* Category Name */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-medium text-center group-hover:text-mint transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {categoryTree.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center text-base font-medium text-sage hover:text-accent transition-colors"
            >
              View all categories
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
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
