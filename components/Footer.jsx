"use client"
import { Facebook, Github, Linkedin, Twitter, Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Footer() {
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
      if (!response.ok) throw new Error(data.error || 'Failed to subscribe');
      toast.success(data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/logo1.png"
                  width={70}
                  height={70}
                  className="h-auto w-14"
                  alt="ZOOZ Logo"
                />
              </Link>
              <span className="badge badge-primary badge-lg">Premium</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Elevating your shopping experience with curated quality and exclusive offers.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, color: 'bg-blue-600' },
                { icon: <Twitter className="w-4 h-4" />, color: 'bg-sky-400' },
                { icon: <Linkedin className="w-4 h-4" />, color: 'bg-blue-700' },
                { icon: <Github className="w-4 h-4" />, color: 'bg-gray-800' },
              ].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`btn btn-circle btn-sm ${social.color} text-white border-0 hover:opacity-90 transition-all`}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider ">Explore</h3>
            <ul className="space-y-2">
              {[
                ['Home', '/'],
                ['Products', '/product'],
                ['About Us', '/about-us'],
                ['Blogs', '/blogs'],
                ['Contact', '/contact'],
              ].map(([title, url]) => (
                <li key={title}>
                  <Link
                    href={url}
                    className="flex items-center gap-2 text-base opacity-80 hover:opacity-100 hover:text-primary transition-all group"
                  >
                    {title}
                    <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider ">Support</h3>
            <ul className="space-y-2">
              {[
                ['FAQ', '/faq'],
                ['Shipping', '/shipping'],
                ['Returns', '/returns'],
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
              ].map(([title, url]) => (
                <li key={title}>
                  <Link
                    href={url}
                    className="flex items-center  gap-2 text-base opacity-80 hover:opacity-100 hover:text-primary transition-all group"
                  >
                    {title}
                    <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 opacity-80">
                
                <Link href="mailto:abdelazizsleem957@gmail.com" className='flex items-center gap-2'> <Mail className="w-5 h-5 text-primary" />abdelazizsleem957@gmail.com</Link>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Phone className="w-5 h-5 text-primary" />
                <Link href="tel:+201119268163">+20 1119268163</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Section at Bottom */}
        <div className="bg-primary/10 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">Stay Updated</h3>
              <p className="opacity-80">Subscribe to our newsletter for the latest updates</p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full md:w-auto">
              <div className="join w-full">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered join-item w-full md:w-64"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary join-item"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-6 border-t border-gray-500 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="opacity-70">
              © {new Date().getFullYear()} ZOOZ. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">
                Privacy Policy
              </Link>
              <Link href="/terms" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}