"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

/**
 * Cart management hook using Medusa SDK and React Query
 *
 * CRITICAL PATTERNS:
 * - ALWAYS use Medusa SDK (never regular fetch)
 * - NEVER use JSON.stringify() on body parameters
 * - Prices from Medusa are as-is (49.99 NOT in cents)
 * - Invalidate queries on mutations for auto-sync
 */

// Cart query key for React Query cache
const CART_QUERY_KEY = ["cart"]

// Get cart ID from localStorage (persists across sessions)
function getCartId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("cart_id")
}

// Save cart ID to localStorage
function setCartId(cartId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart_id", cartId)
  }
}

// Clear cart ID from localStorage
function clearCartId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart_id")
  }
}

/**
 * Fetch cart from Medusa backend
 * Returns null if no cart exists yet
 */
async function fetchCart(): Promise<HttpTypes.StoreCart | null> {
  const cartId = getCartId()
  if (!cartId) return null

  try {
    const response = await sdk.store.cart.retrieve(cartId)
    return response.cart
  } catch (error) {
    // Cart not found or expired - clear invalid cart ID
    clearCartId()
    return null
  }
}

/**
 * Create a new cart
 */
async function createCart(
  regionId?: string
): Promise<HttpTypes.StoreCart> {
  const response = await sdk.store.cart.create({
    region_id: regionId,
  })

  const cart = response.cart
  setCartId(cart.id)
  return cart
}

/**
 * Hook to access cart state
 * Auto-creates cart if none exists
 */
export function useCart() {
  const queryClient = useQueryClient()

  const { data: cart, isLoading } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
  })

  // Get total item count for badge
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return {
    cart,
    isLoading,
    itemCount,
  }
}

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      variantId,
      quantity = 1,
    }: {
      variantId: string
      quantity?: number
    }) => {
      let cartId = getCartId()

      // Create cart if it doesn't exist
      if (!cartId) {
        const newCart = await createCart()
        cartId = newCart.id
      }

      // Add item to cart using SDK
      const response = await sdk.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity,
      })

      return response.cart
    },
    onSuccess: (cart) => {
      // Update cache with new cart state
      queryClient.setQueryData(CART_QUERY_KEY, cart)
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error)
    },
  })
}

/**
 * Hook to update line item quantity
 */
export function useUpdateLineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      lineItemId,
      quantity,
    }: {
      lineItemId: string
      quantity: number
    }) => {
      const cartId = getCartId()
      if (!cartId) throw new Error("No cart found")

      // Update line item using SDK
      const response = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
        quantity,
      })

      return response.cart
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
    onError: (error) => {
      console.error("Failed to update cart item:", error)
    },
  })
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lineItemId }: { lineItemId: string }) => {
      const cartId = getCartId()
      if (!cartId) throw new Error("No cart found")

      // Delete line item using SDK
      const response = await sdk.store.cart.deleteLineItem(cartId, lineItemId)
      return response.cart
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
    onError: (error) => {
      console.error("Failed to remove item from cart:", error)
    },
  })
}

/**
 * Hook to clear entire cart
 * CRITICAL: Use after order is placed
 */
export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const cartId = getCartId()
      if (!cartId) return null

      // Clear cart by removing ID (Medusa will handle cart cleanup)
      clearCartId()
      return null
    },
    onSuccess: () => {
      // Clear cart from cache
      queryClient.setQueryData(CART_QUERY_KEY, null)
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}
