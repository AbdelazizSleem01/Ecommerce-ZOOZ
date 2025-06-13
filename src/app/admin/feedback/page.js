'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Trash2, Loader2, AlertTriangle, Star } from 'lucide-react';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/feedback');
        if (!response.ok) throw new Error('Failed to fetch feedback');
        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete Feedback?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      iconColor: '#ef4444',
      customClass: {
        actions: 'gap-3',
        confirmButton: 'order-2',
        cancelButton: 'order-1'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/feedback/${id}`, {
            method: 'DELETE'
          });

          if (!response.ok) throw new Error('Failed to delete feedback');

          setFeedbacks(feedbacks.filter(fb => fb._id !== id));
          toast.success('Feedback deleted successfully');

          Swal.fire({
            title: 'Deleted!',
            text: 'Feedback has been removed',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          toast.error(error.message);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete feedback',
            icon: 'error',
            timer: 2000
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-gray-500 mx-4">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 gap-2">
        <AlertTriangle size={24} />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-600">Feedback Management</h1>
          <span className="text-gray-500">
            ({feedbacks.length}) {feedbacks.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-md  border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-500">Name</th>
                  <th className="px-2 py-4 text-left text-sm font-semibold text-gray-500">Email</th>
                  <th className="px-2 py-4 text-left text-sm font-semibold text-gray-500">Role</th>
                  <th className="px-2 py-4 text-left text-sm font-semibold text-gray-500">Comment</th>
                  <th className="px-2 py-4 text-left text-sm font-semibold text-gray-500">Rating</th>
                  <th className="px-2 py-4 text-left text-sm font-semibold text-gray-500">Date</th>
                  <th className="px-2 py-4 text-left text-sm font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {feedback.name}
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-600">{feedback.email}</td>
                    <td className="px-2 py-4 text-sm text-gray-600 capitalize">{feedback.role}</td>
                    <td className="px-2 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="line-clamp-2 hover:line-clamp-none cursor-help">
                        {feedback.comment}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {feedback.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-4">
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="p-2 btn text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {feedbacks.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No feedback entries found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}