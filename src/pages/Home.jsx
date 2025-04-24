import { Link } from "react-router-dom"
import { PostList } from "../components/PostList"
import { PlusCircle, Cat } from "lucide-react"

export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Cat className="w-8 h-8 text-[#a67c52] dark:text-[#d4b996]" />
          <h1 className="text-3xl font-bold text-[#6f4e37] dark:text-[#e6d7c3]">CatChat</h1>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#a67c52] text-white rounded-lg hover:bg-[#8c6142] transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Cat Photo</span>
        </Link>
      </div>

      <div className="bg-[#f0e6d8] dark:bg-[#4d3f33] p-6 rounded-lg mb-8 border border-[#e6d7c3] dark:border-[#5d4c3e]">
        <h2 className="text-xl font-bold text-[#6f4e37] dark:text-[#d4b996] mb-2">Welcome to CatChat!</h2>
        <p className="text-[#8c7158] dark:text-[#b39f85]">
          Share your favorite cat photos, stories, and connect with fellow cat enthusiasts. From playful kittens to
          majestic seniors, we love all cats here!
        </p>
      </div>

      <PostList />
    </div>
  )
}

export default HomePage
