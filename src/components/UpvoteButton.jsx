"use client"
import { Heart } from "lucide-react"

export const UpvoteButton = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 bg-[#f0e6d8] dark:bg-[#4d3f33] hover:bg-[#e6d7c3] dark:hover:bg-[#5d4c3e] rounded-full transition-colors duration-200"
      aria-label="Like post"
    >
      <Heart className="w-4 h-4 text-[#a67c52] dark:text-[#d4b996]" />
      <span className="text-sm font-medium text-[#6f4e37] dark:text-[#e6d7c3]">{count}</span>
    </button>
  )
}
