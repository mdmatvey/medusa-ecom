"use client"

import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

async function fetchRegions(): Promise<HttpTypes.StoreRegion[]> {
  try {
    const response = await sdk.store.region.list()
    return response.regions || []
  } catch (error) {
    console.error("Failed to fetch regions:", error)
    return []
  }
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 10 * 60 * 1000,
  })
}

export function useDefaultRegion() {
  const { data: regions, ...rest } = useRegions()
  return {
    ...rest,
    region: regions?.[0] ?? null,
  }
}
