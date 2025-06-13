'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Facebook, Twitter, User, Briefcase, MessageSquare, Image as ImageIcon, ArrowLeft, Loader2, CheckCircle, Linkedin } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CreateEmployee() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    comment: '',
    facebook: '',
    twitter: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

      const response = await fetch('/api/admin/team', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to create team member');
      }

      await Swal.fire({
        title: 'Success!',
        text: 'Team member created successfully',
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

  return (
    <div className="min-h-screen my-5 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => router.push('/admin/ourTeams')} className="btn btn-ghost btn-circle">
                <ArrowLeft size={24} />
              </button>
              <h1 className="card-title text-3xl font-bold">Add New Team Member</h1>
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
                  <span className="label-text flex items-center gap-2">
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
                      Linkedin URL
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="input input-primary w-full "
                      placeholder="https://Linkedin.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <ImageIcon size={18} />
                    Profile Image*
                  </span>
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="file-input file-input-primary w-full"
                  accept="image/*"
                  required
                />
              </div>
              {/* image preview */}
              {formData.image && (
                <div className="mb-4">
                  <div className="avatar">
                    <div className="w-24 rounded">
                      <img src={formData.image} alt="Current profile" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Current image</p>
                </div>
              )}

              <div className=" gap-3 flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary full w-[50%]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Create Team Member
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/ourTeams')}
                  className="btn btn-error w-[50%] "
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}