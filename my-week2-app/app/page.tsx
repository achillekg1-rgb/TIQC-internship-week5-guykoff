"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md px-6">
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Welcome</h1>
            <p className="text-lg text-muted-foreground">Manage your account securely</p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/login" className="block">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/signup" className="block">
              <button className="w-full bg-transparent border-2 border-border text-foreground hover:bg-muted font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                Create Account
              </button>
            </Link>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Secure authentication with light and dark mode support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
