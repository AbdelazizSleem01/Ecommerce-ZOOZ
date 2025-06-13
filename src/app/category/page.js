"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Explore Collections
          </h1>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Discover our curated selection of premium products organized by category
          </p>
          <div className="divider w-24 mx-auto mt-6 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="skeleton h-60 w-full rounded-t-2xl"></div>
                <div className="card-body">
                  <div className="skeleton h-6 w-3/4 mb-3"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/product?category=${category.slug}`}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 group"
              >
                <figure className="relative h-24 w-full overflow-hidden rounded-t-2xl">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="bg-neutral-focus text-neutral-content  w-full flex items-center justify-center">
                      <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-base-content/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </figure>
                <div className="card-body items-center text-center p-6">
                  <h2 className="card-title text-xl md:text-2xl mb-2 transition-all duration-300 group-hover:text-primary">
                    {category.name}
                  </h2>
                  <button className="btn btn-sm btn-ghost -mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    View Collection
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="alert alert-info shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>No categories found. Please check back later.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}