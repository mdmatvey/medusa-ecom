"use client"

import Link from "next/link"

/**
 * Hero section for homepage
 *
 * FEATURES:
 * - Pastel tea imagery background
 * - "Discover Premium European Teas" headline
 * - CTA button
 * - Smooth animations
 * - Responsive design
 */

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-mint to-cream overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-sage"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
              />
            </svg>
            <span className="text-sm font-medium text-charcoal">Premium Quality</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-charcoal mb-6 leading-tight">
            Discover Premium
            <span className="block text-sage">European Teas</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-charcoal/70 mb-8 max-w-2xl">
            Experience the finest handpicked teas from Europe's most celebrated gardens.
            Ethically sourced, expertly crafted, delivered fresh to your door.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Shop All Teas
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

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-charcoal bg-white hover:bg-white/80 rounded-lg transition-colors border border-gray-light"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Decorative tea cup illustration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 lg:opacity-20 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.5}
            stroke="currentColor"
            className="w-96 h-96 lg:w-[600px] lg:h-[600px] text-sage"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
