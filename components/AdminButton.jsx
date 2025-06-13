// components/AdminButton.js
'use client';
import { useSession } from 'next-auth/react';

export default function AdminButton() {
  const { data: session } = useSession();

  // Hide button if user is not an admin
  if (!session?.user?.isAdmin) return null;

  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Admin Feature
    </button>
  );
}