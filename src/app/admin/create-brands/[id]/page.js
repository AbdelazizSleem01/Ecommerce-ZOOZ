"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function BrandDetailPage({ params }) {
  const { id } = params;
  const [brand, setBrand] = useState({ name: '', description: '', logo: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch brand');
      }
      const data = await response.json();
      setBrand(data);
    } catch (error) {
      console.error('Error fetching brand:', error);
      toast.error('Failed to fetch brand details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Create FormData to send the file and other fields
      const formData = new FormData();
      formData.append('name', brand.name);
      formData.append('description', brand.description);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Update the brand in the database
      const response = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update brand');
      }

      const data = await response.json();
      toast.success('Brand updated successfully');
      router.push('/brands');
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Brand</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className='bg-base-100 p-6  rounded-2xl w-[80%] mx-auto'>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            className="border p-2 w-full input input-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={brand.description}
            onChange={(e) => setBrand({ ...brand, description: e.target.value })}
            className="border p-2 w-full textarea textarea-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full input input-primary"
          />
          {brand.logo && (
            <img
              src={brand.logo}
              alt="Brand Logo"
              className="mt-2 w-20 h-20 object-cover border border-primary rounded-full p-2"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-primary btn text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}