"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:max-w-md">
      <input
        type="text"
        placeholder="Search for cat posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7158] dark:text-[#b39f85]"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  )
}
