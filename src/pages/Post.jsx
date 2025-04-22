"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { PostItem } from "../components/PostItem"
import { CommentForm } from "../components/CommentForm"
import { CommentList } from "../components/CommentList"
import { getPostById, upvotePost, deletePost, getCurrentUser } from "../utils/api"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

export const PostPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newComment, setNewComment] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const [postData, userData] = await Promise.all([getPostById(id), getCurrentUser()])

        if (!postData) {
          setError("Post not found")
          return
        }

        setPost(postData)
        setUser(userData)
      } catch (err) {
        setError("Failed to load post")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleUpvote = async () => {
    if (!post) return

    const updatedPost = await upvotePost(post.id, post.upvotes)
    if (updatedPost) {
      setPost(updatedPost)
    }
  }

  const handleDelete = async () => {
    if (!post) return

    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      const success = await deletePost(post.id)

      if (success) {
        navigate("/")
      } else {
        setError("Failed to delete post. You can only delete your own posts.")
      }
    }
  }

  const handleCommentAdded = (comment) => {
    setNewComment(comment)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const isAuthor = user && post && user.id === post.user_id

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>

      {post && (
        <>
          <div className="mb-6">
            <PostItem post={post} showContent={true} onUpvote={handleUpvote} />

            {isAuthor && (
              <div className="flex gap-2 mt-4 justify-end">
                <Link
                  to={`/edit/${post.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comments</h2>
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>

          <CommentList postId={post.id} newComment={newComment} />
        </>
      )}
    </div>
  )
}
