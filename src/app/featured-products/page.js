"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ShoppingCart } from 'lucide-react';

async function getFeaturedProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        return await res.json();
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        return await res.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export default function FeaturedProductsPage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [animatingProductId, setAnimatingProductId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const products = await getFeaturedProducts();
            const categories = await getCategories();
            setFeaturedProducts(products);
            setCategories(categories);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const res = await fetch('/api/cart/count');
                const data = await res.json();
                setCartItemsCount(data.count);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };
        fetchCartCount();
    }, []);

    const handleAddToCart = async (productId) => {
        try {
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

            if (!response.ok) throw new Error('Failed to add product to cart');

            toast.success('Product added to cart!');
            setCartItemsCount(prev => prev + 1);
            setAnimatingProductId(productId);
            setTimeout(() => setAnimatingProductId(null), 500);

        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add product to cart');
        }
    };

    return (
        <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-700">Featured Collection</h2>
                <p className="text-lg text-neutral-500">Discover our curated selection of premium products</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
                            <div className="skeleton h-64 w-full"></div>
                            <div className="card-body">
                                <div className="skeleton h-6 w-3/4 mb-2"></div>
                                <div className="skeleton h-4 w-1/2"></div>
                                <div className="skeleton h-10 w-full mt-4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : featuredProducts.length === 0 ? (
                <div className="alert alert-info max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>No featured products available</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map((product) => (
                        <div key={product._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <figure className=" pt-4 relative">
                                <Link href={`/product/${product._id}`}>
                                    <div className="relative h-64 w-full rounded-xl px-6 bg-gray-50">
                                        {product.images?.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={200}
                                                height={200}
                                                className="object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="bg-neutral-focus text-neutral-content h-full w-full flex items-center justify-center rounded-xl">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                {product.category?.name && (
                                    <div className="badge badge-primary absolute top-3 right-3">
                                        {product.category.name}
                                    </div>
                                )}
                            </figure>

                            <div className="card-body">
                                <h3 className="card-title">
                                    <Link href={`/product/${product._id}`} className="hover:text-primary transition-colors">
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>


                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleAddToCart(product._id)}
                                        className="btn btn-primary btn-block"
                                    >
                                        <ShoppingCart size={20}/>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}