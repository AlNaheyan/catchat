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
import { ProfilePage } from "./pages/Profile"
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
      document.body.style.backgroundColor = "#2c241e" // Dark coffee background
    } else {
      document.documentElement.classList.remove("dark")
      document.body.style.backgroundColor = "#fff9f0" // Light coffee background
    }
    localStorage.setItem("darkMode", isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-coffee-950 text-coffee-200" : "bg-coffee-50 text-coffee-700"}`}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <AuthGuard>
                <>
                  <Header onThemeToggle={toggleDarkMode} isDarkMode={isDarkMode} />
                  <main className="pt-6 pb-12 cat-cursor">
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
                  <main className="pt-6 pb-12 cat-cursor">
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
                  <main className="pt-6 pb-12 cat-cursor">
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
                  <main className="pt-6 pb-12 cat-cursor">
                    <EditPostPage />
                  </main>
                </>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <>
                  <Header onThemeToggle={toggleDarkMode} isDarkMode={isDarkMode} />
                  <main className="pt-6 pb-12">
                    <ProfilePage />
                  </main>
                </>
              </AuthGuard>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="py-6 bg-coffee-100 dark:bg-coffee-800 border-t border-coffee-200 dark:border-coffee-700">
          <div className="container mx-auto px-4 text-center text-sm text-coffee-500 dark:text-coffee-400">
            &copy; {new Date().getFullYear()} CatChat - Share your purr-fect moments with the world
          </div>
        </footer>
      </BrowserRouter>
    </div>
  )
}

export default App
