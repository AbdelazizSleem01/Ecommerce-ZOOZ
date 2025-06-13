'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Facebook, Twitter, Loader2, PlusCircle, Linkedin } from 'lucide-react';
import Swal from 'sweetalert2';

export default function OurTeams() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/admin/team');
        if (!response.ok) throw new Error('Failed to fetch team members');
        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

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
        const response = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete team member');

        await Swal.fire(
          'Deleted!',
          'Team member has been deleted.',
          'success'
        );

        setTeamMembers(prev => prev.filter(member => member._id !== id));
      } catch (err) {
        await Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Loader2 className="animate-spin h-12 w-12 text-primary" />
      <span className='mx-4 text-gray-700'>Loading Teams...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen my-12 p-6">
      <div className="alert alert-error max-w-4xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-scree p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-700">Team Members</h1>
          <Link href="/admin/create-employee" className="btn btn-primary">
            <PlusCircle className="h-6 w-6 mr-1" />
            Add New Member
          </Link>
        </div>

        {teamMembers.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="text-xl font-semibold">No team members found</h2>
              <p>Get started by adding your first team member</p>
              <div className="card-actions justify-center">
                <Link href="/admin/create-employee" className="btn btn-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Team Member
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map(member => (
              <div key={member._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className=" pt-6 ">
                  <div className="avatar">
                    <div className="w-full rounded-xl h-64 relative">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover w-full"
                      />
                    </div>
                  </div>
                </figure>
                <div className="card-body">
                  <div className='flex items-center justify-between'>
                    <h2 className="card-title">{member.name}</h2>
                    <div className="badge badge-primary">{member.role}</div>
                  </div>
                  <p>{member.comment}</p>

                  <div className="flex justify-center gap-2 mt-2">
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gray-100">
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gray-100">
                        <Linkedin className="w-5 h-5 text-blue-400" />
                      </a>
                    )}
                  </div>

                  <div className="card-actions flex items-center justify-center mt-4">
                    <button
                      onClick={() => router.push(`/admin/create-employee/${member._id}`)}
                      className="btn btn-sm btn-warning w-full my-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="btn btn-sm btn-error w-full my-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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