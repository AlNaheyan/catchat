"use client"

import { useState } from "react"
import { signIn, signUp } from "../utils/api"
import { Cat } from "lucide-react"

export const AuthForm = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { user, error } = isSignUp ? await signUp(email, password) : await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      if (user) {
        onSuccess(user)
      } else if (isSignUp) {
        // For sign up, Supabase sends a confirmation email
        setError("Please check your email for a confirmation link")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f5f0e8] dark:bg-[#3c3228] p-6 rounded-lg shadow-md max-w-md w-full border border-[#e6d7c3] dark:border-[#4d3f33]">
      <div className="flex justify-center mb-6">
        <div className="bg-[#d4b996] dark:bg-[#8c7158] p-3 rounded-full">
          <Cat className="w-10 h-10 text-[#6f4e37] dark:text-[#f5f0e8]" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#6f4e37] dark:text-[#e6d7c3] mb-6 text-center">
        {isSignUp ? "Create a CatChat account" : "Sign in to CatChat"}
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#6f4e37] dark:text-[#d4b996] mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#6f4e37] dark:text-[#d4b996] mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#d4b996] dark:border-[#8c7158] rounded-lg bg-[#fff9f0] dark:bg-[#2c241e] text-[#6f4e37] dark:text-[#e6d7c3] focus:outline-none focus:ring-2 focus:ring-[#d4b996]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-[#a67c52] text-white rounded-lg hover:bg-[#8c6142] focus:outline-none focus:ring-2 focus:ring-[#d4b996] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[#a67c52] dark:text-[#d4b996] hover:underline text-sm"
        >
          {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}
