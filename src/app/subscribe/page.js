'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success(data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-600">Subscribe to Our Newsletter</h2>
        <p className="text-gray-500 mb-8">
          Get the latest updates, exclusive offers, and more delivered straight to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
          <div className="join">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered join-item w-full"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary join-item"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}