'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { XOctagon, Mail, User, Calendar, MessageSquare, Send, Trash2, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminContactsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [contacts, setContacts] = useState([]);
    const [responses, setResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = ` Contacts | Admin Dashboard`;
        document.querySelector('meta[name="description"]').setAttribute(
            'content',
            'Contact management for the admin dashboard. View, reply, and delete contact messages.'
        );
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.isAdmin) {
            fetchContacts();
        }
    }, [status, session]);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/contact', {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch contacts');
            const data = await res.json();
            setContacts(data);
            
            const initialResponses = {};
            data.forEach(contact => {
                if (contact.response) {
                    initialResponses[contact._id] = contact.response;
                }
            });
            setResponses(initialResponses);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load contact messages',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResponse = async (id) => {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                    response: responses[id],
                })
            });

            if (!response.ok) throw new Error('Failed to update response');

            await Swal.fire({
                title: 'Success!',
                text: 'Response saved successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setContacts(contacts.map(contact => 
                contact._id === id 
                    ? { ...contact, response: responses[id] } 
                    : contact
            ));
        } catch (error) {
            console.error('Error updating response:', error);
            await Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/contact/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to delete contact');

                await Swal.fire(
                    'Deleted!',
                    'Contact message has been deleted.',
                    'success'
                );

                setContacts(contacts.filter(contact => contact._id !== id));
            } catch (error) {
                await Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="ml-4 text-gray-700">Loading Data...</p>
            </div>
        );
    }

    if (!session?.user?.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error max-w-md shadow-lg">
                    <XOctagon className="h-6 w-6" />
                    <span>Unauthorized Access. Admin privileges required.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Mail className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contact Messages</h1>
                    </div>
                    <div className="badge badge-primary badge-lg gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Admin Mode
                    </div>
                </div>

                {contacts.length === 0 ? (
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body text-center">
                            <h2 className="text-xl font-semibold">No contact messages found</h2>
                            <p>All clear! No messages to display.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {contacts.map((contact) => (
                            <div key={contact._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="card-body">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                            <span className="mx-1">•</span>
                                            {new Date(contact.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1 mb-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{contact.name}</span>
                                        </div>
                                        <a 
                                            href={`mailto:${contact.email}`} 
                                            className="flex items-center gap-2 link link-primary"
                                        >
                                            <Mail className="h-4 w-4" />
                                            {contact.email}
                                        </a>
                                    </div>

                                    <div className="mb-2">
                                        <h3 className="text-lg font-semibold">{contact.subject}</h3>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm line-clamp-3">{contact.message}</p>
                                    </div>

                                    <div className="mb-4">
                                        <textarea
                                            className="textarea textarea-primary h-26 w-full"
                                            value={responses[contact._id] || contact.response || ''}
                                            onChange={(e) => setResponses({
                                                ...responses,
                                                [contact._id]: e.target.value
                                            })}
                                            placeholder="Type response here..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => handleResponse(contact._id)}
                                            className="btn btn-sm btn-primary gap-1 flex-1"
                                            disabled={!responses[contact._id] || responses[contact._id] === contact.response}
                                        >
                                            <Send className="h-4 w-4" />
                                            Send
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            className="btn btn-sm btn-error gap-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}