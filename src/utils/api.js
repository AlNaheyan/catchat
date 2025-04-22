import { supabase } from "./supabase"

// Auth API
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error("Error signing up:", error)
    return { user: null, error }
  }

  return { user: data.user, error: null }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error signing in:", error)
    return { user: null, error }
  }

  return { user: data.user, error: null }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    return false
  }

  return true
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Posts API
export const getPosts = async (sortBy = "created_at", direction = "desc", searchQuery = "") => {
  let query = supabase
    .from("posts")
    .select("*, profiles(username)")
    .order(sortBy, { ascending: direction === "asc" })

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data.map((post) => ({
    ...post,
    author_name: post.author_name || post.profiles?.username || "Anonymous Cat Lover",
  }))
}

export const getPostById = async (id) => {
  const { data, error } = await supabase.from("posts").select("*, profiles(username)").eq("id", id).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return {
    ...data,
    author_name: data.author_name || data.profiles?.username || "Anonymous Cat Lover",
  }
}

export const createPost = async (postData) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        ...postData,
        user_id: user.id,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating post:", error)
    return null
  }

  return data[0]
}

export const updatePost = async (id, postData) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  const { data, error } = await supabase.from("posts").update(postData).eq("id", id).eq("user_id", user.id).select()

  if (error) {
    console.error("Error updating post:", error)
    return null
  }

  return data[0]
}

export const deletePost = async (id) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return false
  }

  const { error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting post:", error)
    return false
  }

  return true
}

export const upvotePost = async (id, currentUpvotes) => {
  const { data, error } = await supabase
    .from("posts")
    .update({ upvotes: currentUpvotes + 1 })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error upvoting post:", error)
    return null
  }

  return data[0]
}

// Comments API
export const getCommentsByPostId = async (postId) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data.map((comment) => ({
    ...comment,
    author_name: comment.author_name || comment.profiles?.username || "Anonymous Cat Lover",
  }))
}

export const createComment = async (commentData) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        ...commentData,
        user_id: user.id,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating comment:", error)
    return null
  }

  return data[0]
}

export const deleteComment = async (id) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return false
  }

  const { error } = await supabase.from("comments").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting comment:", error)
    return false
  }

  return true
}

// Profile API
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export const updateUserProfile = async (profileData) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  const { data, error } = await supabase.from("profiles").update(profileData).eq("id", user.id).select()

  if (error) {
    console.error("Error updating profile:", error)
    return null
  }

  return data[0]
}
