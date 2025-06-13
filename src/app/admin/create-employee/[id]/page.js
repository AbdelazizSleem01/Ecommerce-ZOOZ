'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle, Facebook, Twitter, User, Briefcase, MessageSquare, Image as ImageIcon, ArrowLeft, Loader2, CheckCircle, Linkedin } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EditEmployee() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    comment: '',
    facebook: '',
    twitter: '',
    image: null,
    existingImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`/api/admin/team/${id}`);
        if (!response.ok) throw new Error('Failed to fetch team member');
        const data = await response.json();
        
        setFormData({
          name: data.name,
          role: data.role,
          comment: data.comment,
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          image: null,
          existingImage: data.image
        });
      } catch (err) {
        setError(err.message);
        await Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        router.push('/admin/ourTeams');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTeamMember();
    }
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('comment', formData.comment);
      formDataToSend.append('facebook', formData.facebook);
      formDataToSend.append('twitter', formData.twitter);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to update team member');
      }

      await Swal.fire({
        title: 'Success!',
        text: 'Team member updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      router.push('/admin/ourTeams');
    } catch (err) {
      await Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary mx-2" />
        <p className="text-gray-700">Loading team member...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen my-12 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => router.push('/admin/ourTeams')} className="btn btn-ghost btn-circle">
                <ArrowLeft size={24} />
              </button>
              <h1 className="card-title text-3xl font-bold">Edit Team Member</h1>
            </div>
            
            {error && (
              <div className="alert alert-error mb-6">
                <AlertCircle className="stroke-current shrink-0 h-6 w-6" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <User size={18} />
                      Full Name*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-primary w-full"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Briefcase size={18} />
                      Role*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input input-primary w-full"
                    required
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 ">
                    <MessageSquare size={18} />
                    Comment*
                  </span>
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="textarea textarea-primary w-full"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Facebook size={18} />
                      Facebook URL
                    </span>
                  </label>
                  <div className="relative">       
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="input input-primary w-full "
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Linkedin size={18} />
                      LinkedIn URL
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="input input-primary w-full "
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <ImageIcon size={18} />
                    Profile Image
                  </span>
                </label>
                {formData.existingImage && (
                  <div className="mb-4">
                    <div className="avatar rounded-full">
                      <div className="w-24 rounded-full border border-primary p-1">
                        <img src={formData.existingImage} alt="Current profile" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Current image</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="file-input file-input-primary w-full"
                  accept="image/*"
                />
                <label className="label">
                  <span className="label-text-alt">Leave empty to keep current image</span>
                </label>
              </div>
              
              <div className=" gap-3 flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => router.push('/admin/ourTeams')}
                  className="btn btn-error w-[50%] "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary full w-[50%]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Update Team Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}