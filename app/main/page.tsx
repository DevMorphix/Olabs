"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Youtube, Headphones, BookOpen, GraduationCap, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AVAILABLE_LANGUAGES, extractVideoId } from "@/lib/youtube"
import { ModelSelector } from "@/components/ModelSelector"
import { Getsubject, GetClass } from "@/app/api/index"
import Navbar from "@/components/navbar"

// Updated type definitions to match API response
type Subject = {
  _id: string;
  title: string; // Updated from 'name' to 'title'
  cource_id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type Class = {
  _id: string;
  title: string; // Updated from 'name' to 'title'
  cource_id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [language, setLanguage] = useState("English")
  const [mode, setMode] = useState<"video" | "podcast">("video")
  const [aiModel, setAiModel] = useState<"gemini" | "groq">("gemini")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch subjects and classes
        const subjectsResponse = await Getsubject()
        const classesResponse = await GetClass()
        
        console.log('Subjects response:', subjectsResponse)
        console.log('Classes response:', classesResponse)
        
        // Check for data in the format shown in the API response
        if (subjectsResponse?.data) {
          setSubjects(subjectsResponse.data)
        }
        
        if (classesResponse?.data) {
          setClasses(classesResponse.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClass || !selectedSubject) {
      alert("Please select both a class and subject")
      return
    }

    try {
      const videoId = extractVideoId(url)
      const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`
      const encodedUrl = btoa(cleanUrl).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
      const summaryUrl = `/summary/${encodedUrl}?lang=${AVAILABLE_LANGUAGES[language as keyof typeof AVAILABLE_LANGUAGES]}&mode=${mode}&model=${aiModel}&class=${selectedClass}&subject=${selectedSubject}`
      router.push(summaryUrl)
    } catch (error) {
      alert("Invalid YouTube URL. Please enter a valid YouTube URL.")
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative pt-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 py-16 lg:grid-cols-2 lg:py-24">
            {/* Left Column - Content Introduction */}
            <div className="relative z-10">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Curriculum-Aligned
                <br />
                <span className="mt-2 flex items-baseline gap-2">
                  <span className="relative">
                    <span className="relative z-10 text-green-400">
                      AI Summary Generator
                    </span>
                  </span>
                </span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-white/80">
                Transform educational YouTube content into curriculum-aligned summaries 
                tailored to your class and subject requirements.
              </p>
              <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                <button
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                  onClick={() => document.getElementById('summary-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </button>
                <button className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/5">
                  Learn More
                </button>
              </div>
              <div className="flex flex-col gap-6 text-white/80 sm:flex-row">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-sm">Curriculum-aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Youtube className="h-5 w-5" />
                  <span className="text-sm">YouTube to notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">Subject-specific insights</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="relative" id="summary-form">
              <div className="animate-float-delay">
                <Card className="w-full bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-white">olabs</CardTitle>
                    <CardDescription className="text-center text-white/80">Generate AI summaries for educational content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                        <span className="ml-2 text-white">Loading data...</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/90">YouTube URL</label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Search className="h-5 w-5 text-white/60" />
                            </div>
                            <Input
                              type="url"
                              value={url}
                              onChange={(e) => setUrl(e.target.value.replace(/^@/, ""))}
                              placeholder="https://youtube.com/watch?v=..."
                              required
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Class</label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select Class" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1E0F4D] text-white border-white/20">
                                {classes.map((classItem) => (
                                  <SelectItem key={classItem._id} value={classItem._id} className="text-white focus:bg-purple-700 focus:text-white">
                                    <div className="flex items-center">
                                      <GraduationCap className="mr-2 h-4 w-4" />
                                      <span>{classItem.title}</span> {/* Changed from name to title */}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Subject</label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1E0F4D] text-white border-white/20">
                                {subjects.map((subject) => (
                                  <SelectItem key={subject._id} value={subject._id} className="text-white focus:bg-purple-700 focus:text-white">
                                    <div className="flex items-center">
                                      <BookOpen className="mr-2 h-4 w-4" />
                                      <span>{subject.title}</span> {/* Changed from name to title */}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Language</label>
                            <Select value={language} onValueChange={setLanguage}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select Language" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1E0F4D] text-white border-white/20">
                                {Object.keys(AVAILABLE_LANGUAGES).map((lang) => (
                                  <SelectItem key={lang} value={lang} className="text-white focus:bg-purple-700 focus:text-white">
                                    {lang}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Mode</label>
                            <Select value={mode} onValueChange={(value) => setMode(value as "video" | "podcast")}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select Mode" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1E0F4D] text-white border-white/20">
                                <SelectItem value="video" className="text-white focus:bg-purple-700 focus:text-white">
                                  <div className="flex items-center">
                                    <Youtube className="mr-2 h-4 w-4" />
                                    <span>Video Summary</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="podcast" className="text-white focus:bg-purple-700 focus:text-white">
                                  <div className="flex items-center">
                                    <Headphones className="mr-2 h-4 w-4" />
                                    <span>Podcast Style</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/90">AI Model</label>
                          <div className="bg-white/10 rounded-lg p-0.5">
                            <ModelSelector
                              selectedModel={aiModel}
                              onModelChange={(model) => setAiModel(model as "gemini" | "groq")}
                              theme="dark"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                          Generate Summary
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        {/* <div className="absolute bottom-0 left-0 right-0 opacity-50 ">
          <svg
            viewBox="0 0 1440 200"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-white"
          >
            <path d="M0,32L60,37.3C120,43,240,53,360,48C480,43,600,21,720,16C840,11,960,21,1080,32C1200,43,1320,53,1380,58.7L1440,64L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
          </svg>
        </div> */}
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delay {
          0%, 100% {
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

        /* Add custom dropdown styles */
        [data-radix-popper-content-wrapper] {
          z-index: 50 !important;
        }

        .select-content {
          background-color: #1E0F4D !important;
          color: white !important;
        }

        [data-state="checked"] {
          color: white !important;
          background-color: #9333EA !important;
        }
      `}</style>
    </div>
  )
}

