import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "../pages/Home"
import { CreatePostPage } from "../pages/CreatePost"
import { EditPostPage } from "../pages/EditPost"
import { PostPage } from "../pages/Post"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
