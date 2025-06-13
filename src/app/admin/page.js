// app/admin/page.js
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/authOptions';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Redirect non-admin users
  if (!session?.user?.isAdmin) {
    redirect('/unauthorized'); // Redirect to unauthorized page
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}