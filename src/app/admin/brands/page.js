// app/brands/page.js
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this brand!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    // If the user confirms, delete the brand
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/brands/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete brand');
        }

        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'The brand has been deleted.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });

        // Refresh the list of brands
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);

        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the brand.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  if (loading) return (
    <div className="text-center flex justify-center items-center mt-44">
      <span className="loading loading-spinner text-primary"></span>
      <p className='text-gray-800 mx-4'>Brands Loading...</p>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>
      <Link href="/admin/create-brands" className="btn-primary btn text-white px-4 py-2 rounded mb-4 inline-block">
        Add New Brand
      </Link>
      <div className="overflow-x-auto">
        <table className="table w-full bg-base-100 shadow-md rounded-lg">
          {/* Table Header */}
          <thead>
            <tr className="bg-base-200 rounded-lg">
              <th className="py-3 px-4 text-left">Logo</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="border-b hover:bg-base-200 transition-colors">
                {/* Brand Logo */}
                <td className="py-3 px-4">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} Logo`}
                    className="w-20 h-16 object-contain p-1 rounded-full bg-gray-50 "
                  />
                </td>
                {/* Brand Name */}
                <td className="py-3 px-4 font-semibold">{brand.name}</td>
                {/* Brand Description */}
                <td className="py-3 px-4 text-gray-600">{brand.description}</td>
                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/create-brands/${brand._id}`}
                      className="btn-warning btn text-white px-4 py-2 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="btn-error btn text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}