"use client"

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HomePage } from "./pages/Home"
import { CreatePostPage } from "./pages/CreatePost"
import { EditPostPage } from "./pages/EditPost"
import { PostPage } from "./pages/Post"
import { AuthPage } from "./pages/Auth"
import { Header } from "./components/Header"
import { AuthGuard } from "./components/AuthGuard"
import "./app.css"

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-[#2c241e] text-[#e6d7c3]" : "bg-[#fff9f0] text-[#6f4e37]"}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <AuthGuard>
                <>
                  <Header onThemeToggle={toggleDarkMode} isDarkMode={isDarkMode} />
                  <main className="pt-6 pb-12">
                    <HomePage />
                  </main>
                </>
              </AuthGuard>
            }
          />

          <Route
            path="/create"
            element={
              <AuthGuard>
                <>
                  <Header onThemeToggle={toggleDarkMode} isDarkMode={isDarkMode} />
                  <main className="pt-6 pb-12">
                    <CreatePostPage />
                  </main>
                </>
              </AuthGuard>
            }
          />

          <Route
            path="/post/:id"
            element={
              <AuthGuard>
                <>
                  <Header onThemeToggle={toggleDarkMode} isDarkMode={isDarkMode} />
                  <main className="pt-6 pb-12">
                    <PostPage />
                  </main>
                </>
              </AuthGuard>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <AuthGuard>
                <>
                  <Header onThemeToggle={toggleDarkMode} isDarkMode={isDarkMode} />
                  <main className="pt-6 pb-12">
                    <EditPostPage />
                  </main>
                </>
              </AuthGuard>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="py-6 bg-[#f5f0e8] dark:bg-[#3c3228] border-t border-[#e6d7c3] dark:border-[#4d3f33]">
          <div className="container mx-auto px-4 text-center text-sm text-[#8c7158] dark:text-[#b39f85]">
            &copy; {new Date().getFullYear()} CatChat - Share your purr-fect moments with the world
          </div>
        </footer>
      </BrowserRouter>
    </div>
  )
}

export default App
