'use client';
import Link from 'next/link';
import NewsletterSection from './subscribe/page';
import FeedbackForm from './feedback/page';
import WhatPeopleSayPage from './what-people-say/page';
import BrandsPage from './brands/page';
import CategoryProductsPage from './category/page';
import FeaturedProductsPage from './featured-products/page';
import Image from 'next/image';
import OurTeam from './ourTeam/page';

// Fetch featured products


export default function HomePage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700">
        <div className="hero-overlay bg-opacity-50"></div>
        <div className="container mx-auto px-4">
          <div className="hero-content flex-col lg:flex-row-reverse gap-12">
            {/* Decorative Elements */}
            <div className="relative lg:w-1/2">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-400 rounded-full mix-blend-screen opacity-20 animate-float"></div>
              <div className="absolute -bottom-12 -left-8 w-48 h-48 bg-blue-400 rounded-full mix-blend-screen opacity-20 animate-float delay-1000"></div>
              <div className="relative aspect-square bg-base-100/10 rounded-3xl shadow-2xl backdrop-blur-lg">
                <div className="absolute inset-0 border-2 border-white/10 rounded-3xl m-4">
                  <Image className='object-cover p-5 rounded-4xl' src={'/images/banner.jpg'} alt='banner of hero section' fill />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="badge badge-outline badge-lg text-white/80 mb-4 animate-fade-in">
                New Collection 2025
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-purple-500 text-transparent bg-clip-text">
                  ZOOZ
                </span>
                <br />
                <span className="text-3xl md:text-4xl font-semibold mt-2">
                  Next-Gen Shopping Experience
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl">
                Discover curated collections of innovative products with exclusive member benefits and
                seamless shopping experiences.
              </p>
              <Link
                href="/product"
                className="btn btn-primary btn-lg rounded-full px-12 gap-2 transform transition-all hover:scale-105"
              >
                Explore Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProductsPage />

      {/* Categories Grid */}
      <CategoryProductsPage />

      {/* USP Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-base-100 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">Fast Shipping</h3>
            <p className="text-gray-400">Worldwide delivery in 5-7 days</p>
          </div>
          <div className="p-6 bg-base-100 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">Secure Payments</h3>
            <p className="text-gray-400">256-bit SSL encryption</p>
          </div>
          <div className="p-6 bg-base-100 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">Premium Quality</h3>
            <p className="text-gray-400">Authentic products guarantee</p>
          </div>
        </div>
      </section>

      {/* what people say */}
      <WhatPeopleSayPage />

      {/* Blog Section */}


      {/* Feedback Section */}
      <FeedbackForm />

      {/* ourTeam Section */}
      <OurTeam />

      {/* subscribe */}
      <NewsletterSection />

      {/* Featured Brands Section */}
      <BrandsPage />

      {/* CTA Section */}
      <section className=" py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-700  mb-6">Don't Miss Out!</h2>
          <p className="text-xl text-gray-500  mb-8">
            Explore our exclusive collections and enjoy limited-time offers.
          </p>
          <Link
            href="/product"
            className="btn btn-lg btn-primary"
          >
            Shop Now
          </Link>
        </div>
      </section>


    </div>
  );
}