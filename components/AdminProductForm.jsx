"use client";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

export default function AdminProductForm({ product, onSuccess }) {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!product);
  const [images, setImages] = useState(product?.images || []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: product || {
      name: '',
      slug: '',
      category: '',
      images: [],
      price: 0,
      brand: '',
      description: '',
      sizes: [],
      colors: [],
      countInStock: 0,
      isFeatured: false,
      banner: '',
    },
  });

  useEffect(() => {
    if (product) {
      setIsLoading(false);
      Object.entries(product).forEach(([key, value]) => {
        setValue(key, value);
      });
      setImages(product.images);
    }
  }, [product, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/category');
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

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
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('category', data.category);
      formData.append('price', data.price);
      formData.append('brand', data.brand);
      formData.append('description', data.description);
      formData.append('sizes', data.sizes);
      formData.append('colors', data.colors);
      formData.append('countInStock', data.countInStock);
      formData.append('isFeatured', data.isFeatured);
      formData.append('banner', data.banner);

      const files = document.querySelector('input[type="file"]').files;

      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to save product try to change slug');

      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
      onSuccess();
      if (!product) reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8 bg-base-100 text-base-content p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Name</span>
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="input input-primary w-full"
          />
          {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
        </div>

        {/* Slug */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Slug</span>
          </label>
          <input
            {...register('slug', {
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'Slug must be lowercase letters, numbers, and hyphens',
              },
            })}
            className="input input-primary w-full"
          />
          {errors.slug && <span className="text-error text-sm">{errors.slug.message}</span>}
        </div>

        {/* Category Dropdown */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Category</span>
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="text-error text-sm">{errors.category.message}</span>}
        </div>

        {/* Brand Dropdown */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Brand</span>
          </label>
          <select
            {...register('brand', { required: 'Brand is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>

          {errors.brand && <span className="text-error text-sm">{errors.brand.message}</span>}
        </div>

        {/* Stock */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Stock Quantity</span>
          </label>
          <input
            type="number"
            {...register('countInStock', {
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock cannot be negative' },
            })}
            className="input input-primary w-full"
          />
          {errors.countInStock && (
            <span className="text-error text-sm">{errors.countInStock.message}</span>
          )}
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Price</span>
          </label>
          <input
            type="number"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
            })}
            className="input input-primary w-full"
          />
          {errors.price && <span className="text-error text-sm">{errors.price.message}</span>}
        </div>

        {/* Sizes */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Sizes (comma separated)</span>
          </label>
          <input
            {...register('sizes')}
            className="input input-primary w-full"
          />
        </div>

        {/* Colors */}
        <div className="form-control">
          <label className="label">
            <span className="label-text my-2">Colors (comma separated)</span>
          </label>
          <input
            {...register('colors')}
            className="input input-primary w-full"
          />
        </div>

        {/* Image Upload */}
        <div className="form-control col-span-full">
          <label className="label">
            <span className="label-text my-2">Images</span>
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="file-input file-input-primary w-full"
          />
        </div>

        {/* Image Preview */}

        <div className="w-[65%] max-w-xl ">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation  
            pagination={{ clickable: true }}
            loop
            className="rounded-lg"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={typeof image === 'string' ? `Image ${index}` : image.name}
                  className="w-full h-64 object-contain rounded-lg bg-gray-50"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>



        {/* Description */}
        <div className="form-control col-span-full">
          <label className="label">
            <span className="label-text my-2">Description</span>
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="textarea textarea-primary w-full"
          />
          {errors.description && (
            <span className="text-error text-sm">{errors.description.message}</span>
          )}
        </div>
      </div>

      {/* Featured */}
      <div className="form-control my-4">
        <label className="label cursor-pointer">
          <span className="label-text my-2">Featured Product</span>
          <input
            type="checkbox"
            {...register('isFeatured')}
            className="toggle toggle-primary"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full mt-6"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          product ? 'Update Product' : 'Create Product'
        )}
      </button>
    </form>
  );
}