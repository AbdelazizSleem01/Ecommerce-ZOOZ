"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateBlog() {
    const { data: session } = useSession();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            setError('You must be logged in to create a blog');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('excerpt', excerpt);
            formData.append('coverImage', coverImage);
            formData.append('tags', tags);
            formData.append('published', 'true');

            const response = await fetch('/api/blog', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create blog');
            }

            const data = await response.json();
            router.push(`/blogs/${data.blog.slug}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="prose max-w-none">
                <h1 className="text-4xl font-bold mb-8">Create New Blog Post</h1>

                {error && (
                    <div className="alert alert-error mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-lg font-medium">Title</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
                            className="input input-bordered w-full"
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
                        <input
                            type="file"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            className="file-input file-input-bordered w-full"
                            accept="image/*"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-lg font-medium">Content</span>
                        </label>
                        <div data-color-mode="light">
                            <MDEditor
                                value={content}
                                onChange={setContent}
                                height={400}
                                preview="edit"
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
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => router.push('/blogs')}
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
                                    Publishing...
                                </>
                            ) : (
                                'Publish Blog'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}