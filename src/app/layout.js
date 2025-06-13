import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import Providers from '../../components/Providers';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { authOptions } from '../../lib/authOptions';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ZOOZ - Modern E-commerce',
  description: 'Discover amazing products at great prices',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
          <Providers session={session}>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <ToastContainer />
          </Providers>
      </body>
    </html>
  );
}