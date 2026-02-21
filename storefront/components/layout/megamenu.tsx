"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { CategoryNode } from "@/lib/hooks/use-categories"

/**
 * Megamenu dropdown for desktop navigation
 *
 * CRITICAL PATTERNS:
 * - position: absolute, left: 0, right: 0 (spans full navbar width)
 * - MUST stay open when hovering over dropdown content (not just trigger)
 * - Debounced close (300ms) to prevent flickering
 * - Desktop only (>1024px)
 *
 * LAYOUT:
 * - 3-5 columns: Tea subcategories + promotional image
 * - Grouped by parent category
 * - Links to category pages
 */

interface MegaMenuProps {
  activeCategory: string | null
  categories: CategoryNode[]
  onMouseLeave: () => void
}

export function MegaMenu({ activeCategory, categories, onMouseLeave }: MegaMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Find active category data
  const activeCategoryData = categories.find((cat) => cat.id === activeCategory)

  // Show menu when active category is set
  useEffect(() => {
    if (activeCategory) {
      // Clear any pending close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
      setIsVisible(true)
    } else {
      // Debounced close to prevent flickering
      closeTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [activeCategory])

  // Don't render if no active category
  if (!activeCategoryData || !isVisible) {
    return null
  }

  const hasChildren = activeCategoryData.children.length > 0

  return (
    <div
      className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-gray-light shadow-lg"
      onMouseEnter={() => {
        // Cancel close timeout when hovering dropdown
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current)
        }
      }}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Category info and main link */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-charcoal mb-4">
              {activeCategoryData.name}
            </h3>
            {activeCategoryData.description && (
              <p className="text-sm text-charcoal/70 mb-4 line-clamp-3">
                {activeCategoryData.description}
              </p>
            )}
            <Link
              href={`/categories/${activeCategoryData.handle}`}
              className="inline-flex items-center text-sm font-medium text-sage hover:text-accent transition-colors"
            >
              View all {activeCategoryData.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>

          {/* Subcategories */}
          {hasChildren ? (
            <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-4">
              {activeCategoryData.children.map((subcategory) => (
                <div key={subcategory.id}>
                  <Link
                    href={`/categories/${subcategory.handle}`}
                    className="block text-sm font-medium text-charcoal hover:text-sage transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                  {subcategory.description && (
                    <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">
                      {subcategory.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-2">
              <p className="text-sm text-charcoal/60">
                Explore our collection of premium {activeCategoryData.name?.toLowerCase()} teas
                from Europe.
              </p>
            </div>
          )}

          {/* Promotional image/content */}
          <div className="col-span-1 bg-cream rounded-lg p-4 flex flex-col justify-center items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-16 h-16 text-sage/40 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
            <p className="text-sm font-medium text-charcoal">
              Premium Quality
            </p>
            <p className="text-xs text-charcoal/60 mt-1">
              Sourced from the finest European tea gardens
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
