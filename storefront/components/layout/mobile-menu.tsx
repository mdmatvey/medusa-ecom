"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { CategoryNode } from "@/lib/hooks/use-categories"

/**
 * Mobile drawer navigation
 *
 * FEATURES:
 * - Slide-in drawer from left
 * - Category list with expand/collapse for subcategories
 * - Close button and backdrop
 * - Mobile only (<1024px)
 * - Smooth animations
 */

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  categories: CategoryNode[]
}

export function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl lg:hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-light px-4 py-4 flex items-center justify-between">
          <span className="text-sage font-display font-semibold text-lg">
            Megobari
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-surface-light transition-colors"
            aria-label="Close menu"
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-6">
          <nav className="space-y-1">
            {/* Categories with subcategories */}
            {categories.map((category) => {
              const hasChildren = category.children.length > 0
              const isExpanded = expandedCategories.has(category.id)

              return (
                <div key={category.id}>
                  <div className="flex items-center">
                    <Link
                      href={`/categories/${category.handle}`}
                      onClick={onClose}
                      className="flex-1 px-3 py-2 text-base font-medium text-charcoal hover:bg-cream rounded-md transition-colors"
                    >
                      {category.name}
                    </Link>

                    {/* Expand/collapse button for categories with children */}
                    {hasChildren && (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-2 rounded-md hover:bg-cream transition-colors"
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
                        aria-expanded={isExpanded}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className={`w-5 h-5 text-charcoal transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {hasChildren && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.children.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/categories/${subcategory.handle}`}
                          onClick={onClose}
                          className="block px-3 py-2 text-sm text-charcoal/80 hover:bg-cream rounded-md transition-colors"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Additional links */}
            <Link
              href="/products"
              onClick={onClose}
              className="block px-3 py-2 text-base font-medium text-charcoal hover:bg-cream rounded-md transition-colors"
            >
              All Teas
            </Link>
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-gray-light" />

          {/* Additional menu items */}
          <nav className="space-y-1">
            <Link
              href="/about"
              onClick={onClose}
              className="block px-3 py-2 text-sm text-charcoal hover:bg-cream rounded-md transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="block px-3 py-2 text-sm text-charcoal hover:bg-cream rounded-md transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block px-3 py-2 text-sm text-charcoal hover:bg-cream rounded-md transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
