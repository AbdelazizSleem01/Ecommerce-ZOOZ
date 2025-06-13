'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const data = await response.json();
      setSubscribers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog first
    const willDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subscriber!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    // Proceed only if the user confirms
    if (willDelete.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/subscribers/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete subscriber');
        }

        // Show success message
        await Swal.fire({
          title: 'Deleted!',
          text: 'The subscriber has been deleted.',
          icon: 'success',
        });

        // Refetch subscribers after deletion
        fetchSubscribers();
      } catch (error) {
        console.error('Error deleting subscriber:', error);

        // Show error message
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete subscriber. Please try again later.',
          icon: 'error',
        });

        setError(error.message);
      }
    } else {
      // Show cancellation message
      await Swal.fire({
        title: 'Cancelled',
        text: 'The subscriber is safe :)',
        icon: 'info',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2 text-gray-600">Loading subscribers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-md mx-auto mt-8">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Subscribers</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100 w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Subscribed On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td>{subscriber.email}</td>
                <td>
                  <span
                    className={`badge ${subscriber.verified ? 'badge-success' : 'badge-error'
                      }`}
                  >
                    {subscriber.verified ? 'Verified' : 'Not Verified'}
                  </span>
                </td>
                <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(subscriber._id)}
                  >
                    Delete
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