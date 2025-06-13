"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !session?.user?.isAdmin)) {
      router.push("/unauthorized"); // Redirect to unauthorized page
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch categories");
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.isAdmin) {
      fetchCategories();
    }
  }, [session]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/category/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete category");
        }

        Swal.fire({
          title: "Deleted!",
          text: "Category deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        setCategories(categories.filter((category) => category._id !== id));
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  if (status === "loading") return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-600">All Categories</h1>
        <Link
          href="/admin/create-category"
          className="btn btn-primary"
        >
          Create Category
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table bg-base-100 w-full ">
          <thead>
            <tr >
              <th className="text-left">Name</th>
              <th className="text-left">Slug</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-base-200 transition-colors">
                <td className="text-sm">{category.name}</td>
                <td className="text-sm">{category.slug}</td>
                <td className="text-sm">
                  <div className="flex space-x-4">
                    <Link
                      href={`/admin/categories/${category._id}`}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}