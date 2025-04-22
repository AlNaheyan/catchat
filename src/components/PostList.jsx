"use client"

import { useState, useEffect } from "react"
import { PostItem } from "./PostItem"
import { SearchBar } from "./SearchBar"
import { SortControls } from "./SortControls"
import { getPosts, upvotePost } from "../utils/api"

export const PostList = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const data = await getPosts(sortBy, sortDirection, searchQuery)
      setPosts(data)
      setLoading(false)
    }

    fetchPosts()
  }, [sortBy, sortDirection, searchQuery])

  const handleUpvote = async (id, currentUpvotes) => {
    const updatedPost = await upvotePost(id, currentUpvotes)
    if (updatedPost) {
      setPosts(posts.map((post) => (post.id === id ? { ...post, upvotes: updatedPost.upvotes } : post)))
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("desc")
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <SearchBar onSearch={handleSearch} />
        <SortControls sortBy={sortBy} sortDirection={sortDirection} onSort={handleSort} />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} onUpvote={handleUpvote} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No posts found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchQuery ? `No posts matching "${searchQuery}"` : "Be the first to create a post!"}
          </p>
        </div>
      )}
    </div>
  )
}
