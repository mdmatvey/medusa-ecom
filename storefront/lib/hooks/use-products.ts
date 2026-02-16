"use client"

import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

/**
 * Products hook using Medusa SDK and React Query
 *
 * CRITICAL PATTERNS:
 * - Prices from Medusa are as-is (49.99 NOT in cents)
 * - Always pass region_id for correct pricing
 * - Use SDK methods, never custom fetch()
 */

// Products query key for React Query cache
const PRODUCTS_QUERY_KEY = ["products"]

/**
 * Product list filters and sorting
 */
export interface ProductListParams {
  limit?: number
  offset?: number
  category_id?: string[]
  collection_id?: string[]
  tags?: string[]
  price_list_id?: string
  region_id?: string
  order?: string
  q?: string // Search query
}

/**
 * Fetch products from Medusa with filters
 */
async function fetchProducts(
  params: ProductListParams = {}
): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
}> {
  try {
    const response = await sdk.store.product.list({
      fields:
        "id,title,handle,description,thumbnail,images,variants,variants.calculated_price,options,collection_id,tags",
      limit: params.limit || 12,
      offset: params.offset || 0,
      category_id: params.category_id,
      collection_id: params.collection_id,
      tag_id: params.tags,
      region_id: params.region_id,
      order: params.order,
      q: params.q,
    })

    return {
      products: response.products || [],
      count: response.count || 0,
    }
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return {
      products: [],
      count: 0,
    }
  }
}

/**
 * Hook to fetch products list with filters
 */
export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => fetchProducts(params),
    staleTime: 60 * 1000, // Cache for 1 minute
  })
}

/**
 * Hook to fetch a single product by handle
 */
export function useProduct(handle: string, region_id?: string) {
  return useQuery({
    queryKey: ["product", handle, region_id],
    queryFn: async () => {
      if (!handle) return null

      try {
        // Use SDK retrieve method for single product
        const response = await sdk.store.product.retrieve(handle, {
          fields:
            "id,title,handle,description,subtitle,thumbnail,images,variants,variants.calculated_price,variants.options,options,collection,tags,material,weight",
          region_id,
        })

        return response.product
      } catch (error) {
        console.error(`Failed to fetch product ${handle}:`, error)
        return null
      }
    },
    enabled: !!handle,
    staleTime: 60 * 1000,
  })
}

/**
 * Hook to fetch featured/bestseller products
 * For homepage showcase
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["featured-products", limit],
    queryFn: async () => {
      try {
        // Fetch products - can be filtered by collection or tags in production
        // For now, just get latest products
        const response = await sdk.store.product.list({
          fields:
            "id,title,handle,description,thumbnail,variants,variants.calculated_price",
          limit,
          order: "-created_at", // Newest first
        })

        return response.products || []
      } catch (error) {
        console.error("Failed to fetch featured products:", error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (featured products change less often)
  })
}

/**
 * Hook to fetch related products
 * Based on collection or category
 */
export function useRelatedProducts(productId: string, collectionId?: string, limit: number = 4) {
  return useQuery({
    queryKey: ["related-products", productId, collectionId, limit],
    queryFn: async () => {
      try {
        const params: Record<string, any> = {
          fields: "id,title,handle,thumbnail,variants,variants.calculated_price",
          limit: limit + 1, // Fetch one extra to exclude current product
        }

        // Filter by collection if available
        if (collectionId) {
          params.collection_id = [collectionId]
        }

        const response = await sdk.store.product.list(params)

        // Exclude current product
        const related = (response.products || []).filter(
          (product) => product.id !== productId
        )

        return related.slice(0, limit)
      } catch (error) {
        console.error("Failed to fetch related products:", error)
        return []
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Helper to format price from Medusa
 * Prices are stored as-is (49.99, NOT in cents)
 */
export function formatPrice(
  amount: number,
  currencyCode: string = "EUR"
): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: currencyCode,
  }).format(amount)
}

/**
 * Get cheapest variant price from product
 * Useful for product cards showing "from" price
 */
export function getCheapestPrice(
  product: HttpTypes.StoreProduct
): number | null {
  if (!product.variants || product.variants.length === 0) return null

  const prices = product.variants
    .map((variant) => variant.calculated_price?.calculated_amount)
    .filter((price): price is number => typeof price === "number")

  if (prices.length === 0) return null

  return Math.min(...prices)
}
