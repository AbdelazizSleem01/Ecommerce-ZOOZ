'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import Image from 'next/image';
import CartIcon from './CartIcon';
import { toast } from 'react-toastify';
import SignOutButton from './SignOutButton';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', profilePicture: '' });
  const [categories, setCategories] = useState([]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart/count');
        const data = await res.json();
        setCartItemsCount(data.count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    if (session) fetchCartCount();
  }, [session]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser({ name: data.name, email: data.email, profilePicture: data.profilePicture });
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Function to update cart count immediately
  const updateCartCount = async () => {
    try {
      const res = await fetch('/api/cart/count');
      const data = await res.json();
      setCartItemsCount(data.count);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={'/images/logo1.png'}
                width={70}
                height={70}
                className=" my-auto h-26 w-auto"
                alt="Logo"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-black">
              Home
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black">
              Contact
            </Link>

            <div className="dropdown dropdown-end ">
              <label tabIndex={0} className="text-gray-700 hover:text-black">
                Categories
              </label>
              <ul tabIndex={0} className="mt-5 dropdown-content menu p-2 shadow bg-base-100 rounded-box w-46">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link href={`/product?category=${category.slug}`} onClick={closeMobileMenu}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {
              session?.user?.isAdmin ? (
                <div className="flex items-center space-x-4 text-gray-700 hover:text-black">
                  <NotificationBell  session={session}/>
                </div>
              ) : null

            }


            <Link href="/cart" className="relative text-gray-700 hover:text-black">
              <CartIcon cartItemsCount={cartItemsCount} />
            </Link>
            {session ? (
              <UserAuth user={user} session={session} updateCartCount={updateCartCount} />
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-black">
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-black"
          >
            <MenuIcon />
          </button>
        </div>

        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="p-4">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <SearchBar />
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
              <Link
                href="/cart"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                Cart ({cartItemsCount})
              </Link>
              {session ? (
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-35 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>
        )}
      </div>
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function UserAuth({ user, session }) {
  return (
    <div className="dropdown dropdown-end ">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.name?.charAt(0) || user?.email?.charAt(0)}
          </div>
        )}
      </label>
      <ul tabIndex={0} className="mt-3 mx-auto p-2 shadow text-center menu menu-compact dropdown-content bg-base-100 rounded-box w-48">
        <li>
          <Link href="/profile" className="text-center">
            Profile
          </Link>
        </li>
        {session?.user?.isAdmin && (
          <li>
            <Link href="/admin/dashboard">Dashboard</Link>
          </li>
        )}
        <li>
          <Link href="/orders">Orders</Link>
        </li>
        <li className='mx-auto'>
          <SignOutButton />
        </li>
      </ul>
    </div>
  );
}