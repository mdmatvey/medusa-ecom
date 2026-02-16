"use client"

import { useState } from "react"

/**
 * Newsletter signup section
 *
 * FEATURES:
 * - "Stay Steeped" headline
 * - Email input form
 * - 10% off incentive
 * - Form validation
 * - Success/error states
 */

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")

    // TODO: Integrate with your newsletter service (Mailchimp, ConvertKit, etc.)
    // For now, just simulate success
    setTimeout(() => {
      setStatus("success")
      setMessage("Thank you for subscribing! Check your email for your 10% discount code.")
      setEmail("")
    }, 1000)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-sage/20 to-mint/30">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-sage"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-charcoal mb-4">
            Stay Steeped in the Know
          </h2>
          <p className="text-lg text-charcoal/70 mb-8">
            Join our tea community and get 10% off your first order. Plus exclusive offers,
            brewing tips, and new product alerts.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus("idle")
                setMessage("")
              }}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-light focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              disabled={status === "loading"}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : status === "success" ? (
                "Subscribed!"
              ) : (
                "Get 10% Off"
              )}
            </button>
          </form>

          {/* Status message */}
          {message && (
            <div
              className={`mt-4 text-sm ${
                status === "error" ? "text-red-600" : "text-sage"
              }`}
              role="alert"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          {/* Privacy notice */}
          <p className="mt-4 text-xs text-charcoal/60">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
