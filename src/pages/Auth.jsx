"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "../components/AuthForm"
import { getCurrentUser } from "../utils/api"
import { Cat } from "lucide-react"

export const AuthPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser()
      if (user) {
        navigate("/")
      }
    }

    checkUser()
  }, [navigate])

  const handleAuthSuccess = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fff9f0] dark:bg-[#2c241e]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-[#d4b996] dark:bg-[#8c7158] p-4 rounded-full">
              <Cat className="w-12 h-12 text-[#6f4e37] dark:text-[#f5f0e8]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#6f4e37] dark:text-[#d4b996] mb-2">CatChat</h1>
          <p className="text-[#8c7158] dark:text-[#b39f85]">Share your purr-fect moments with fellow cat lovers</p>
        </div>
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  )
}
