"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Youtube, Headphones, BookOpen, GraduationCap, Loader2, Search, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AVAILABLE_LANGUAGES, extractVideoId } from "@/lib/youtube"
import { ModelSelector } from "@/components/ModelSelector"
import { Getsubject, GetClass } from "@/app/api/index"
import Navbar from "@/components/navbar"

// Type definitions to match API response
type Subject = {
  _id: string;
  title: string;
  cource_id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type Class = {
  _id: string;
  title: string;
  cource_id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function ContentCreationPage() {
  // Core form state
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [userContent, setUserContent] = useState("")
  
  // Configuration options
  const [language, setLanguage] = useState("English")
  const [mode, setMode] = useState<"video" | "podcast">("video")
  const [aiModel, setAiModel] = useState<"gemini" | "groq">("gemini")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  
  // Data and UI states
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useManualContent, setUseManualContent] = useState(false)
  
  const router = useRouter()

  // Fetch classes and subjects data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const subjectsResponse = await Getsubject()
        const classesResponse = await GetClass()
        
        if (subjectsResponse?.data) {
          setSubjects(subjectsResponse.data)
        } else {
          setError("Failed to load subjects data")
        }
        
        if (classesResponse?.data) {
          setClasses(classesResponse.data)
        } else {
          setError("Failed to load classes data")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!title.trim()) {
      alert("Please enter a title for the content")
      return
    }

    if (!useManualContent && !url.trim()) {
      alert("Please enter a valid YouTube URL or provide manual content")
      return
    }

    if (useManualContent && !userContent.trim()) {
      alert("Please enter your content")
      return
    }

    if (!selectedClass) {
      alert("Please select a class")
      return
    }

    if (!selectedSubject) {
      alert("Please select a subject")
      return
    }

    try {
      if (useManualContent) {
        // TODO: Handle manual content submission
        // For now, we'll just show an alert
        alert("Manual content submission will be implemented soon!")
        return
      }
      
      // Process YouTube URL
      const videoId = extractVideoId(url)
      if (!videoId) {
        throw new Error("Invalid YouTube URL")
      }
      
      const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`
      const encodedUrl = btoa(cleanUrl).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
      
      const summaryUrl = `/summary/${encodedUrl}?lang=${AVAILABLE_LANGUAGES[language as keyof typeof AVAILABLE_LANGUAGES]}&mode=${mode}&model=${aiModel}&class=${selectedClass}&subject=${selectedSubject}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
      router.push(summaryUrl)
    } catch (error) {
      console.error("Processing error:", error)
      alert("Invalid YouTube URL. Please enter a valid YouTube URL.")
    }
  }

  // Helper functions
  const getClassName = (id: string) => {
    const classItem = classes.find(c => c._id === id)
    return classItem ? classItem.title : "Unknown Class"
  }
  
  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s._id === id)
    return subject ? subject.title : "Unknown Subject"
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-2xl font-bold">Create Educational Content</CardTitle>
                <CardDescription className="text-white/80">
                  Generate curriculum-aligned content from YouTube videos or create your own
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600 font-medium">Loading data...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Content Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Content Information</h3>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter a descriptive title"
                          className="border-gray-300"
                          required
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide a brief description of the content"
                          className="border-gray-300 h-24"
                        />
                      </div>
                    </div>
                    
                    {/* Content Source Section */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-800">Content Source</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="useManualContent"
                            checked={useManualContent}
                            onChange={(e) => setUseManualContent(e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="useManualContent" className="text-sm font-medium text-gray-700">
                            I want to write my own content
                          </label>
                        </div>
                      </div>

                      {!useManualContent ? (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">YouTube URL</label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Youtube className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="url"
                              value={url}
                              onChange={(e) => setUrl(e.target.value.replace(/^@/, ""))}
                              placeholder="https://youtube.com/watch?v=..."
                              className="pl-10 border-gray-300"
                              required={!useManualContent}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Your Content</label>
                          <div className="relative">
                            <Textarea
                              value={userContent}
                              onChange={(e) => setUserContent(e.target.value)}
                              placeholder="Enter your educational content here..."
                              className="border-gray-300 h-36"
                              required={useManualContent}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Curriculum Alignment Section */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-800">Curriculum Alignment</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Class</label>
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.length === 0 ? (
                                <SelectItem value="no-classes" disabled>No classes available</SelectItem>
                              ) : (
                                classes.map((classItem) => (
                                  <SelectItem key={classItem._id} value={classItem._id}>
                                    <div className="flex items-center">
                                      <GraduationCap className="mr-2 h-4 w-4 text-gray-500" />
                                      <span>{classItem.title}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Subject</label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.length === 0 ? (
                                <SelectItem value="no-subjects" disabled>No subjects available</SelectItem>
                              ) : (
                                subjects.map((subject) => (
                                  <SelectItem key={subject._id} value={subject._id}>
                                    <div className="flex items-center">
                                      <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                                      <span>{subject.title}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Processing Options (Only for YouTube videos) */}
                    {!useManualContent && (
                      <div className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-800">Processing Options</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Language</label>
                            <Select value={language} onValueChange={setLanguage}>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select Language" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(AVAILABLE_LANGUAGES).map((lang) => (
                                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Summary Style</label>
                            <Select value={mode} onValueChange={(value) => setMode(value as "video" | "podcast")}>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select Style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">
                                  <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>Standard Format</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="podcast">
                                  <div className="flex items-center">
                                    <Headphones className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>Conversational Style</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">AI Model</label>
                          <ModelSelector
                            selectedModel={aiModel}
                            onModelChange={(model) => setAiModel(model as "gemini" | "groq")}
                            theme="light"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading || (!url && !useManualContent) || (useManualContent && !userContent) || !selectedClass || !selectedSubject || !title}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `${useManualContent ? "Create Content" : "Generate Content"}`
                        )}
                      </Button>
                    </div>
                    
                    {selectedClass && selectedSubject && (
                      <div className="text-center text-gray-500 text-sm">
                        Content will be aligned with {getClassName(selectedClass)} - {getSubjectName(selectedSubject)}
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

