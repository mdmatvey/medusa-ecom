"use client"

import Link from "next/link"
import Image from "next/image"
import type { HttpTypes } from "@medusajs/types"
import { useCart, useUpdateLineItem, useRemoveFromCart } from "@/lib/hooks/use-cart"
import { formatPrice } from "@/lib/hooks/use-products"

/**
 * Cart page
 *
 * FEATURES:
 * - List cart items with variant details
 * - Quantity adjustment (+ / - buttons with validation)
 * - Remove item button
 * - Subtotal, shipping estimate, tax
 * - "Proceed to Checkout" CTA
 * - Empty cart state
 */

export default function CartPage() {
  const { cart, isLoading } = useCart()
  const updateLineItem = useUpdateLineItem()
  const removeFromCart = useRemoveFromCart()

  const handleQuantityChange = (lineItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateLineItem.mutate({ lineItemId, quantity: newQuantity })
  }

  const handleRemove = (lineItemId: string) => {
    removeFromCart.mutate({ lineItemId })
  }

  // Get currency from cart
  const currencyCode = cart?.currency_code?.toUpperCase() || "EUR"

  // Calculate totals
  const subtotal = cart?.subtotal || 0
  const shipping = cart?.shipping_total || 0
  const tax = cart?.tax_total || 0
  const total = cart?.total || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-sage border-t-transparent rounded-full" />
      </div>
    )
  }

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-24 h-24 text-charcoal/20 mx-auto mb-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <h1 className="text-2xl font-display font-bold text-charcoal mb-4">
              Your cart is empty
            </h1>
            <p className="text-charcoal/70 mb-8">
              Discover our premium tea collection and find your perfect brew.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
            >
              Shop Teas
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-charcoal mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: HttpTypes.StoreCartLineItem) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 border border-gray-light"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title || "Product"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="w-12 h-12 text-charcoal/20"
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

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-charcoal mb-1">
                      {item.title}
                    </h3>
                    {item.variant?.title && item.variant.title !== "Default" && (
                      <p className="text-sm text-charcoal/60 mb-2">{item.variant.title}</p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-4">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={updateLineItem.isPending}
                        className="w-8 h-8 rounded border border-gray-light hover:border-sage transition-colors flex items-center justify-center disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>

                      <span className="text-base font-medium text-charcoal w-12 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updateLineItem.isPending}
                        className="w-8 h-8 rounded border border-gray-light hover:border-sage transition-colors flex items-center justify-center disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 5v14m7-7H5"
                          />
                        </svg>
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removeFromCart.isPending}
                        className="ml-auto text-sm text-charcoal/60 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-charcoal">
                      {formatPrice(item.subtotal || 0, currencyCode)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-charcoal/60">
                        {formatPrice((item.subtotal || 0) / item.quantity, currencyCode)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center text-base text-sage hover:text-accent transition-colors mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-light sticky top-20">
              <h2 className="text-xl font-semibold text-charcoal mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="text-charcoal font-medium">
                    {formatPrice(subtotal, currencyCode)}
                  </span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-charcoal/70">Shipping</span>
                  <span className="text-charcoal font-medium">
                    {shipping > 0 ? formatPrice(shipping, currencyCode) : "Calculated at checkout"}
                  </span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-charcoal/70">Tax</span>
                  <span className="text-charcoal font-medium">
                    {tax > 0 ? formatPrice(tax, currencyCode) : "Calculated at checkout"}
                  </span>
                </div>

                <div className="border-t border-gray-light pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-charcoal">Total</span>
                    <span className="text-charcoal">{formatPrice(total, currencyCode)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full px-6 py-4 text-center text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Trust Signals */}
              <div className="space-y-2 text-sm text-charcoal/60">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-sage"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-sage"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.09-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                  Free shipping over €50
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
