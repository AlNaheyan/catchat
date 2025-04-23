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

  // Ensure profile exists after sign in
  if (data.user) {
    await ensureUserProfile(data.user.id)
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
  } = await supabase.auth.getUser();

  if (!user) return null;

  // ensure the row exists (keeps your trigger fallback)
  await ensureUserProfile(user.id);

  // pull the username from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();           // returns { username: '...' } or null

  return {
    ...user,                         // id, email, aud, etc.
    username: profile?.username,     // undefined until set
  };
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Ensure user profile exists
export const ensureUserProfile = async (userId) => {
  if (!userId) return null

  try {
    // Check if profile exists
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId)

    if (error) throw error

    // If profile doesn't exist, create it
    if (data.length === 0) {
      console.log("Profile doesn't exist, creating one...")

      // Get user email
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email || "User"

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            username: email,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ])
        .select()

      if (createError) {
        console.error("Error creating profile:", createError)
        return null
      }

      return newProfile[0]
    }

    return data[0]
  } catch (err) {
    console.error("Error in ensureUserProfile:", err)
    return null
  }
}

// Posts API
export const getPosts = async (sortBy = "created_at", direction = "desc", searchQuery = "") => {
  let query = supabase
    .from("posts_with_profiles")
    .select("*") // Remove the profiles join for now
    .order(sortBy, { ascending: direction === "asc" })

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  // Process the posts to add author names

  return data.map((post) => ({
    ...post,
    author_name: post.username || post.author_name || "Anonymous Cat Lover",
  }))
}

export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from("posts_with_profiles")
    .select("*") // Remove the profiles join for now
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  // Get the author's profile separately if needed

  return {
    ...data,
    author_name: data.username || data.author_name || "Anonymous Cat Lover",
  }
}

export const createPost = async (postData) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  // Get the user's profile to get their username
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
  }

  const username = profileData?.username || user.email

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        ...postData,
        user_id: user.id,
        author_name: username, // Add the author_name when creating the post
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
    .from("comments_with_profiles") // Use the view instead
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data.map((comment) => ({
    ...comment,
    author_name: comment.username || comment.author_name || "Anonymous Cat Lover",
  }))
}

export const createComment = async (commentData) => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  // Get the user's profile to get their username
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
  }

  const username = profileData?.username || user.email

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        ...commentData,
        user_id: user.id,
        author_name: username, // Add the author_name when creating the comment
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
  // First ensure the profile exists
  const profile = await ensureUserProfile(userId)
  if (profile) return profile

  // If ensureUserProfile didn't return a profile, try the original method
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle() // Use maybeSingle instead of single to avoid errors if no profile exists

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

  // Ensure profile exists before updating
  await ensureUserProfile(user.id)

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      updated_at: new Date(),
    })
    .eq("id", user.id)
    .select()

  if (error) {
    console.error("Error updating profile:", error)
    return null
  }

  return data[0]
}
