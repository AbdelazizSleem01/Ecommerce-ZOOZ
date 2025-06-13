'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('');

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
        
        if (!data?.results) {
          throw new Error('Invalid response structure');
        }
        
        // Extract unique brands from results
        const allBrands = data.results
          .map(product => product.brand)
          .filter((brand, index, self) =>
            brand && self.findIndex(t => t?._id === brand?._id) === index
          );
        
        setResults(data.results);
        setBrands(allBrands);
        setError('');
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.response?.data?.error || error.message);
        setResults([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart/count');
        const data = await res.json();
        setCartItemsCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  // Handle Add to Cart
  const handleAddToCart = async (productId) => {
    try {
      setCartItemsCount(prev => prev + 1);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: 'M',
          color: 'Black',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const countResponse = await fetch('/api/cart/count');
      const countData = await countResponse.json();
      setCartItemsCount(countData.count || 0);

      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartItemsCount(prev => prev - 1);
      toast.error(error.message || 'Failed to add product to cart');
    }
  };

  // Filter results based on active brand
  const filteredResults = activeFilter 
    ? results.filter(product => product.brand?._id === activeFilter)
    : results;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2 text-gray-600">Loading search results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="alert alert-error max-w-md mx-auto">
          <span>Error: {error}</span>
        </div>
        <Link href="/" className="btn btn-primary mt-4">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Search Results for "{query}"
      </h1>

  

      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">No products found matching your search.</p>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredResults.map((product) => (
            <div
              key={product._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <figure className="relative h-48">
                <Image
                  src={product.images?.[0] || '/default-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-contain bg-gray-50"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </figure>
              <div className="card-body">
                <div className='flex items-center justify-between gap-2'>
                  <h2 className="card-title truncate">{product.name}</h2>
                  {product.brand?.name && (
                    <p className="badge badge-primary truncate">
                      {product.brand.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    ${product.price?.toFixed(2) || '0.00'}
                  </p>
                  {product.category?.name && (
                    <p className="badge badge-secondary truncate">
                      {product.category.name}
                    </p>
                  )}
                </div>
                <div className="card-actions mt-4">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="btn btn-primary w-full"
                    disabled={product.countInStock <= 0}
                  >
                    {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <Link 
                    href={`/product/${product._id}`} 
                    className="btn btn-outline w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}