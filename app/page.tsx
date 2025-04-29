"use client";

import type React from "react";
import { useState } from "react";
import {
  GraduationCap,
  Menu,
  ChevronDown,
  Search,
  ShoppingCart,
  Play,
  BookOpen,
  Briefcase,
  Award,
  Library,
  Star,
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import olabsboy from "../public/assets/olabsboy.svg";

import {
  studentRegister,
  instructorRegister,
  studentLogin,
  instructorLogin,
} from "./api/index";
import Navbar from "../components/navbar";
import TopCategories from "@/components/topsubjects";
import TestimonialCarouselAutoplay from "@/components/testimonial";
import WhyLearnSection from "@/components/whychoose";
import Footer from "@/components/footer"
import Image from "next/image";

export default function EducratLanding() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string>("");

  const navItems = [
    { label: "Home", active: true, hasDropdown: false },
    { label: "About", active: false, hasDropdown: false },
    { label: "Events", active: false, hasDropdown: false },
    { label: "Blog", active: false, hasDropdown: false },
    { label: "Pages", active: false, hasDropdown: false },
    { label: "Contact", active: false, hasDropdown: false },
  ];

  const handleOpenSignUp = () => {
    setShowSignUpModal(true);
    setShowSignInModal(false);
  };

  const handleOpenSignIn = () => {
    setShowSignInModal(true);
    setShowSignUpModal(false);
  };

  const handleCloseModals = () => {
    setShowSignUpModal(false);
    setShowSignInModal(false);
  };

  // Auth Modal Component
  interface AuthModalProps {
    isSignUp: boolean;
    onClose: () => void;
    onSwitchMode: () => void;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("activeTab", activeTab);

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    console.log("Form data:", data);

    try {
      if (activeTab === "student") {
        const response = await studentLogin(data);
        console.log("student response", response.data._id);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_id", response.data._id);
      } else if (activeTab === "instructor") {
        const response = await instructorLogin(data);
        const message = response.message;
        setMessage(message);
        console.log("instructor response", response);
      
      }
      // const response = await studentRegister(data)
      // console.log("response", response)
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const hanldeRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("activeTab", activeTab);

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("fullName") as string,
    };

    console.log("Form data:", data);

    try {
      if (activeTab === "student") {
        const response = await studentRegister(data);
        console.log("student response", response);
      } else if (activeTab === "instructor") {
        const response = await instructorRegister(data);
        const message = response.message;
        setMessage(message);
        console.log("instructor response", response);
      }
      // const response = await studentRegister(data)
      // console.log("response", response)
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const AuthModal: React.FC<AuthModalProps> = ({
    isSignUp,
    onClose,
    onSwitchMode,
  }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
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
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp
                ? "Join our learning community today"
                : "Sign in to continue your learning journey"}
            </p>
          </div>

          {/* User Type Selection -  */}

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
            <button
              className={`rounded-md py-2 text-sm font-medium transition ${
                activeTab === "student"
                  ? "bg-white text-[#0F0A27] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student
            </button>
            <button
              className={`rounded-md py-2 text-sm font-medium transition ${
                activeTab === "instructor"
                  ? "bg-white text-[#0F0A27] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("instructor")}
            >
              Instructor
            </button>
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={isSignUp ? hanldeRegistration : handleLogin}
          >
            {/* Full Name - Sign Up Only */}
            {isSignUp && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
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
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your full name"
                    defaultValue={fullName}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
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
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Enter your email"
                  defaultValue={email}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
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
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder={ 
                    isSignUp ? "Create a password" : "Enter your password"
                  }
                  defaultValue={password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
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
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500"
                >
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
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}
            <p className="text-purple-500 text-sm">{message}</p>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-gray-500">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
           */}
          {/* Social Login */}
          {/* <div className="grid grid-cols-4 gap-3">
            <button className="flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-50">
              <Google className="h-5 w-5 text-gray-700" />
            </button>
            <button className="flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-50">
              <Facebook className="h-5 w-5 text-blue-600" />
            </button>
            <button className="flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-50">
              <Twitter className="h-5 w-5 text-blue-400" />
            </button>
            <button className="flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-50">
              <Linkedin className="h-5 w-5 text-blue-700" />
            </button>
          </div> */}

          {/* Switch to Other Mode */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
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
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Auth Modals */}
      {showSignUpModal && (
        <AuthModal
          isSignUp={true}
          onClose={handleCloseModals}
          onSwitchMode={handleOpenSignIn}
        />
      )}

      {showSignInModal && (
        <AuthModal
          isSignUp={false}
          onClose={handleCloseModals}
          onSwitchMode={handleOpenSignUp}
        />
      )}

      {/* Hero Section */}
      <main className="relative pt-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 py-16 lg:grid-cols-2 lg:py-24">
            {/* Left Column */}
            <div className="relative z-10">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Curriculum-Aligned
                <br />
                <span className="mt-2 flex items-baseline gap-2">
                  <span className="relative">
                    <span className="relative z-10 text-green-400">
                      Digital Learning Resources
                    </span>
                    {/* <span className="absolute bottom-2 left-0 z-0 h-7 w-full bg-green-400/20"></span> */}
                  </span>
                </span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-white/80">
                Build skills with courses, certificates, and degrees online from
                world-class universities and companies.
              </p>
              <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                <button
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                  onClick={handleOpenSignUp}
                >
                  Join For Free
                </button>
                <button className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/5">
                  Find Courses
                </button>
              </div>
              <div className="flex flex-col gap-6 text-white/80 sm:flex-row">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-sm">Over 12 million students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  <span className="text-sm">More than 60,000 courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">Learn anything online</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              {/* Floating Cards */}
              <div className="absolute left-0 top-8 z-20 animate-float">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-lg">
                  <div className="rounded-full bg-orange-100 p-3">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">100 +</div>
                    <div className="text-sm text-white/70">Free Courses</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-32 z-20 animate-float-delay">
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
                  <Library  className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold">All courses</div>
                    {/* <div className="text-sm text-gray-500">UX/UI Designer</div> */}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-8 z-20 animate-float">
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Congrats!</div>
                    <div className="text-sm text-gray-500">
                      Your Admission Completed
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative mx-auto max-w-md">
                <img
                  src={olabsboy.src || "/placeholder.svg"}
                  alt="Student learning"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-1/4 top-20 text-yellow-500/20">
          <Star className="h-40 w-40" />
        </div>
        <div className="absolute bottom-40 left-1/4 text-yellow-500/20">
          <Star className="h-24 w-24" />
        </div>

        {/* Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 200"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-white"
          >
            <path d="M0,32L60,37.3C120,43,240,53,360,48C480,43,600,21,720,16C840,11,960,21,1080,32C1200,43,1320,53,1380,58.7L1440,64L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
          </svg>
        </div>
      </main>
      {/* <section className="bg-white">
        <p className="text-black flex font-bold items-center justify-center py-8">Our Backborns</p>
        <div className="container mx-auto px-4 flex  items-center py-4 text-gray-400 font-bold gap-3 justify-between">
          <Image src="../public/assets/moe.png" alt="" />
          <Image src="../public/assets/cdac.png" alt="" />
          <Image src="../public/assets/amrita-logo.png" alt="" />
          <Image src="../public/assets/meity.pn" alt="" />
        </div>
      </section> */}

      <section className="flex items-center justify-center bg-white text-black">
        {/* <p className="font-bold text-xl">Our Subjects</p> */}
        <TopCategories></TopCategories>

      </section>
      <section className="flex items-center justify-center bg-white text-black">
        {/* <p className="font-bold text-xl">Our Subjects</p> */}
        <TestimonialCarouselAutoplay></TestimonialCarouselAutoplay>

      </section>
      <section className="flex items-center justify-center bg-white text-black">
        {/* <p className="font-bold text-xl">Our Subjects</p> */}
        <WhyLearnSection></WhyLearnSection>
      </section>
      
      <section className=" bg-[#0F0A27]">
        <Footer></Footer>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 6s ease-in-out 2s infinite;
        }
      `}</style>
    </div>
  );
}
