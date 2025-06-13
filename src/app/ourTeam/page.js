'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Facebook, Twitter, Loader2, Linkedin } from 'lucide-react';

export default function OurTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return (
    <div className="min-h-screen bg-base-200 p-6 flex items-center justify-center">
      <Loader2 className="animate-spin h-12 w-12 text-primary" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="alert alert-error max-w-4xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The talented individuals who make everything possible
          </p>
        </div>
        
        {teamMembers.length === 0 ? (
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body text-center">
              <h2 className="text-xl font-semibold">Our team is growing</h2>
              <p>Check back soon to meet our team members</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map(member => (
              <div key={member._id} className="card bg-base-100 w-[90%] shadow-xl hover:shadow-2xl transition-shadow ">
                <figure className=" pt-8">
                  <div className="avatar w-36 h-36 rounded-full bg-gradient-to-br from-primary to-accent mb-2">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="w-full h-full rounded-full object-cover border-4 border-base-100 p-1"
                        />
                    </div>
                  </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{member.name}</h2>
                  <div className="badge badge-primary badge-lg">{member.role}</div>
                  <p className="text-gray-500">{member.comment}</p>
                  
                  <div className="flex gap-4 mt-4">
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="btn text-blue-600 bg-white rounded-full  btn-circle btn-ghost hover:bg-blue-100">
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="btn  text-blue-500 bg-white rounded-full  btn-circle btn-ghost hover:bg-blue-100">
                        <Linkedin className="w-6 h-6 " />
                      </a>
                    )}
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