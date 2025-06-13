'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function NewBrandPage() {
  const [brand, setBrand] = useState({ name: '', description: '', logo: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('name', brand.name);
      formData.append('description', brand.description);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Save the brand to the database
      const response = await fetch('/api/brands', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create brand');
      }

      const data = await response.json();
      toast.success('Brand created successfully');
      router.push('/brands');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-8 ">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Add New Brand</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className='bg-base-100 p-6  rounded-2xl w-[80%] mx-auto'>
        <div className="mb-4 ">
          <label className="label  block mb-2">Name</label>
          <input
            type="text"
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            className="border p-2 w-full input input-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="label block mb-2">Description</label>
          <textarea
            value={brand.description}
            onChange={(e) => setBrand({ ...brand, description: e.target.value })}
            className="border p-2 w-full textarea input-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="label block mb-2">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full input input-primary"
            required
          />
        </div>

        {/* image preview */}
        {logoFile && (
          <img
            src={URL.createObjectURL(logoFile)}
            alt="Logo"
            className="w-20 h-20 object-contain bg-gray-100 rounded-md my-4 p-1 border border-primary"
          />
        )}
        <button
          type="submit"
          className="bg-primary btn text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Add Brand'}
        </button>
      </form>
    </div>
  );
}