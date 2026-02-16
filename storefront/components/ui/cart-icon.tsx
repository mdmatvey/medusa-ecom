"use client"

import Link from "next/link"
import { useCart } from "@/lib/hooks/use-cart"

/**
 * Cart icon with item count badge
 *
 * CRITICAL ACCESSIBILITY:
 * - Badge has aria-live="polite" for screen readers
 * - Announces cart count changes automatically
 * - Always visible (desktop + mobile)
 *
 * FEATURES:
 * - Real-time cart item count
 * - Badge only visible when count > 0
 * - Links to cart page
 * - Smooth animations
 */

export function CartIcon() {
  const { itemCount, isLoading } = useCart()

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center p-2 rounded-full hover:bg-surface-light transition-colors duration-200"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Cart icon (shopping bag) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-text-primary"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>

      {/* Item count badge - CRITICAL: aria-live for screen readers */}
      {!isLoading && itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-semibold text-white bg-accent-primary rounded-full animate-scale-in"
          aria-live="polite"
          aria-atomic="true"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}

      {/* Loading state */}
      {isLoading && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5">
          <span className="animate-pulse w-4 h-4 bg-accent-primary/50 rounded-full" />
        </span>
      )}
    </Link>
  )
}
