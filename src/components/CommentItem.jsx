"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Trash2, Clock } from "lucide-react"
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
    <div className="border-b border-coffee-200 dark:border-coffee-700 py-4 last:border-b-0">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-coffee-300 dark:bg-coffee-600 flex items-center justify-center text-coffee-700 dark:text-coffee-200 font-bold text-sm">
            {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <span className="font-medium text-coffee-700 dark:text-coffee-300">{comment.author_name}</span>
            <div className="flex items-center text-coffee-500 dark:text-coffee-400 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-coffee-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-coffee-200 dark:hover:bg-coffee-700"
            aria-label="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-2 text-coffee-700 dark:text-coffee-300 pl-10">{comment.content}</div>
    </div>
  )
}
