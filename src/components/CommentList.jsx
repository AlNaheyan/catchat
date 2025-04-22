"use client"

import { useState, useEffect } from "react"
import { CommentItem } from "./CommentItem"
import { getCommentsByPostId } from "../utils/api"

export const CommentList = ({ postId, newComment }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      const data = await getCommentsByPostId(postId)
      setComments(data)
      setLoading(false)
    }

    fetchComments()
  }, [postId])

  useEffect(() => {
    if (newComment) {
      setComments((prevComments) => [newComment, ...prevComments])
    }
  }, [newComment])

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coffee-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onCommentDeleted={handleCommentDeleted} />
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-coffee-500 dark:text-coffee-400">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
