"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useProduct, formatPrice, useRelatedProducts } from "@/lib/hooks/use-products"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { ProductCard } from "@/components/ui/product-card"

/**
 * Product details page (dynamic route)
 *
 * CRITICAL PATTERNS:
 * - Fetch with sdk.store.product.retrieve(handle) - use SDK method
 * - Use dynamic route [handle], NOT static files
 * - Stay on page after adding to cart (show confirmation)
 *
 * FEATURES:
 * - Image gallery (main + thumbnails)
 * - Variant selector (size: 50g, 100g, 250g)
 * - Quantity selector
 * - "Add to Cart" button (disabled until variant selected)
 * - Product description, origin, brewing instructions
 * - Related products section
 */

export default function ProductDetailsPage() {
  const params = useParams()
  const handle = params.handle as string

  const { data: product, isLoading } = useProduct(handle)
  const addToCart = useAddToCart()

  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Get related products
  const { data: relatedProducts } = useRelatedProducts(
    product?.id || "",
    product?.collection?.id
  )

  // Auto-select first variant when product loads
  if (product && !selectedVariantId && product.variants && product.variants.length > 0) {
    setSelectedVariantId(product.variants[0].id)
  }

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId)
  const price = selectedVariant?.calculated_price?.calculated_amount
  const currencyCode =
    selectedVariant?.calculated_price?.currency_code?.toUpperCase() || "EUR"

  // Get all images (thumbnail + additional images)
  const allImages = product?.images || []
  const displayImages =
    allImages.length > 0 ? allImages : product?.thumbnail ? [{ url: product.thumbnail }] : []

  const handleAddToCart = async () => {
    if (!selectedVariantId) return

    setIsAdding(true)
    setShowSuccess(false)

    try {
      await addToCart.mutateAsync({
        variantId: selectedVariantId,
        quantity,
      })
      setShowSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-sage border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Product not found</h1>
          <a
            href="/products"
            className="inline-flex items-center text-sage hover:text-accent transition-colors"
          >
            Browse all products
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-charcoal/60">
            <li>
              <a href="/" className="hover:text-sage transition-colors">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/products" className="hover:text-sage transition-colors">
                Products
              </a>
            </li>
            <li>/</li>
            <li className="text-charcoal font-medium">{product.title}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-white mb-4">
              {displayImages.length > 0 && displayImages[selectedImageIndex] ? (
                <Image
                  src={displayImages[selectedImageIndex].url || ""}
                  alt={product.title || "Product image"}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-32 h-32 text-charcoal/20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-sage"
                        : "border-transparent hover:border-gray-light"
                    }`}
                  >
                    <Image
                      src={image.url || ""}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-charcoal mb-4">
              {product.title}
            </h1>

            {product.subtitle && (
              <p className="text-lg text-charcoal/70 mb-6">{product.subtitle}</p>
            )}

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-charcoal">
                {price !== null && price !== undefined
                  ? formatPrice(price, currencyCode)
                  : "Price unavailable"}
              </p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariantId === variant.id
                          ? "border-sage bg-sage/10 text-charcoal font-medium"
                          : "border-gray-light hover:border-sage/50"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-light hover:border-sage transition-colors flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-10 text-center border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
                  min="1"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-light hover:border-sage transition-colors flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v14m7-7H5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariantId || isAdding}
              className="w-full px-8 py-4 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>

            {/* Success Message */}
            {showSuccess && (
              <div className="p-4 bg-sage/10 border border-sage/20 rounded-lg text-sage text-center mb-4">
                Added to cart successfully!
              </div>
            )}

            {/* Product Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t border-gray-light">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Description</h2>
                <p className="text-charcoal/70 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-light">
            <h2 className="text-2xl font-display font-bold text-charcoal mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
