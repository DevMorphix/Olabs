"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AVAILABLE_LANGUAGES } from "@/lib/youtube"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Youtube, Headphones, Subtitles, Archive, BookOpen } from "lucide-react"
import { use } from "react"
import ReactMarkdown from 'react-markdown'
import { createchapter } from "@/app/api/index"

interface ProcessingStatus {
  currentChunk: number;
  totalChunks: number;
  stage: 'analyzing' | 'processing' | 'finalizing' | 'saving';
  message: string;
}

function urlSafeBase64Decode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4
  const paddedBase64 = pad ? base64 + "=".repeat(4 - pad) : base64
  return atob(paddedBase64)
}

interface PageProps {
  params: Promise<{ videoUrl: string }>
}

export default function SummaryPage({ params }: PageProps) {
  const [summary, setSummary] = useState<string>("")
  const [source, setSource] = useState<"youtube" | "cache" | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>({
    currentChunk: 0,
    totalChunks: 0,
    stage: 'analyzing',
    message: 'Analyzing video content...'
  })
  const [apiError, setApiError] = useState<string | null>(null);

  const searchParams = useSearchParams()
  const languageCode = searchParams.get("lang") || "en"
  const mode = (searchParams.get("mode") || "video") as "video" | "podcast"
  const aiModel = (searchParams.get("model") || "gemini") as "gemini" | "groq" | "gpt4"
  const classId = searchParams.get("class") || ""
  const subjectId = searchParams.get("subject") || ""
  const userTitle = searchParams.get("title") || ""
  const userDescription = searchParams.get("description") || ""
  const { videoUrl } = use(params)
  const router = useRouter()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        setError(null)
        setApiError(null)

        // Validate class and subject IDs before sending
        if (!classId || !subjectId) {
          throw new Error("Class ID and Subject ID are required");
        }

        const url = urlSafeBase64Decode(videoUrl)
        console.log("Sending request with:", {
          url,
          language: languageCode,
          mode,
          aiModel,
          class_id: classId,
          subject_id: subjectId,
          title: userTitle,
          description: userDescription
        });
        
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            language: languageCode,
            mode,
            aiModel,
            class_id: classId,
            subject_id: subjectId,
            title: userTitle,
            description: userDescription
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to generate summary")
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error("Failed to read response stream")
        }

        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          try {
            // Handle multiple JSON objects in a chunk by splitting by newline
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                console.log("Parsed chunk data:", data);

                if (data.type === 'progress') {
                  setStatus({
                    currentChunk: data.currentChunk,
                    totalChunks: data.totalChunks,
                    stage: data.stage,
                    message: data.message
                  });
                } else if (data.type === 'complete') {
                  console.log("Summary received:", {
                    summaryLength: data.summary?.length,
                    summaryPreview: data.summary?.substring(0, 100) + "...",
                    source: data.source,
                    warning: data.warning
                  });
                  
                  // Make sure summary is not null or undefined
                  if (!data.summary) {
                    console.error("Warning: Received empty summary from server");
                    setApiError("The server returned an empty summary.");
                  } else {
                    setSummary(data.summary);
                    setSource(data.source);
                    if (data.warning) {
                      setApiError(data.warning);
                    }
                  }
                  break;
                } else if (data.type === 'error') {
                  throw new Error(data.error || "An error occurred");
                }
              } catch (lineError) {
                console.warn("Could not parse line as JSON:", line);
              }
            }
          } catch (e) {
            console.error('Error processing chunk:', e, 'Chunk content:', chunk);
            setError('Failed to parse server response');
          }
        }
      } catch (err) {
        console.error("Error fetching summary:", err)
        setError(err instanceof Error ? err.message : "An error occurred while generating the summary")
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [videoUrl, languageCode, mode, aiModel, classId, subjectId, userTitle, userDescription])

  const displayLanguage =
    Object.entries(AVAILABLE_LANGUAGES).find(([_, code]) => code === languageCode)?.[0] || "English"

  const getSourceIcon = () => {
    switch (source) {
      case "youtube":
        return <Subtitles className="h-4 w-4" />
      case "cache":
        return <Archive className="h-4 w-4" />
      default:
        return null
    }
  }

  const getSourceDisplay = () => {
    switch (source) {
      case "youtube":
        return "YouTube subtitles"
      case "cache":
        return "Cached summary"
      default:
        return ""
    }
  }

  if (loading) {
    const progress = status.totalChunks ? (status.currentChunk / status.totalChunks) * 100 : 0

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Generating Summary</CardTitle>
            <CardDescription>Please wait while we process your video</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{status.message}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${status.stage === 'analyzing' ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <span className={status.stage === 'analyzing' ? 'text-primary' : 'text-muted-foreground'}>
                    Analyzing video content
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${status.stage === 'processing' ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <span className={status.stage === 'processing' ? 'text-primary' : 'text-muted-foreground'}>
                    Processing chunks ({status.currentChunk}/{status.totalChunks})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${status.stage === 'finalizing' ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <span className={status.stage === 'finalizing' ? 'text-primary' : 'text-muted-foreground'}>
                    Creating final summary
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${status.stage === 'saving' ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <span className={status.stage === 'saving' ? 'text-primary' : 'text-muted-foreground'}>
                    Saving to history
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-2xl font-bold flex items-center">
              {mode === "podcast" ? <Headphones className="mr-2" /> : <Youtube className="mr-2" />}
              {mode === "podcast" ? "Podcast-Style Summary" : "Video Summary"}
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{displayLanguage}</Badge>
              {source && (
                <Badge variant="outline" className="flex items-center">
                  {getSourceIcon()}
                  <span className="ml-1">{getSourceDisplay()}</span>
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-4">{error}</div>}
          {apiError && <div className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 px-4 py-3 rounded-md mb-4">
            <p className="font-medium">API Warning:</p>
            <p>{apiError}</p>
          </div>}

          {!error && summary ? (
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-400">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-500">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-400 pl-4 italic my-4 bg-purple-50 dark:bg-purple-900/20 py-2 pr-2 rounded-r">{children}</blockquote>
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    return inline ? (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto mb-4">
                        <code className="text-sm" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  em: ({ children }) => <em className="italic text-purple-600 dark:text-purple-400">{children}</em>,
                  strong: ({ children }) => <strong className="font-bold text-gray-800 dark:text-gray-200">{children}</strong>,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          ) : !error && (
            <div className="text-center text-muted-foreground py-8">
              No summary content available.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline"
            onClick={() => router.push('/main')}
          >
            Create Another Summary
          </Button>
          <Button 
            onClick={() => router.push('/chapters')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View All Chapters
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

