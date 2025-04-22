"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { CommentForm } from "../components/CommentForm"
import { CommentList } from "../components/CommentList"
import { getPostById, upvotePost, deletePost, getCurrentUser } from "../utils/api"
import { ArrowLeft, Edit, Trash2, Heart, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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
      setPost({ ...post, upvotes: updatedPost.upvotes })
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-500"></div>
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
  const formattedDate = post ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : ""

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-coffee-500 dark:text-coffee-300 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>

      {post && (
        <div className="bg-coffee-100 dark:bg-coffee-800 rounded-lg shadow-md overflow-hidden border border-coffee-200 dark:border-coffee-700">
          {/* Post Header */}
          <div className="p-5 border-b border-coffee-200 dark:border-coffee-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-coffee-300 dark:bg-coffee-600 flex items-center justify-center text-coffee-700 dark:text-coffee-200 font-bold text-lg">
                  {post.author_name ? post.author_name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-coffee-700 dark:text-coffee-200">{post.author_name}</p>
                  <div className="flex items-center text-coffee-500 dark:text-coffee-400 text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              {isAuthor && (
                <div className="flex gap-2">
                  <Link
                    to={`/edit/${post.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-coffee-200 dark:bg-coffee-700 text-coffee-700 dark:text-coffee-300 rounded-md hover:bg-coffee-300 dark:hover:bg-coffee-600"
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

            <h1 className="text-2xl font-bold text-coffee-700 dark:text-coffee-200 mb-3">{post.title}</h1>

            {post.content && (
              <div className="prose dark:prose-invert max-w-none mb-4">
                <p className="text-coffee-700 dark:text-coffee-300">{post.content}</p>
              </div>
            )}

            {post.image_url && (
              <div className="mt-4 mb-2">
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

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleUpvote}
                className="flex items-center gap-1 px-3 py-1 bg-coffee-200 dark:bg-coffee-700 hover:bg-coffee-300 dark:hover:bg-coffee-600 rounded-full transition-colors duration-200"
              >
                <Heart className="w-4 h-4 text-coffee-600 dark:text-coffee-400" />
                <span className="text-sm font-medium text-coffee-700 dark:text-coffee-300">{post.upvotes} likes</span>
              </button>
            </div>
          </div>

          {/* Comment Form */}
          <div className="p-5 border-b border-coffee-200 dark:border-coffee-700">
            <h2 className="text-lg font-medium text-coffee-700 dark:text-coffee-200 mb-3">Leave a comment</h2>
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>

          {/* Comments List */}
          <div className="p-5">
            <h2 className="text-lg font-medium text-coffee-700 dark:text-coffee-200 mb-4">Comments</h2>
            <CommentList postId={post.id} newComment={newComment} />
          </div>
        </div>
      )}
    </div>
  )
}
