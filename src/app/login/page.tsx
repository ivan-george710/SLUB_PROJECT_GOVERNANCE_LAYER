'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (isSignUp) {
      // Mock signup success
      router.push('/dashboard');
      return;
    }

    // Mock credentials check
    if (email !== "testuser@email.com" || password !== "password123") {
      setError("Invalid credentials. Try testuser@email.com / password123");
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-4 text-slate-200">
      
      {/* Top Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-cyan-400 mb-6">
          <Activity size={40} />
          <h1 className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            IRIS
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to SULB Insights AI</h2>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Secured & Unsecured Loan Business Analytics Assistant
        </p>
        <p className="text-slate-300">{isSignUp ? "Create an account" : "Sign in to your account"}</p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 shadow-2xl backdrop-blur-sm">
        <CardContent className="pt-6">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-900/30 border border-red-900 text-red-400 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                <Mail size={16} />
                Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-slate-300">
                <Lock size={16} />
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters" 
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
                required
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium py-2 h-auto"
            >
              <LogIn className="mr-2" size={18} />
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <p className="text-slate-400 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
        
        <p className="text-slate-500 text-xs text-center">
          Secure analytics for loan portfolio management
        </p>
      </div>

    </div>
  );
}
