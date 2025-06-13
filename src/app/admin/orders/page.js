'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';
import { Download, Search, User, Package, DollarSign, MapPin, AlertOctagon } from 'lucide-react';

export default function AdminOrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/admin/orders');
                setOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setError('Failed to fetch orders. Please try again.');
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.isAdmin) fetchOrders();
    }, [session]);

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = orders.filter((order) => {
                const firstName = order.shippingAddress?.firstName?.toLowerCase() || '';
                const lastName = order.shippingAddress?.lastName?.toLowerCase() || '';
                const orderId = order._id?.toLowerCase() || '';
                const phone = order.shippingAddress?.phone?.toLowerCase() || '';

                return (
                    firstName.includes(lowerCaseQuery) ||
                    lastName.includes(lowerCaseQuery) ||
                    orderId.includes(lowerCaseQuery) ||
                    phone.includes(lowerCaseQuery)
                );
            });
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchQuery, orders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`/api/admin/orders/${orderId}`, { status: newStatus });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            setFilteredOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders.xlsx');
    };

    if (!session?.user?.isAdmin) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-lg">Access Denied!</h3>
                            <div className="text-xs">You don't have permission to view this page</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-gray-800">
                            <Package className="animate-bounce " /> Loading Orders...
                        </h1>
                        <progress className="progress progress-primary w-56"></progress>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <AlertOctagon />
                        <div>
                            <h3 className="font-bold text-gray-800">Error loading orders!</h3>
                            <div className="text-xs">{error}</div>
                        </div>
                    </div>
                    <button onClick={() => window.location.reload()} className="btn btn-sm">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                    <Package className="text-primary " /> Order Management
                </h1>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="join flex-1">
                        <span className="join-item btn btn-square">
                            <Search className="text-xl" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-bordered join-item w-full"
                        />
                    </div>
                    <button
                        onClick={exportToExcel}
                        className="btn btn-primary join-item"
                    >
                        <Download className="text-xl" /> Export
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="card bg-base-200">
                    <div className="card-body items-center text-center py-24">
                        <Package className="text-4xl text-gray-400 mb-4" />
                        <h2 className="card-title text-gray-500">No orders found</h2>
                        <p className="text-gray-500">Try adjusting your search query</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <span className="badge badge-primary badge-lg">#{order._id.substring(18)}</span>
                                            <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </h2>
                                    </div>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="select select-bordered select-sm"
                                    >
                                        <option value="processing">Processing</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                                                <User /> Customer Details
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2">
                                                    <span className="font-medium">Name:</span>
                                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-medium">Email:</span>
                                                    {order.shippingAddress?.email}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-medium">Phone:</span>
                                                    {order.shippingAddress?.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                                                <MapPin /> Shipping Details
                                            </h3>
                                            <div className="space-y-2">
                                                <p>{order.shippingAddress?.address}</p>
                                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                                <p>Postal Code: {order.shippingAddress?.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Package /> Order Items
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Variant</th>
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
                                                                    <div className="w-12 h-12 rounded">
                                                                        <img src={item.image} alt={item.name} />
                                                                    </div>
                                                                </div>
                                                                <div>{item.name}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                {item.color && (
                                                                    <div
                                                                        className="w-4 h-4 rounded-full border"
                                                                        style={{ backgroundColor: item.color }}
                                                                    />
                                                                )}
                                                                {item.size && <span className="badge badge-outline">{item.size}</span>}
                                                            </div>
                                                        </td>
                                                        <td>${item.price.toFixed(2)}</td>
                                                        <td>{item.qty}</td>
                                                        <td>${(item.price * item.qty).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="text-xl" />
                                            <span className="text-lg font-bold">Total Amount</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">
                                            ${order.totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}