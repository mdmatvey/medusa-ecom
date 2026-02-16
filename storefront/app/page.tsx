import { Hero } from "@/components/sections/hero"
import { ValueProps } from "@/components/sections/value-props"
import { FeaturedCategories } from "@/components/sections/featured-categories"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { Newsletter } from "@/components/sections/newsletter"

/**
 * Homepage for Megobari Tea Shop
 *
 * STRUCTURE (following /reference/layouts/home-page.md):
 * 1. Hero Section - "Discover Premium European Teas" + CTA
 * 2. Value Propositions - Trust signals
 * 3. Featured Categories - Tea types grid
 * 4. Featured/Bestseller Products - Product showcase
 * 5. Newsletter Signup - "Stay Steeped" with 10% off
 *
 * All data fetched dynamically from Medusa backend
 */

export default function HomePage() {
  return (
    <>
      {/* Hero Banner */}
      <Hero />

      {/* Trust Signals */}
      <ValueProps />

      {/* Tea Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-charcoal mb-6">
                Our Commitment to Quality
              </h2>
              <p className="text-lg text-charcoal/70 mb-4">
                At Megobari, we believe that every cup of tea tells a story. That's why we
                partner directly with premium European tea gardens, ensuring that each leaf is
                handpicked at peak freshness and processed with centuries-old techniques.
              </p>
              <p className="text-lg text-charcoal/70 mb-6">
                Our commitment extends beyond quality to sustainability. We work exclusively
                with certified organic and fair-trade estates, supporting local communities
                while preserving the natural beauty of Europe's tea-growing regions.
              </p>
              <a
                href="/about"
                className="inline-flex items-center text-base font-medium text-sage hover:text-accent transition-colors"
              >
                Learn more about our journey
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
              </a>
            </div>

            {/* Image/Illustration Placeholder */}
            <div className="aspect-square rounded-lg bg-gradient-to-br from-sage/20 to-mint/30 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="w-64 h-64 text-sage/40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  )
}
