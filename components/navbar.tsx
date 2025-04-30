"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { GraduationCap, Menu, ChevronDown, X, Mail, Lock, User, Eye, EyeOff, BookOpen } from "lucide-react"
import { studentLogin, studentRegister, instructorLogin, instructorRegister } from "../app/api/index"

const Navbar: React.FC = () => {
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [activeTab, setActiveTab] = useState("student")
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    setIsLoggedIn(false)
  }

  const navItems = [
    { label: "Home", active: true, hasDropdown: false ,path: '/'},
    { label: "About", active: false, hasDropdown: false ,path: '/about'},
    { label: "News", active: false, hasDropdown: false , path: '/news'},
    { label: "subjects", active: false, hasDropdown: false, path: '/subject' },
    { label: "Contact", active: false, hasDropdown: false ,path: '/contact' },
    { label: "My Chapters", active: false, hasDropdown: false, path: '/chapters' },
  ];

  const handleOpenSignUp = () => {
    setShowSignUpModal(true)
    setShowSignInModal(false)
  }

  const handleOpenSignIn = () => {
    setShowSignInModal(true)
    setShowSignUpModal(false)
  }

  const handleCloseModals = () => {
    setShowSignUpModal(false)
    setShowSignInModal(false)
  }

  // Auth Modal Component
  const AuthModal: React.FC<{
    isSignUp: boolean
    onClose: () => void
    onSwitchMode: () => void
  }> = ({ isSignUp, onClose, onSwitchMode }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState("")

    // Use refs for form inputs
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const fullNameRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const data = {
        email: emailRef.current?.value || "",
        password: passwordRef.current?.value || "",
        username: fullNameRef.current?.value || "",
      }

      try {
        if (isSignUp) {
          const response = await (activeTab === "student" ? studentRegister(data) : instructorRegister(data))
          console.log(`${activeTab} registration response:`, response)
          localStorage.setItem("token", response.token);
          localStorage.setItem("user_id", response.data._id);
          setIsLoggedIn(true); // Add this line
          onClose(); // Close modal after successful signup
          if (response?.message) {
            setMessage(response.message)
          }
        } else {
          const response = await (activeTab === "student" ? studentLogin(data) : instructorLogin(data))
          console.log(`${activeTab} login response:`, response)
          localStorage.setItem("token", response.token);
          localStorage.setItem("user_id", response.data._id);
          setIsLoggedIn(true); // Add this line
          onClose(); // Close modal after successful login
          if (response?.message) {
            setActiveTab("/submit")
            setMessage(response.message)
          }
        }
      } catch (error) {
        console.error(isSignUp ? "Registration error:" : "Login error:", error)
        setMessage("An error occurred. Please try again.")
      }
    }

    return (
      <div className="fixed top-[350px] inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{isSignUp ? "Create an Account" : "Welcome Back"}</h2>
            <p className="mt-2 text-gray-600">
              {isSignUp ? "Join our learning community today" : "Sign in to continue your learning journey"}
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              className={`rounded-md py-2 text-sm font-medium transition ${
                activeTab === "student" ? "bg-white text-[#0F0A27] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`rounded-md py-2 text-sm font-medium transition ${
                activeTab === "instructor" ? "bg-white text-[#0F0A27] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("instructor")}
            >
              Instructor
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name - Sign Up Only */}
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    ref={fullNameRef}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailRef}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  ref={passwordRef}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password - Sign In Only */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Terms Agreement - Sign Up Only */}
            {isSignUp && (
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {message && <p className="text-purple-500 text-sm">{message}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Switch to Other Mode */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F0A27]/80 backdrop-blur-lg">
      {/* Rest of the navbar code... */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VidXplore</span>
            </a>
            <button className="hidden items-center gap-2 rounded-md px-3 py-2 text-green-400 transition hover:bg-white/5 lg:flex">
              <Menu className="h-5 w-5" />
              <span>Explore</span>
            </button>
          </div>

          {/* Center */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className={`flex items-center gap-1 text-sm text-white/90 transition hover:text-white ${
                      item.active ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                    {item.label === "My Chapters" && <BookOpen className="h-4 w-4 ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
  <div className="hidden items-center gap-4 sm:flex">
    {isLoggedIn ? (
      <button
        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        onClick={handleLogout}
      >
        Log out
      </button>
    ) : (
      <>
        <button className="text-sm text-white/90 transition hover:text-white" onClick={handleOpenSignIn}>
          Log in
        </button>
        <button
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0F0A27] transition hover:bg-white/90"
          onClick={handleOpenSignUp}
        >
          Sign up
        </button>
      </>
    )}
  </div>
  <button className="text-white lg:hidden">
    <Menu className="h-6 w-6" />
  </button>
</div>
        </div>
      </div>

      {/* Auth Modals */}
      {showSignUpModal && <AuthModal isSignUp={true} onClose={handleCloseModals} onSwitchMode={handleOpenSignIn} />}

      {showSignInModal && <AuthModal isSignUp={false} onClose={handleCloseModals} onSwitchMode={handleOpenSignUp} />}
    </nav>
  )
}

export default Navbar

