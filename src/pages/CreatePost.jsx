import { PostForm } from "../components/PostForm"

export const CreatePostPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a New Post</h1>
      <PostForm />
    </div>
  )
}
