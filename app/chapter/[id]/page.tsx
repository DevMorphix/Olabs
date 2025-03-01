"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Youtube, BookOpen, ArrowLeft, Loader2, ExternalLink, Calendar, GraduationCap,
  FileText, MessageCircleQuestion, BookMarked, Award, RefreshCw, Send, Check, X
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { GetChapter } from "@/app/api/index"
import Navbar from "@/components/navbar"
import ReactMarkdown from 'react-markdown'
import { 
  generateChapterQuestions, 
  generateChapterReferences, 
  generateChapterEvaluation,
  askQuestionAboutChapter
} from "@/lib/gemini"

// Define interfaces
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
  description?: string; // Add description field
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

type Section = 'theory' | 'video' | 'questions' | 'references' | 'evaluation';

// Update the page props type
export default function ChapterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { id } = params
  
  // AI Content Generation States
  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const [questions, setQuestions] = useState<{question: string, answer: string, revealed: boolean}[]>([])
  const [generatingReferences, setGeneratingReferences] = useState(false)
  const [references, setReferences] = useState<{title: string, description: string, url: string}[]>([])
  const [generatingEvaluation, setGeneratingEvaluation] = useState(false)
  const [evaluation, setEvaluation] = useState<{question: string, options: string[], correctAnswer: number, explanation: string, selected: number | null}[]>([])
  
  // User question state
  const [userQuestion, setUserQuestion] = useState("")
  const [askingQuestion, setAskingQuestion] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true)
      try {
        const response = await GetChapter(id)
        console.log("Chapter response:", response)
        
        if (response?.data) {
          setChapter(response.data)
        } else {
          setError("Chapter not found")
        }
      } catch (err) {
        console.error("Error fetching chapter:", err)
        setError("Failed to load chapter")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchChapter()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }
  
  // Modified AI content generation functions using Gemini API
  const generateQuestions = async () => {
    if (!chapter?.content) return
    
    setGeneratingQuestions(true)
    
    try {
      const questions = await generateChapterQuestions(chapter.content, chapter.description)
      setQuestions(questions)
    } catch (error) {
      console.error("Error generating questions:", error)
      // Fallback to a basic question in case of API failure
      setQuestions([{
        question: "What are the main concepts covered in this chapter?",
        answer: "The API couldn't generate specific questions. Try again or review the chapter content directly.",
        revealed: false
      }])
    } finally {
      setGeneratingQuestions(false)
    }
  }
  
  const generateReferences = async () => {
    if (!chapter?.content) return
    
    setGeneratingReferences(true)
    
    try {
      const references = await generateChapterReferences(chapter.content, chapter.description)
      setReferences(references)
    } catch (error) {
      console.error("Error generating references:", error)
      // Fallback to a basic reference in case of API failure
      setReferences([{
        title: "General Reference Guide",
        description: "The API couldn't generate specific references. Try refreshing or search for resources related to this topic.",
        url: "https://scholar.google.com"
      }])
    } finally {
      setGeneratingReferences(false)
    }
  }
  
  const generateEvaluation = async () => {
    if (!chapter?.content) return
    
    setGeneratingEvaluation(true)
    
    try {
      const evaluationQuestions = await generateChapterEvaluation(chapter.content, chapter.description)
      setEvaluation(evaluationQuestions)
    } catch (error) {
      console.error("Error generating evaluation:", error)
      // Fallback to a basic question in case of API failure
      setEvaluation([{
        question: "Which concept is most central to this chapter?",
        options: [
          "Please try regenerating the quiz",
          "The API encountered an error",
          "Refresh the page and try again",
          "Contact support if the issue persists"
        ],
        correctAnswer: 0,
        explanation: "There was an error generating the quiz questions. Please try again.",
        selected: null
      }])
    } finally {
      setGeneratingEvaluation(false)
    }
  }
  
  const askQuestion = async () => {
    if (!userQuestion.trim() || !chapter?.content) return
    
    setAskingQuestion(true)
    setAiResponse(null)
    
    try {
      const response = await askQuestionAboutChapter(chapter.content, userQuestion, chapter.description)
      setAiResponse(response)
      setUserQuestion("")
    } catch (error) {
      console.error("Error asking question:", error)
      setAiResponse("Sorry, I encountered an error while processing your question. Please try again.")
    } finally {
      setAskingQuestion(false)
    }
  }

  const toggleRevealAnswer = (index: number) => {
    setQuestions(questions.map((q, i) => 
      i === index ? { ...q, revealed: !q.revealed } : q
    ))
  }

  const selectOption = (questionIndex: number, optionIndex: number) => {
    setEvaluation(evaluation.map((q, i) => 
      i === questionIndex ? { ...q, selected: optionIndex } : q
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0A27] font-sans flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-[#0F0A27] font-sans">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="py-10">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto text-white/40 mb-4" />
                <h3 className="text-xl font-medium mb-2">Chapter not found</h3>
                <p className="text-white/60 mb-6">{error || "The requested chapter could not be found"}</p>
                <Button 
                  onClick={() => router.push('/chapters')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Chapters
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <Button 
          variant="outline" 
          className="mb-6 border-white/20 text-black "
          onClick={() => router.push('/chapters')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Chapters
        </Button>
        
        <Card className="bg-white/5 border-white/10 text-white mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl text-white">{chapter.title}</CardTitle>
                {chapter.description && (
                  <p className="text-white/70 mt-2">{chapter.description}</p>
                )}
                <CardDescription className="text-white/60 flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-1" />{formatDate(chapter.createdAt)}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {chapter.class_details && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <GraduationCap className="mr-1 h-4 w-4" />
                    {chapter.class_details.title}
                  </Badge>
                )}
                {chapter.subject_details && (
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    <BookOpen className="mr-1 h-4 w-4" />
                    {chapter.subject_details.title}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Chapter content tabs */}
        <Tabs defaultValue="theory" className="w-full">
          <TabsList className="bg-white/5 border-white/10 mb-6 text-white">
            <TabsTrigger value="theory" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80">
              <FileText className="h-4 w-4 mr-2" /> Theory
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80">
              <Youtube className="h-4 w-4 mr-2" /> Video Content
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80"
              onClick={() => questions.length === 0 && generateQuestions()}
            >
              <MessageCircleQuestion className="h-4 w-4 mr-2" /> Q&A
            </TabsTrigger>
            <TabsTrigger 
              value="references" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80"
              onClick={() => references.length === 0 && generateReferences()}
            >
              <BookMarked className="h-4 w-4 mr-2" /> References
            </TabsTrigger>
            <TabsTrigger 
              value="evaluation" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80"
              onClick={() => evaluation.length === 0 && generateEvaluation()}
            >
              <Award className="h-4 w-4 mr-2" /> Evaluate Yourself
            </TabsTrigger>
          </TabsList>

          {/* Theory Content - Updated to ensure white text */}
          <TabsContent value="theory">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div 
                  className="prose prose-invert max-w-none text-white"
                  style={{
                    '--tw-prose-body': 'rgba(255, 255, 255, 0.9)',
                    '--tw-prose-headings': 'rgba(255, 255, 255, 1)',
                    '--tw-prose-lead': 'rgba(255, 255, 255, 0.8)',
                    '--tw-prose-links': 'rgba(147, 112, 219, 1)', /* purple */
                    '--tw-prose-bold': 'rgba(255, 255, 255, 1)',
                    '--tw-prose-counters': 'rgba(255, 255, 255, 0.7)',
                    '--tw-prose-bullets': 'rgba(255, 255, 255, 0.7)',
                    '--tw-prose-hr': 'rgba(255, 255, 255, 0.2)',
                    '--tw-prose-quotes': 'rgba(255, 255, 255, 0.9)',
                    '--tw-prose-quote-borders': 'rgba(255, 255, 255, 0.2)',
                    '--tw-prose-captions': 'rgba(255, 255, 255, 0.7)',
                    '--tw-prose-code': 'rgba(255, 255, 255, 1)',
                    '--tw-prose-pre-code': 'rgba(255, 255, 255, 0.9)',
                    '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.3)',
                    '--tw-prose-th-borders': 'rgba(255, 255, 255, 0.2)',
                    '--tw-prose-td-borders': 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <ReactMarkdown 
                    components={{
                      // Override components to ensure white text
                      h1: ({node, ...props}) => <h1 className="text-white" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-white" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-white" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-white" {...props} />,
                      h5: ({node, ...props}) => <h5 className="text-white" {...props} />,
                      h6: ({node, ...props}) => <h6 className="text-white" {...props} />,
                      p: ({node, ...props}) => <p className="text-white/90" {...props} />,
                      ul: ({node, ...props}) => <ul className="text-white/90" {...props} />,
                      ol: ({node, ...props}) => <ol className="text-white/90" {...props} />,
                      li: ({node, ...props}) => <li className="text-white/90" {...props} />,
                      a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="text-white/80 border-l-4 border-white/20" {...props} />,
                      code: ({node, ...props}) => <code className="text-white bg-white/10 rounded px-1" {...props} />
                    }}
                  >
                    {chapter.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Content */}
          <TabsContent value="video">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Video Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {chapter.yt_links && chapter.yt_links.length > 0 ? (
                  <div className="grid gap-6">
                    {chapter.yt_links.map((link) => {
                      const embedUrl = getYouTubeEmbedUrl(link.url);
                      return (
                        <Card key={link._id} className="bg-white/10 border-white/10">
                          {embedUrl && (
                            <div className="aspect-video w-full">
                              <iframe
                                className="w-full h-full"
                                src={embedUrl}
                                title={link.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h4 className="font-medium text-lg mb-2">{link.title}</h4>
                            <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 flex items-center text-sm mb-2"
                            >
                              {link.url} <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                            {link.description && <p className="text-sm text-white/70">{link.description}</p>}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Youtube className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-white/60">No video resources available for this chapter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Q&A Content */}
          <TabsContent value="questions">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Questions & Answers</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  onClick={generateQuestions}
                  disabled={generatingQuestions}
                >
                  {generatingQuestions ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {/* Ask a Question */}
                <Card className="bg-purple-900/20 border-purple-500/30 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Ask Your Own Question</CardTitle>
                    <CardDescription className="text-white/70">
                      Ask a specific question about this chapter's content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="Type your question about this chapter..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                        disabled={askingQuestion}
                      />
                      <Button 
                        onClick={askQuestion}
                        disabled={!userQuestion.trim() || askingQuestion}
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {askingQuestion ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {askingQuestion && (
                      <div className="mt-3 text-purple-300 text-sm flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing your question...
                      </div>
                    )}
                    
                    {aiResponse && (
                      <Card className="mt-4 bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-white/80 mb-2">AI Response:</h4>
                          <div className="text-white/80 text-sm whitespace-pre-line">
                            {aiResponse}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
                
                {generatingQuestions ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-4" />
                    <p className="text-white/60">Generating questions with AI...</p>
                  </div>
                ) : questions.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium text-white/90 mb-4">Common Questions</h3>
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-6 w-6 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-medium text-sm flex-shrink-0 mt-0.5">
                                Q
                              </div>
                              <div className="flex-1">
                                <p className="text-white/90 font-medium">{q.question}</p>
                                
                                {q.revealed ? (
                                  <div className="mt-3">
                                    <div className="flex items-start gap-3">
                                      <div className="h-6 w-6 rounded-full bg-green-900/50 flex items-center justify-center text-green-300 font-medium text-sm flex-shrink-0 mt-0.5">
                                        A
                                      </div>
                                      <div className="text-white/80">{q.answer}</div>
                                    </div>
                                    <Button 
                                      variant="link" 
                                      onClick={() => toggleRevealAnswer(index)}
                                      className="ml-9 text-purple-400 hover:text-purple-300 p-0 h-auto mt-2"
                                    >
                                      Hide answer
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="link" 
                                    onClick={() => toggleRevealAnswer(index)}
                                    className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-2"
                                  >
                                    Show answer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <MessageCircleQuestion className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-white/60">Click the "Regenerate" button to generate questions about this chapter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* References Content */}
          <TabsContent value="references">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Additional References</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  onClick={generateReferences}
                  disabled={generatingReferences}
                >
                  {generatingReferences ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {generatingReferences ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-4" />
                    <p className="text-white/60">Finding relevant references with AI...</p>
                  </div>
                ) : references.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {references.map((ref, index) => (
                      <Card key={index} className="bg-white/10 border-white/10">
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg text-white mb-2">{ref.title}</h3>
                          <p className="text-white/70 mb-4 text-sm">{ref.description}</p>
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Resource
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-white/60 mb-4">Click the "Regenerate" button to find relevant references for this chapter</p>
                    <Button 
                      onClick={generateReferences}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Generate References
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation Content */}
          <TabsContent value="evaluation">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Evaluate Your Understanding</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  onClick={generateEvaluation}
                  disabled={generatingEvaluation}
                >
                  {generatingEvaluation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" /> New Quiz
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {generatingEvaluation ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-4" />
                    <p className="text-white/60">Creating quiz questions with AI...</p>
                  </div>
                ) : evaluation.length > 0 ? (
                  <div className="space-y-6">
                    {evaluation.map((question, qIndex) => (
                      <Card key={qIndex} className="bg-white/10 border-white/10 overflow-hidden">
                        <div className="bg-white/5 px-4 py-3 border-b border-white/10">
                          <h3 className="font-medium text-white">Question {qIndex + 1}</h3>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-white/90 mb-4">{question.question}</p>
                          
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, oIndex) => {
                              const isSelected = question.selected === oIndex;
                              const isCorrect = question.selected === question.correctAnswer;
                              const isCorrectAnswer = oIndex === question.correctAnswer;
                              
                              // Only show feedback colors if an option is selected
                              let optionClass = "border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer ";
                              
                              if (question.selected !== null) {
                                if (isCorrectAnswer) {
                                  optionClass += "bg-green-900/20 border-green-500/30 text-green-300";
                                } else if (isSelected && !isCorrect) {
                                  optionClass += "bg-red-900/20 border-red-500/30 text-red-300";
                                } else {
                                  optionClass += "bg-white/5 border-white/10 text-white/80";
                                }
                              } else {
                                optionClass += "hover:bg-white/10 border-white/10 text-white/80";
                              }
                              
                              return (
                                <div 
                                  key={oIndex} 
                                  className={optionClass}
                                  onClick={() => question.selected === null && selectOption(qIndex, oIndex)}
                                >
                                  <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'bg-purple-600 border-purple-500' : 'border-white/40'
                                  }`}>
                                    {isSelected && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <div className="flex-1 text-white/90">{option}</div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {question.selected !== null && (
                            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                              <h4 className="text-white/90 font-medium mb-2">Explanation</h4>
                              <p className="text-white/70 text-sm">{question.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-white/60 mb-4">Click the "New Quiz" button to generate evaluation questions for this chapter</p>
                    <Button 
                      onClick={generateEvaluation}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Generate Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
