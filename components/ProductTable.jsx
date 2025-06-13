'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { BadgeCheck, BadgeX } from 'lucide-react';

export default function ProductTable({ products = [], onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const productsPerPage = 10;

  // Ensure products have valid images arrays
  const validatedProducts = products.map(product => ({
    ...product,
    images: product.images || [],
  }));

  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'object') return category.name;
    if (typeof category === 'string') return 'Loading...';
    return 'Invalid Category';
  };



  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...validatedProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Delete failed');

        toast.success('Product deleted successfully');
        onDelete(productId);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="mt-8">
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase"
              >
                Images
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase cursor-pointer"
                onClick={() => handleSort('brand')}
              >
                Brand {sortConfig.key === 'brand' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase cursor-pointer"
                onClick={() => handleSort('price')}
              >
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase cursor-pointer"
                onClick={() => handleSort('countInStock')}
              >
                Stock {sortConfig.key === 'countInStock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase"
              >
                Sizes
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase"
              >
                Colors
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase"
              >
                Featured
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase"
              >
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/product/${product._id}`} className="text-blue-600 hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {(product.images || []).map((image, index) => (
                      <div key={index} className="w-10 h-10 relative">
                        <Image
                          src={image}
                          alt={`Product Image ${index + 1}`}
                          fill
                          className="rounded object-cover"
                          sizes="(max-width: 40px) 40px, 40px"
                        />
                      </div>
                    ))}
                  </div>

                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {getCategoryName(product.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {product.brand?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.countInStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {Array.isArray(product.colors) ? product.colors.join(', ') : product.colors}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {product.isFeatured ?
                    (
                      <div className="badge badge-accent gap-2">
                        <BadgeCheck size={19} />
                        Featured
                      </div>
                    )
                    :
                    (
                      <div className="badge badge-gray gap-2">
                        <BadgeX size={19} />
                        Not Featured
                      </div>
                    )
                  }
                </td>
                <td className="px-6 py-4 truncate max-w-xs text-gray-700">
                  {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="btn  btn-outline text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-outline text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="btn px-4 py-2 border rounded bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:text-white"
        >
          Previous
        </button>
        <span className="text-sm text-white">
          Page {currentPage} of {Math.ceil(sortedProducts.length / productsPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(sortedProducts.length / productsPerPage)))}
          disabled={currentPage === Math.ceil(sortedProducts.length / productsPerPage)}
          className=" btn px-4 py-2 border rounded bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}