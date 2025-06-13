"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Facebook, Twitter, Linkedin, Link2, CalendarDays, Clock } from 'lucide-react';
import rehypeSanitize from 'rehype-sanitize';

const MDEditor = dynamic(
    () => import('@uiw/react-markdown-preview'),
    {
        ssr: false,
        loading: () => <div className="h-64 bg-base-200 animate-pulse rounded-lg"></div>
    }
);

export default function BlogDetail() {
    const { slug } = useParams();
    const { data: session } = useSession();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [readingTime, setReadingTime] = useState(0);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blog/${slug}`);
                if (!response.ok) throw new Error('Failed to fetch blog');
                const data = await response.json();

                // Calculate reading time
                const words = data.content.split(/\s+/).length;
                const time = Math.ceil(words / 200);
                setReadingTime(time);

                setBlog(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="alert alert-error max-w-4xl mx-auto mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error || 'Blog not found'}</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-base-200 my-12 rounded-lg shadow-lg">
            <article className="prose max-w-none lg:prose-xl">
                {/* Blog Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <img
                                    src={blog.authorDetails?.profilePicture || '/images/default-avatar.png'}
                                    alt={blog.authorDetails?.name || 'Author'}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{blog.author?.name || 'Unknown Author'}</p>
                            <div className="flex gap-4 text-sm opacity-75">
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4" />
                                    {new Date(blog.publishedAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {readingTime} min read
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/blogs?tag=${tag}`}
                                className="badge badge-outline hover:badge-primary transition-all"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>

                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className=" w-[50%] mx-auto object-contain rounded-lg shadow-lg mb-8"
                    />
                </header>

                {/* Blog Content */}
                <section className="mb-12">
                    <MDEditor
                        source={blog.content}
                        style={{ backgroundColor: 'transparent' }}
                        rehypePlugins={[rehypeSanitize]}
                    />
                </section>

                {/* Blog Footer */}
                <footer className="border-t border-base-300 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="w-16 rounded-full">
                                    <img
                                        src={blog.authorDetails?.profilePicture || '/images/default-avatar.png'}
                                        alt={blog.authorDetails?.name || 'Author'}
                                    />                                
                                    </div>
                            </div>
                            <div>
                                <p className="font-bold">{blog.author?.name || 'Unknown Author'}</p>
                                <p className="text-sm opacity-75">Author</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={copyToClipboard}
                                className="btn btn-circle btn-sm btn-ghost"
                                aria-label="Copy link"
                            >
                                <Link2 className="w-5 h-5" />
                            </button>
                            <Link
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                className="btn btn-circle btn-sm btn-ghost"
                                aria-label="Share on Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                className="btn btn-circle btn-sm btn-ghost"
                                aria-label="Share on Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                className="btn btn-circle btn-sm btn-ghost"
                                aria-label="Share on LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {session?.user?.id === blog.author?._id && (
                        <div className="flex justify-end">
                            <Link
                                href={`/blogs/${blog.slug}/edit`}
                                className="btn btn-primary"
                            >
                                Edit Post
                            </Link>
                        </div>
                    )}
                </footer>
            </article>
        </div>
    );
}