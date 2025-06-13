'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Users() {
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

  const handleUpdateRole = async (userId, isAdmin) => {
    const confirmation = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${isAdmin ? 'remove' : 'make'} this user an admin?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmation.isConfirmed) {
      try {
        const res = await fetch('/api/admin/update-role', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, isAdmin: !isAdmin }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success(data.message);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, isAdmin: !isAdmin } : user
            )
          );
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error('Failed to update user role');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <div className="overflow-x-auto">
        <table className="table bg-base-100 w-full ">
          {/* Table Head */}
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-base-300 transition-colors">
                  <td className="py-4">{user.name}</td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">
                    {user.isAdmin ? (
                      <span className="badge w-14 badge-success">Admin</span>
                    ) : (
                      <span className="badge w-14 badge-neutral">User</span>
                    )}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleUpdateRole(user._id, user.isAdmin)}
                      className={`btn btn-sm ${user.isAdmin ? 'btn-error' : 'btn-primary'}`}
                    >
                      {user.isAdmin ? 'Make Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}