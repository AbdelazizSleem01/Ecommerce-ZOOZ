'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color');
      return;
    }

    try {
      const response = await axios.post('/api/cart', {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      if (response.status === 200) {
        toast.success('Product added to cart!');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8 text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            loop={true}
            className="rounded-2xl overflow-hidden shadow-lg  "
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="aspect-square  flex items-center justify-center w-full h-[80%]">
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="object-contain w-full h-[90%] transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Arrows */}
            <div className="swiper-button-next !text-primary !bg-white/90 !h-12 !w-12 rounded-full shadow-lg !transition-all hover:!bg-white hover:!scale-105" />
            <div className="swiper-button-prev !text-primary !bg-white/90 !h-12 !w-12 rounded-full shadow-lg !transition-all hover:!bg-white hover:!scale-105" />
          </Swiper>
        </div>

        {/* Product Details */}
        <div className="px-12 bg-base-100 py-6 rounded-lg">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Select Size</h3>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-medium rounded-lg transition-all ${selectedSize === size
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Select Color</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-gray-300' : 'border-transparent'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 btn btn-primary rounded-lg transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className="w-20 text-center text-lg font-medium border-0 focus:ring-0"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 btn btn-primary rounded-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full mx-auto flex justify-center btn py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-[1.01] shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}