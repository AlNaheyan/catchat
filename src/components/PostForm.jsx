"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createPost, updatePost } from "../utils/api"

export const PostForm = ({ post = null, isEditing = false }) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [imageUrl, setImageUrl] = useState(post?.image_url || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isEditing && post) {
        const updatedPost = await updatePost(post.id, {
          title,
          content,
          image_url: imageUrl,
          updated_at: new Date(),
        })

        if (updatedPost) {
          navigate(`/post/${updatedPost.id}`)
        } else {
          setError("Failed to update post. You may only edit your own posts.")
        }
      } else {
        const newPost = await createPost({
          title,
          content,
          image_url: imageUrl,
        })

        if (newPost) {
          navigate(`/post/${newPost.id}`)
        } else {
          setError("Failed to create post")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md">{error}</div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#6f4e37] dark:text-[#d4b996] mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your cat up to?"
          className="w-full px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-[#6f4e37] dark:text-[#d4b996] mb-1">
          Description
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell us about your feline friend..."
          rows={5}
          className="w-full px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-[#6f4e37] dark:text-[#d4b996] mb-1">
          Cat Photo URL
        </label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/cat-image.jpg"
          className="w-full px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
        />
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-[#8c7158] dark:text-[#b39f85] mb-2">Preview:</p>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Cat Preview"
              className="w-full max-h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/800x400?text=No+Cat+Image+Available"
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg text-[#6f4e37] dark:text-[#d4b996] hover:bg-[#f0e6d8] dark:hover:bg-[#4d3f33]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#a67c52] text-white rounded-lg hover:bg-[#8c6142] focus:outline-none focus:ring-2 focus:ring-[#d4b996] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEditing ? "Update Post" : "Share Cat Post"}
        </button>
      </div>
    </form>
  )
}
