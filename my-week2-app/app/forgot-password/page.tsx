"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          </div>

          {!submitted ? (
            <>
              {/* Description */}
              <p className="text-center text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-md disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
                  <p className="text-muted-foreground text-sm mt-2">We've sent a password reset link to {email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
                className="w-full px-4 py-2 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-md transition-colors"
              >
                Send Another Link
              </button>
            </>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">Back to login?</span>
            </div>
          </div>

          {/* Back to login link */}
          <Link href="/login" className="block">
            <button className="w-full px-4 py-2 border border-border hover:bg-muted text-foreground bg-transparent rounded-md transition-colors font-semibold flex items-center justify-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Sign In</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
