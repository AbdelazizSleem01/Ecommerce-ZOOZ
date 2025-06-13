"use client";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRightIcon, BadgeCheck, BadgeCheckIcon, TriangleAlert } from 'lucide-react';

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/brands'),
          fetch('/api/category')
        ]);

        if (!productsRes.ok || !brandsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [productsData, brandsData, categoriesData] = await Promise.all([
          productsRes.json(),
          brandsRes.json(),
          categoriesRes.json()
        ]);

        setProducts(productsData);
        setBrands(brandsData);
        setCategories(categoriesData);

        const brandParam = searchParams.get('brand');
        const categoryParam = searchParams.get('category');
        if (brandParam) setSelectedBrand(brandParam);
        if (categoryParam) setSelectedCategory(categoryParam);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBrandFilter = (brandId) => {
    setSelectedBrand(prev => prev === brandId ? null : brandId);
    updateURLParams({ brand: brandId });
  };

  const handleCategoryFilter = (categorySlug) => {
    setSelectedCategory(prev => prev === categorySlug ? null : categorySlug);
    updateURLParams({ category: categorySlug });
  };

  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    window.history.pushState({}, '', `${window.location.pathname}?${newParams}`);
  };

  const filteredProducts = products.filter(product => {
    const brandMatch = !selectedBrand || product.brand?._id === selectedBrand;
    const categoryMatch = !selectedCategory || product.category?.slug === selectedCategory;
    return brandMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen backdrop-blur-sm">
        <div className="text-center space-y-4">
          <span className="loading loading-infinity loading-lg text-primary"></span>
          <p className="text-lg font-medium text-gray-800">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-base-content">
          All Products
        </h1>

        {/* Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Brand Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleBrandFilter(null)}
              className={`btn btn-sm ${!selectedBrand ? 'btn-primary' : 'btn bg-gray-800'}`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => handleBrandFilter(brand._id)}
                className={`btn btn-sm ${selectedBrand === brand._id ? 'btn-primary' : 'btn bg-gray-800'}`}
              >
                {brand.name}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn bg-gray-800'}`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryFilter(category.slug)}
                className={`btn btn-sm ${selectedCategory === category.slug ? 'btn-primary' : 'btn bg-gray-800'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="card bg-base-100 shadow-sm shadow-white hover:shadow-md transition-shadow duration-300 group"
            >
              {/* Category Link */}
              <div className="absolute left-4 top-4 z-10">
                <Link 
                  href={`?category=${product.category?.slug}`}
                  className="badge badge-primary badge-lg hover:badge-secondary"
                >
                  {product.category?.name || 'Uncategorized'}
                </Link>
              </div>

              {/* Product Image */}
              <figure className="px-6 pt-6 relative h-64 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="rounded-xl object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 bg-base-200"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-base-200 rounded-xl">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </figure>

              <div className="card-body p-6">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-base-content truncate">
                    {product.name}
                  </h2>
                  {product.isFeatured && (
                    <div className="badge badge-accent gap-2">
                      <BadgeCheck size={19} />
                      Featured
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <Link 
                    href={`?brand=${product.brand?._id}`}
                    className="badge badge-outline badge-lg hover:badge-primary"
                  >
                    {product.brand?.name || 'Generic'}
                  </Link>
                </div>

                <div className="card-actions mt-6">
                  <Link
                    href={`/product/${product._id}`}
                    className="btn btn-primary w-full hover:btn-secondary transition-colors"
                  >
                    View Details
                    <ArrowRightIcon size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="alert alert-warning max-w-md mx-auto">
              <TriangleAlert />
              <span>
                No products found
                {selectedBrand && ' for this brand'}
                {selectedCategory && ' in this category'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}