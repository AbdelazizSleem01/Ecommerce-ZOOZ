'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus } from 'lucide-react';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data = await response.json();
        setBrands(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (error) {
    return (
      <div className="   flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className=" bg-base-100 p-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-gray-50 text-center" >All Brands</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <span className='loading loading-spinner text-primary'></span>
            <p className='text-gray-50 mx-4'>Brands Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/product?brand=${brand._id}`}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-4 relative">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {brand.name}
                  </h2>
                  <p className="text-gray-600 text-center line-clamp-3">
                    {brand.description}
                  </p>
                </div>
                <ChevronRight className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}