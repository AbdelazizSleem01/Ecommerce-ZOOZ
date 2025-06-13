'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash } from 'lucide-react';

export default function NotificationsTable() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        document.title = ` Notifications | Admin Dashboard`;
        // description
        document.querySelector('meta[name="description"]').setAttribute(
            'content',
            'View and manage all your notifications in the admin dashboard.'
        );
    });


    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/admin/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the notification.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/admin/notifications/${id}`);
                Swal.fire('Deleted!', 'The notification has been deleted.', 'success');
                setNotifications((prev) => prev.filter((n) => n._id !== id));
            } catch (error) {
                console.error('Error deleting notification:', error);
                Swal.fire('Error!', 'Failed to delete notification.', 'error');
            }
        }
    };

    if (loading) return <p>Loading notifications...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full bg-base-100 text-center">
                    <thead>
                        <tr className="bg-gray-500">
                            <th className="border px-10 py-2 text-start">Message</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Created By</th>
                            <th className="border px-4 py-2">Recipients</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification) => (
                            <tr key={notification._id} className="hover:bg-base-200">
                                <td className="border px-10 py-2  text-start">{notification.message}</td>
                                <td className="border px-4 py-2">{notification.type}</td>
                                <td className="border px-4 py-2">{notification.createdBy?.name || 'System'}</td>
                                <td className="border px-4 py-2">{notification.recipients?.length}</td>
                                <td className="border px-4 py-2 mx-auto text-center">
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="btn btn-error btn-sm text-white mx-auto rounded"
                                    >
                                        <Trash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
