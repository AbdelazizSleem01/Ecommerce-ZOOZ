"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-base-200 animate-pulse rounded-lg"></div>
  }
);

export default function EditBlog() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        
        if (data.author._id !== session?.user?.id && !session?.user?.isAdmin) {
          router.push('/blogs');
          return;
        }

        setBlog(data);
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt);
        setExistingImage(data.coverImage);
        setTags(data.tags.join(', '));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (slug && session) fetchBlog();
  }, [slug, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setError('You must be logged in to edit a blog');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('excerpt', excerpt);
      if (coverImage) formData.append('coverImage', coverImage);
      formData.append('tags', tags);
      formData.append('authorAvatar', session.user.profilePicture || '/images/default-avatar.png'); 

      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }

      router.push(`/blogs/${slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="alert alert-error max-w-4xl mx-auto mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Blog not found or you don't have permission to edit it</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 ">
      <div className="prose max-w-none">
        <h1 className="text-4xl font-bold mb-8 text-gray-700">Edit Blog Post</h1>
        
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-base-100 p-4 rounded-lg shadow-lg">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Excerpt</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description of your blog"
              className="textarea textarea-bordered w-full h-24"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Cover Image</span>
            </label>
            {existingImage && (
              <div className="mb-4">
                <img 
                  src={existingImage} 
                  alt="Current cover" 
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <span className="text-sm">Current image</span>
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="file-input file-input-primary w-full"
              accept="image/*"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Content</span>
            </label>
            <div data-color-mode="dark">
              <MDEditor
                value={content}
                onChange={setContent}
                height={400}
                preview="edit"
                className='textarea textarea-primary w-full h-96'
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Tags (comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="technology, web development, design"
              className="input input-primary w-full"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push(`/blogs/${slug}`)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Blog'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}