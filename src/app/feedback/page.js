"use client"

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !role || !email || !comment || !rating) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      formData.append('email', email);
      formData.append('comment', comment);
      formData.append('rating', rating);

      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const data = await response.json();
      toast.success(data.message);

      setName('');
      setRole('');
      setEmail('');
      setComment('');
      setRating(0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Submit Feedback
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-2 py-2 border bg-transparent text-gray-700 rounded-md shadow-sm input input-primary"
              required
            />
          </div>
          
          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              role
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-2 py-2 border bg-transparent text-gray-700 rounded-md shadow-sm input input-primary"
              required
            />
          </div>


          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-2 py-2 border bg-transparent text-gray-700 rounded-md shadow-sm input input-primary"
              required
            />
          </div>

          {/* Rating Field */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating (1-5)
            </label>
            <div className="flex space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${rating >= star
                      ? 'rating stars bg-primary text-white'
                      : 'rating bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Field */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full px-2 py-2 border bg-transparent text-gray-700 rounded-md shadow-sm textarea textarea-primary"
              rows="4"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}