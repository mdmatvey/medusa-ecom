"use client"

import { useState } from "react"
import Link from "next/link"
import { CartIcon } from "@/components/ui/cart-icon"
import { MegaMenu } from "./megamenu"
import { MobileMenu } from "./mobile-menu"
import { useCategoryTree } from "@/lib/hooks/use-categories"

/**
 * Main navigation bar with megamenu
 *
 * CRITICAL PATTERNS:
 * - MUST have position: relative (creates positioning context for megamenu)
 * - Cart icon ALWAYS visible (desktop + mobile)
 * - Categories fetched dynamically from Medusa (NEVER hardcoded)
 * - Sticky positioning for easy cart access
 *
 * LAYOUT:
 * - Logo on left
 * - Categories in center (desktop only)
 * - Search + Cart on right
 * - Mobile menu button (<1024px)
 */

export function Navbar() {
  const { categoryTree, isLoading } = useCategoryTree()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>(null)

  // Handle category hover for megamenu
  const handleCategoryHover = (categoryId: string | null) => {
    setActiveMenuCategory(categoryId)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-light relative">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button - left side on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-surface-light transition-colors"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo - left on desktop, center on mobile */}
            <Link
              href="/"
              className="flex items-center space-x-2 lg:mr-8 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <div className="text-sage font-display font-semibold text-xl tracking-wide">
                Megobari
              </div>
            </Link>

            {/* Desktop Navigation - Categories in center */}
            {!isLoading && (
              <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                {categoryTree.map((category) => (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    onMouseLeave={() => handleCategoryHover(null)}
                  >
                    <Link
                      href={`/categories/${category.handle}`}
                      className="px-4 py-2 text-sm font-medium text-charcoal hover:text-sage transition-colors rounded-md hover:bg-cream/50"
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}

                {/* Additional navigation items */}
                <Link
                  href="/products"
                  className="px-4 py-2 text-sm font-medium text-charcoal hover:text-sage transition-colors rounded-md hover:bg-cream/50"
                >
                  All Teas
                </Link>
              </div>
            )}

            {/* Right side - Search + Cart (always visible) */}
            <div className="flex items-center space-x-2">
              {/* Search button - desktop only for now */}
              <button
                className="hidden lg:inline-flex p-2 rounded-full hover:bg-surface-light transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-charcoal"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>

              {/* Cart icon - ALWAYS visible */}
              <CartIcon />
            </div>
          </div>
        </div>

        {/* Megamenu - Desktop only */}
        <MegaMenu
          activeCategory={activeMenuCategory}
          categories={categoryTree}
          onMouseLeave={() => handleCategoryHover(null)}
        />
      </nav>

      {/* Mobile Menu - Mobile only */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categoryTree}
      />
    </>
  )
}
