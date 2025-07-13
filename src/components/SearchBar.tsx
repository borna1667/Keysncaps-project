import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search products...", 
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      onSearch(''); // Clear search if field is empty
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full py-2 pl-3 md:pl-4 pr-8 md:pr-10 text-sm md:text-base bg-light border border-accent/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        aria-label="Search"
      />
      <button
        type="submit"
        className="absolute right-2 text-secondary hover:text-primary transition-colors"
        aria-label="Search"
      >
        <Search size={18} className="md:w-5 md:h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
