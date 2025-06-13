'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Folder, Mail, MessageCircle, UserCircle2Icon } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            Swal.fire({
                title: 'Success!',
                text: 'Message sent successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'dark:bg-base-300 dark:text-white',
                    confirmButton: 'btn btn-primary'
                }
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen my-12 flex items-center justify-center ">
            <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border border-base-300">
                <div className="card-body p-4 lg:p-12">
                    <div className="text-center mb-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-gray-500">
                            Have questions? We're here to help!
                        </p>
                    </div>

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
                                <span className="label-text text-lg flex items-center gap-2">
                                    <UserCircle2Icon className='text-primary' />
                                    Name
                                </span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input  w-full my-2 input-primary"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg flex items-center gap-2">
                                    <Mail className='text-primary' />
                                    Email
                                </span>
                            </label>
                            <input
                                type="email"
                                required
                                className="input  w-full my-2 input-primary"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg flex items-center gap-2">
                                    <Folder className='text-primary' />
                                    Subject
                                </span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input  w-full my-2 input-primary"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg flex items-center gap-2">
                                    <MessageCircle className='text-primary' />
                                    Message
                                </span>
                            </label>
                            <textarea
                                required
                                className="textarea w-full my-2 textarea-primary"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Write your message here..."
                                rows="5"
                            />
                        </div>

                        <div className="form-control mt-8">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full transition-all"
                                disabled={isSubmitting}
                                aria-disabled={isSubmitting}
                                aria-busy={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="loading loading-spinner h-6 w-6"></span>
                                        Sending...
                                    </div>
                                ) : (
                                    <>
                                        <MessageCircle className="text-white h-6 w-6" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}