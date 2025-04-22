"use client"

import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { UpvoteButton } from "./UpvoteButton"
import { Heart } from "lucide-react"

export const PostItem = ({ post, showContent = false, onUpvote }) => {
  const formattedDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <div className="bg-[#f5f0e8] dark:bg-[#3c3228] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#e6d7c3] dark:border-[#4d3f33]">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link
            to={`/post/${post.id}`}
            className="text-xl font-bold text-[#6f4e37] dark:text-[#d4b996] hover:text-[#a67c52] dark:hover:text-[#e6d7c3] transition-colors duration-200"
          >
            {post.title}
          </Link>
          <div className="flex items-center">
            <UpvoteButton count={post.upvotes} onClick={() => onUpvote(post.id, post.upvotes)} />
          </div>
        </div>

        <div className="text-sm text-[#8c7158] dark:text-[#b39f85] mb-3">
          Posted {formattedDate} by {post.author_name || "Anonymous Cat Lover"}
        </div>

        {showContent && (
          <>
            {post.content && (
              <div className="prose dark:prose-invert max-w-none mb-4">
                <p className="text-[#6f4e37] dark:text-[#e6d7c3]">{post.content}</p>
              </div>
            )}

            {post.image_url && (
              <div className="mt-4 mb-4">
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-auto rounded-lg object-cover max-h-96"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/800x400?text=No+Cat+Image+Available"
                  }}
                />
              </div>
            )}
          </>
        )}

        {!showContent && post.image_url && (
          <div className="mt-2 mb-3">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 rounded-lg object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/400x200?text=No+Cat+Image+Available"
              }}
            />
          </div>
        )}

        {!showContent && (
          <div className="flex items-center justify-between mt-2">
            <Link
              to={`/post/${post.id}`}
              className="inline-block text-[#a67c52] dark:text-[#d4b996] hover:text-[#8c6142] dark:hover:text-[#e6d7c3] font-medium"
            >
              Read more →
            </Link>
            <div className="flex items-center text-[#8c7158] dark:text-[#b39f85]">
              <Heart className="w-4 h-4 mr-1" />
              <span className="text-sm">{post.upvotes} likes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
