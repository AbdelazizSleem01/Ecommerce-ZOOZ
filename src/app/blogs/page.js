"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function BlogsPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-4xl mx-auto mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Latest Blog Posts</h1>
        {session && (
          <Link href="/blogs/create" className="btn btn-primary">
            Create New Post
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-800">No blog posts yet</h2>
          {session && (
            <Link href="/blogs/create" className="btn btn-primary mt-4">
              Create Your First Post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {blogs.map((blog) => (
            <div key={blog._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200">
              <figure>
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="badge badge-outline">{tag}</span>
                  ))}
                </div>
                <h2 className="card-title">
                  <Link href={`/blogs/${blog.slug}`} className="hover:text-primary">
                    {blog.title}
                  </Link>
                </h2>
                <p className="line-clamp-2">{blog.excerpt}</p>
                <div className="card-actions justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={blog.authorDetails?.profilePicture || '/images/default-avatar.png'}
                          alt={blog.authorDetails?.name || 'Author'}
                        />
                      </div>
                    </div>
                    <span className="text-sm">{blog.author.name}</span>
                  </div>
                  <Link href={`/blogs/${blog.slug}`} className="btn btn-primary btn-sm">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}