'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/get-users');
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);



  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="overflow-x-auto">

        {/* button */}
        <Link href="/admin/users">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Users
          </button>
        </Link>
        <Link href="/admin/ourTeams">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            ourTeams
          </button>
        </Link>
        <Link href="/admin/products">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Products
          </button>
        </Link>
        <Link href="/admin/categories">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Categories
          </button>
        </Link>
        <Link href="/admin/orders">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Orders
          </button>
        </Link>
        <Link href="/admin/brands">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Brands
          </button>
        </Link>
        <Link href="/admin/subscribers">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Subscribers
          </button>
        </Link>
        <Link href="/admin/contacts">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            contacts
          </button>
        </Link>
        <Link href="/admin/feedback">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            Feedbacks
          </button>
        </Link>
        <Link href="/admin/notifications">
          <button className='btn w-full cursor-pointer bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md mt-4'>
            notifications
          </button>
        </Link>


      </div>
    </div>
  );
}
