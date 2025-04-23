"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCurrentUser, signOut } from "../utils/api"
import { Menu, X, LogOut, User, Moon, Sun, Cat } from "lucide-react"

export const Header = ({ onThemeToggle, isDarkMode }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    const success = await signOut()
    if (success) {
      setUser(null)
      navigate("/auth")
    }
  }

  return (
    <header className="bg-[#f5f0e8] dark:bg-[#3c3228] shadow-sm border-b border-[#e6d7c3] dark:border-[#4d3f33]">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#6f4e37] dark:text-[#d4b996]">
            <Cat className="w-6 h-6" />
            <span>CatChat</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={onThemeToggle}
              className="p-2 text-[#8c7158] dark:text-[#d4b996] hover:text-[#6f4e37] dark:hover:text-[#e6d7c3] rounded-full hover:bg-[#e6d7c3] dark:hover:bg-[#4d3f33] cursor-pointer"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center gap-2 text-sm font-medium text-[#6f4e37] dark:text-[#d4b996] hover:text-[#a67c52] dark:hover:text-[#e6d7c3] cursor-pointer"
                    >
                      <span>{user.username ?? user.email}</span>
                      {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#f5f0e8] dark:bg-[#3c3228] rounded-md shadow-lg py-1 z-10 border border-[#e6d7c3] dark:border-[#4d3f33]">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6f4e37] dark:text-[#d4b996] hover:bg-[#e6d7c3] dark:hover:bg-[#4d3f33]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut()
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6f4e37] dark:text-[#d4b996] hover:bg-[#e6d7c3] dark:hover:bg-[#4d3f33] w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-[#a67c52] text-white rounded-lg hover:bg-[#8c6142] transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
