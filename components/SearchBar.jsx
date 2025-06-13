'use client';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="input input-primary input-lg w-full text-gray-900 bg-transparent rounded-4xl pr-16 placeholder:text-neutral/50 focus:border-1"
        />
        <button
          type="submit"
          className="btn btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/20 hover:border-primary "
        >
          <SearchIcon className="h-5 w-5 text-primary" />
        </button>
      </div>
    </form>
  );
}