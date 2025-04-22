"use client"

import { useState, useEffect } from "react"
import { getUserProfile, updateUserProfile, getCurrentUser, getPosts, ensureUserProfile } from "../utils/api"
import { Edit, Save, X, Heart, MessageSquare, ImageIcon } from "lucide-react"

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("")
  const [username, setUsername] = useState("")
  const [userPosts, setUserPosts] = useState([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          setError("You must be logged in to view your profile")
          setLoading(false)
          return
        }

        setUser(currentUser)

        // Ensure profile exists
        await ensureUserProfile(currentUser.id)

        const profileData = await getUserProfile(currentUser.id)

        if (profileData) {
          setProfile(profileData)
          setBio(profileData.bio || "")
          setUsername(profileData.username || currentUser.email)
        } else {
          setError("Could not load profile data")
        }

        // Fetch user's posts
        const allPosts = await getPosts()
        const userPostsData = allPosts.filter((post) => post.user_id === currentUser.id)
        setUserPosts(userPostsData)

        // Calculate stats
        const totalLikes = userPostsData.reduce((sum, post) => sum + (post.upvotes || 0), 0)
        setStats({
          totalPosts: userPostsData.length,
          totalLikes: totalLikes,
          totalComments: 0, // We would need to fetch comments to calculate this accurately
        })
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("An error occurred while loading your profile")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      const updatedProfile = await updateUserProfile({
        username,
        bio,
      })

      if (updatedProfile) {
        setProfile(updatedProfile)
        setIsEditing(false)
      } else {
        setError("Failed to update profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("An error occurred while updating your profile")
    }
  }

  const handleCancel = () => {
    setBio(profile?.bio || "")
    setUsername(profile?.username || user?.email || "")
    setIsEditing(false)
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
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-coffee-100 dark:bg-coffee-800 rounded-lg shadow-md overflow-hidden border border-coffee-200 dark:border-coffee-700">
        {/* Profile Header */}
        <div className="bg-coffee-200 dark:bg-coffee-700 p-6 relative">
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-coffee-300 dark:bg-coffee-600 flex items-center justify-center text-coffee-700 dark:text-coffee-200 text-4xl font-bold">
              {username ? username.charAt(0).toUpperCase() : "?"}
            </div>
          </div>

          {!isEditing ? (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-coffee-300 dark:bg-coffee-600 rounded-full text-coffee-700 dark:text-coffee-200 hover:bg-coffee-400 dark:hover:bg-coffee-500"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleCancel}
                className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-coffee-300 dark:border-coffee-700 rounded-lg bg-coffee-50 dark:bg-coffee-900 text-coffee-700 dark:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-coffee-300 dark:border-coffee-700 rounded-lg bg-coffee-50 dark:bg-coffee-900 text-coffee-700 dark:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-500"
                  placeholder="Tell us about yourself and your cats..."
                />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-coffee-700 dark:text-coffee-200 mb-2">{username}</h1>
              <p className="text-coffee-600 dark:text-coffee-300 mb-6">
                {bio || "No bio yet. Click the edit button to add one!"}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-coffee-200 dark:border-coffee-700 pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ImageIcon className="w-6 h-6 text-coffee-500 dark:text-coffee-400" />
              </div>
              <div className="text-2xl font-bold text-coffee-700 dark:text-coffee-200">{stats.totalPosts}</div>
              <div className="text-sm text-coffee-500 dark:text-coffee-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-coffee-500 dark:text-coffee-400" />
              </div>
              <div className="text-2xl font-bold text-coffee-700 dark:text-coffee-200">{stats.totalLikes}</div>
              <div className="text-sm text-coffee-500 dark:text-coffee-400">Likes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-coffee-500 dark:text-coffee-400" />
              </div>
              <div className="text-2xl font-bold text-coffee-700 dark:text-coffee-200">{stats.totalComments}</div>
              <div className="text-sm text-coffee-500 dark:text-coffee-400">Comments</div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="border-t border-coffee-200 dark:border-coffee-700 p-6">
          <h2 className="text-xl font-bold text-coffee-700 dark:text-coffee-200 mb-4">Your Posts</h2>

          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-coffee-50 dark:bg-coffee-900 p-4 rounded-lg border border-coffee-200 dark:border-coffee-700"
                >
                  <h3 className="text-lg font-medium text-coffee-700 dark:text-coffee-200">{post.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-coffee-500 dark:text-coffee-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-coffee-500 dark:text-coffee-400 mr-1" />
                      <span className="text-sm text-coffee-500 dark:text-coffee-400">{post.upvotes || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-coffee-500 dark:text-coffee-400">
              You haven't created any posts yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
