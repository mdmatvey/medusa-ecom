import Medusa from "@medusajs/js-sdk"

/**
 * Medusa SDK instance for API calls
 * Automatically handles authentication headers and publishable API key
 */
export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  // publishableKey will be set after we create one in the Medusa admin
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  apiKey: process.env.NEXT_PUBLIC_MEDUSA_API_KEY || "",
})
