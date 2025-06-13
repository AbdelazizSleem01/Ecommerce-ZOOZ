"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/admin/orders/${orderId}`);
                if (!response.ok) throw new Error("Failed to fetch order");
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading) return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="skeleton h-8 w-64 mb-8"></div>
            <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-4 w-full"></div>
                ))}
            </div>
        </div>
    );

    if (!order) return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="alert alert-error">
                <TriangleAlert />
                <span>Order not found</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="card-title text-3xl mb-6">Order Details</h1>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title">Order ID</div>
                                <div className="stat-value text-sm font-mono">{order._id}</div>
                            </div>
                        </div>

                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title">Total Price</div>
                                <div className="stat-value text-primary">${order.totalPrice}</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Status and Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-semibold">Order Status</h2>
                            <div className={`badge badge-lg ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                {order.status}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-semibold">Payment Information</h2>
                            <div className="flex items-center gap-2">
                                <div className="badge badge-primary badge-outline">
                                    {order.paymentMethod}
                                </div>
                                <div className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'}`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </div>
                            </div>
                            {order.isPaid && (
                                <div className="text-sm text-gray-500">
                                    Paid at: {new Date(order.paidAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="card bg-base-200 mb-8">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Customer Information</h2>
                            <div className="flex items-center gap-4">
                                {order.user?.profilePicture && (
                                    <div className="avatar">
                                        <div className="w-16 rounded-full">
                                            <img src={order.user.profilePicture} alt={order.user.name} />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold">{order.user?.name}</h3>
                                    <p className="text-gray-600">{order.user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="overflow-x-auto">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Details</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="avatar">
                                                    <div className="w-12 h-12">
                                                        <img src={item.image} alt={item.name} className="rounded" />
                                                    </div>
                                                </div>
                                                <div>{item.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-3">
                                                {item.color && (
                                                    <div
                                                        className="w-4 h-4 rounded-full border mt-1"
                                                        style={{ backgroundColor: item.color }}
                                                    ></div>
                                                )}
                                                {item.size && <span className="badge badge-outline">{item.size}</span>}
                                            </div>
                                        </td>
                                        <td>${item.price}</td>
                                        <td>{item.qty}</td>
                                        <td className="font-semibold">${item.price * item.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;