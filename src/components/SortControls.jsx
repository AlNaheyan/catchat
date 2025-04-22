"use client"
import { Clock, Heart, ChevronUp, ChevronDown } from "lucide-react"

export const SortControls = ({ sortBy, sortDirection, onSort }) => {
  return (
    <div className="flex items-center gap-2 bg-[#f5f0e8] dark:bg-[#3c3228] p-1 rounded-lg border border-[#e6d7c3] dark:border-[#4d3f33]">
      <button
        onClick={() => onSort("created_at")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
          sortBy === "created_at"
            ? "bg-[#e6d7c3] dark:bg-[#4d3f33] text-[#6f4e37] dark:text-[#d4b996]"
            : "text-[#6f4e37] dark:text-[#d4b996] hover:bg-[#f0e6d8] dark:hover:bg-[#4d3f33]"
        }`}
      >
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Newest</span>
        {sortBy === "created_at" &&
          (sortDirection === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
      </button>

      <button
        onClick={() => onSort("upvotes")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
          sortBy === "upvotes"
            ? "bg-[#e6d7c3] dark:bg-[#4d3f33] text-[#6f4e37] dark:text-[#d4b996]"
            : "text-[#6f4e37] dark:text-[#d4b996] hover:bg-[#f0e6d8] dark:hover:bg-[#4d3f33]"
        }`}
      >
        <Heart className="w-4 h-4" />
        <span className="text-sm font-medium">Most Liked</span>
        {sortBy === "upvotes" &&
          (sortDirection === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
      </button>
    </div>
  )
}
