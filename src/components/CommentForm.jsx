"use client"

import { useState } from "react"
import { createComment } from "../utils/api"

export const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const newComment = await createComment({
        content,
        post_id: postId,
      })

      if (newComment) {
        setContent("")
        onCommentAdded(newComment)
      } else {
        setError("Failed to add comment")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md">{error}</div>
      )}

      <div>
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this cat..."
          rows={3}
          className="w-full px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-[#a67c52] text-white rounded-lg hover:bg-[#8c6142] focus:outline-none focus:ring-2 focus:ring-[#d4b996] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  )
}
