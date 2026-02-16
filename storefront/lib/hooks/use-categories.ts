"use client"

import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

/**
 * Categories hook using Medusa SDK and React Query
 *
 * CRITICAL: NEVER hardcode categories - ALWAYS fetch from Medusa backend
 *
 * Fetches product categories and provides hierarchical structure for:
 * - Navigation megamenu
 * - Product filters
 * - Category pages
 */

// Categories query key for React Query cache
const CATEGORIES_QUERY_KEY = ["categories"]

/**
 * Fetch all categories from Medusa
 * Returns flat list of categories (SDK handles hierarchy)
 */
async function fetchCategories(): Promise<HttpTypes.StoreProductCategory[]> {
  try {
    const response = await sdk.store.product.category.list({
      fields: "id,name,handle,parent_category_id,rank",
      limit: 100, // Fetch all categories (adjust if you have more)
    })

    return response.product_categories || []
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

/**
 * Build hierarchical category tree from flat list
 * Groups child categories under their parents
 */
function buildCategoryTree(
  categories: HttpTypes.StoreProductCategory[]
): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>()
  const rootCategories: CategoryNode[] = []

  // First pass: Create nodes for all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    })
  })

  // Second pass: Build tree structure
  categories.forEach((category) => {
    const node = categoryMap.get(category.id)!

    if (category.parent_category_id) {
      // Add to parent's children
      const parent = categoryMap.get(category.parent_category_id)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      // Root category (no parent)
      rootCategories.push(node)
    }
  })

  // Sort by rank (if available) or name
  const sortCategories = (cats: CategoryNode[]) => {
    cats.sort((a, b) => {
      if (a.rank !== undefined && b.rank !== undefined) {
        return a.rank - b.rank
      }
      return (a.name || "").localeCompare(b.name || "")
    })
    cats.forEach((cat) => {
      if (cat.children.length > 0) {
        sortCategories(cat.children)
      }
    })
  }

  sortCategories(rootCategories)

  return rootCategories
}

// Category node with children for tree structure
export interface CategoryNode extends HttpTypes.StoreProductCategory {
  children: CategoryNode[]
}

/**
 * Hook to fetch categories (flat list)
 */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // Categories don't change often, cache for 5 minutes
  })
}

/**
 * Hook to fetch categories as hierarchical tree
 * Useful for navigation menus and nested category displays
 */
export function useCategoryTree() {
  const { data: categories, ...rest } = useCategories()

  const categoryTree = categories ? buildCategoryTree(categories) : []

  return {
    ...rest,
    categoryTree,
    categories, // Also expose flat list
  }
}

/**
 * Hook to fetch a single category by handle
 */
export function useCategory(handle: string) {
  return useQuery({
    queryKey: ["category", handle],
    queryFn: async () => {
      try {
        const response = await sdk.store.product.category.list({
          fields: "id,name,handle,description,parent_category_id",
          handle,
        })

        return response.product_categories?.[0] || null
      } catch (error) {
        console.error(`Failed to fetch category ${handle}:`, error)
        return null
      }
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  })
}
