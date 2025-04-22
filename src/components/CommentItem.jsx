"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Trash2 } from "lucide-react"
import { deleteComment, getCurrentUser } from "../utils/api"

export const CommentItem = ({ comment, onCommentDeleted }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }

    fetchUser()
  }, [])

  const formattedDate = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setLoading(true)
      const success = await deleteComment(comment.id)
      setLoading(false)

      if (success) {
        onCommentDeleted(comment.id)
      }
    }
  }

  const isAuthor = user && user.id === comment.user_id

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">{comment.author_name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
        </div>

        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</div>
    </div>
  )
}
