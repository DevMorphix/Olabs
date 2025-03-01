"use client";

import React from "react";
import {
  GraduationCap,
  Star,
  Briefcase,
  Award,
} from "lucide-react";
import olabsboy from "../../public/assets/olabsboy.svg";
import Navbar from "../../components/navbar"


function About() {
  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      {/* Navigation */}
      <Navbar />

      {/* About Section */}
      <main className="relative pt-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 py-16 lg:grid-cols-2 lg:py-24">
            {/* Left Column */}
            <div className="relative z-10">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                About Us
              </h1>
              <p className="mb-8 max-w-lg text-lg text-white/80">
                Online Labs (EzyLabs) is a virtual learning platform that provides students
                with interactive laboratory experiments in Physics, Chemistry, Biology,
                Mathematics, and English. Designed for students from classes 9 to 12, EzyLabs
                aligns with NCERT/CBSE and State Board syllabi, offering an engaging and
                accessible way to learn.
              </p>
              <p className="mb-8 max-w-lg text-lg text-white/80">
                Our platform includes simulations, animations, and self-evaluation tools,
                allowing students to conduct experiments from anywhere with just an
                internet connection. By eliminating the constraints of physical labs,
                EzyLabs ensures every learner has access to quality educational resources.
              </p>
              <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
                  Learn More
                </button>
                <button className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/5">
                  Contact Us
                </button>
              </div>
              <div className="flex flex-col gap-6 text-white/80 sm:flex-row">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-sm">Accessible anytime, anywhere</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-sm">NCERT/CBSE & State Board aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Enhancing STEM education</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative mx-auto max-w-md">
                <img
                  src={olabsboy.src || "/placeholder.svg"}
                  alt="About EzyLabs"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;
