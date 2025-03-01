"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Youtube, BookOpen, ArrowRight, Loader2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { GetAllChapters } from "@/app/api/index"
import Navbar from "@/components/navbar"

interface YtLink {
  _id: string;
  title: string;
  url: string;
  description: string;
}

interface Chapter {
  _id: string;
  title: string;
  content: string;
  yt_links: YtLink[];
  class_details?: {
    _id: string;
    title: string;
  };
  subject_details?: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true)
      try {
        const response = await GetAllChapters()
        console.log("Chapters response:", response)
        
        if (response?.data) {
          setChapters(response.data)
        } else {
          setError("No chapters found")
        }
      } catch (err) {
        console.error("Error fetching chapters:", err)
        setError("Failed to load chapters")
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Your Chapters</h1>
          <p className="text-white/80">All your curriculum-aligned summaries in one place</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
          </div>
        ) : error ? (
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="py-10">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto text-white/40 mb-4" />
                <h3 className="text-xl font-medium mb-2">No chapters found</h3>
                <p className="text-white/60 mb-6">{error}</p>
                <Button 
                  onClick={() => router.push('/main')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Your First Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Card key={chapter._id} className="bg-white/5 border-white/10 text-white overflow-hidden hover:bg-white/10 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-white">{chapter.title}</CardTitle>
                  <CardDescription className="text-white/60">
                    {formatDate(chapter.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">{truncateText(chapter.content, 150)}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {chapter.class_details && (
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {chapter.class_details.title}
                      </Badge>
                    )}
                    {chapter.subject_details && (
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {chapter.subject_details.title}
                      </Badge>
                    )}
                  </div>
                  
                  {chapter.yt_links && chapter.yt_links.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Youtube className="h-4 w-4" />
                      <span>{chapter.yt_links.length} video source{chapter.yt_links.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-4">
                  <Button 
                    variant="link" 
                    className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                    onClick={() => router.push(`/chapter/${chapter._id}`)}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {chapter.yt_links && chapter.yt_links.length > 0 && (
                    <a 
                      href={chapter.yt_links[0].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto text-white/60 hover:text-white/90 flex items-center text-sm"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" /> Source
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
