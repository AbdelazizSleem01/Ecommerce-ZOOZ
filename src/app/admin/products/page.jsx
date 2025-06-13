'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminProductForm from '../../../../components/AdminProductForm';
import ProductTable from '../../../../components/ProductTable';

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && !session?.user?.isAdmin)) {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('API did not return an array');

      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      fetchProducts();
    }
  }, [status, session]);

  // Handle delete product
  const handleDelete = async (productId) => {

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Delete failed');

        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8 text-red-600">
          <p>Error loading products: {error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center mx-auto mt-42 p-4">
        <div className="loading loading-spinner text-primary"></div>
        <div className="text-center mx-4 text-gray-600">Loading...</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Manage Products</h1>
        <button
          onClick={() => setSelectedProduct('new')}
          className="btn btn-primary text-white px-4 py-2 rounded transition-colors cursor-pointer"
        >
          Add New Product
        </button>
      </div>

      {selectedProduct && (
        <AdminProductForm
          product={selectedProduct === 'new' ? null : selectedProduct}
          onSuccess={() => {
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No products found. Start by adding a new product.
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(product) => setSelectedProduct(product)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}