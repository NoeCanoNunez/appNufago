import React from 'react';

const SearchInput = ({ placeholder, onSearch, label }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center mb-4">
      <label className='sm:block hidden' > {label} </label>
      <input
        type="text"
        
        placeholder={placeholder}
        className="sm:text-base text-xs  border-gray-300 rounded-l focus:ring focus:border-blue-300 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 hover:from-pink-50 hover:via-purple-50 hover:to-red-50 font-bold rounded-r flex shadow appearance-none border rounded w-full py-1.5 px-1 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
