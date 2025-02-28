"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Video,
  BarChart3,
  BookmarkPlus,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronRight,
  ArrowLeft,
  FileText,
  Youtube,
  MessageCircleQuestion,
  BookMarked,
  Award,
  Loader,
  AlertCircle,
  RefreshCw,
  Send,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import Link from "next/link";
import { getchapter } from "@/app/api/index";

interface YtLink {
  title: string;
  url: string;
  description: string;
}

interface Chapter {
  _id: string;
  title: string;
  content: string;
  yt_links: YtLink[];
  createdAt: string;
}

type Section = 'theory' | 'video' | 'questions' | 'references' | 'evaluation';

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [activeSection, setActiveSection] = useState<Section>('theory');
  
  // AI Content Generation States
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<{question: string, answer: string, revealed: boolean}[]>([]);
  const [generatingReferences, setGeneratingReferences] = useState(false);
  const [references, setReferences] = useState<{title: string, description: string, url: string}[]>([]);
  const [generatingEvaluation, setGeneratingEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState<{question: string, options: string[], correctAnswer: number, explanation: string, selected: number | null}[]>([]);
  
  // User question state
  const [userQuestion, setUserQuestion] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchChapter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch a specific chapter by ID
      // For this example, we're fetching all chapters and finding the one with matching ID
      const response = await getchapter();
      
      if (!response) {
        throw new Error("No response received from the API");
      }
      
      let chapters: Chapter[] = [];
      if (response.data && Array.isArray(response.data)) {
        chapters = response.data;
      } else if (Array.isArray(response)) {
        chapters = response;
      } else if (response && typeof response === 'object' && response._id) {
        chapters = [response];
      }
      
      const foundChapter = chapters.find(ch => ch._id === chapterId);
      if (!foundChapter) {
        throw new Error("Chapter not found");
      }
      
      setChapter(foundChapter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching the chapter");
      console.error("Error fetching chapter:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId]);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Mock AI content generation functions
  const generateQuestions = async () => {
    if (!chapter?.content) return;
    
    setGeneratingQuestions(true);
    
    try {
      // In a real app, this would call a Gemini API endpoint
      // For demo purposes, simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock questions based on chapter content
      const mockQuestions = [
        {
          question: "What are the main concepts covered in this chapter?",
          answer: "The main concepts include the key principles discussed in the text, focusing on the primary subject matter and its applications.",
          revealed: false
        },
        {
          question: "How does this relate to previous chapters or topics?",
          answer: "This builds upon fundamental concepts established earlier, extending the framework to incorporate new ideas and methodologies.",
          revealed: false
        },
        {
          question: "What are the practical applications of this knowledge?",
          answer: "This knowledge can be applied in various real-world scenarios, particularly in problem-solving contexts related to the subject matter.",
          revealed: false
        },
        {
          question: "Can you explain the most important insight from this material?",
          answer: "The most significant insight is the interconnected nature of the concepts presented and how they form a cohesive framework for understanding the subject.",
          revealed: false
        }
      ];
      
      setQuestions(mockQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setGeneratingQuestions(false);
    }
  };
  
  const generateReferences = async () => {
    if (!chapter?.content) return;
    
    setGeneratingReferences(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock references
      const mockReferences = [
        {
          title: "Foundations of Learning",
          description: "Comprehensive textbook covering fundamental concepts related to this subject area.",
          url: "https://example.com/book1"
        },
        {
          title: "Advanced Topics in Education",
          description: "In-depth exploration of complex ideas and theories mentioned in the chapter.",
          url: "https://example.com/book2"
        },
        {
          title: "Practical Applications Journal",
          description: "Journal article demonstrating real-world applications of these concepts.",
          url: "https://example.com/article1"
        },
        {
          title: "Video Tutorial Series",
          description: "Visual explanations of key concepts with practical examples.",
          url: "https://example.com/videos"
        }
      ];
      
      setReferences(mockReferences);
    } catch (error) {
      console.error("Error generating references:", error);
    } finally {
      setGeneratingReferences(false);
    }
  };
  
  const generateEvaluation = async () => {
    if (!chapter?.content) return;
    
    setGeneratingEvaluation(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock evaluation questions
      const mockEvaluation = [
        {
          question: "Which of the following best describes the main concept from this chapter?",
          options: [
            "A theoretical framework for understanding complex systems",
            "A historical perspective on educational development",
            "A practical guide for implementing learning strategies",
            "A comparative analysis of different methodologies"
          ],
          correctAnswer: 0,
          explanation: "The chapter primarily focuses on establishing a theoretical framework for understanding and analyzing complex systems within the subject area.",
          selected: null
        },
        {
          question: "What is the relationship between theory and practice as presented in this material?",
          options: [
            "They are completely separate domains with little overlap",
            "Theory precedes and informs practice",
            "Practice should drive theoretical development",
            "They exist in a reciprocal relationship of mutual influence"
          ],
          correctAnswer: 3,
          explanation: "The chapter emphasizes that theory and practice exist in a reciprocal relationship, with each informing and enhancing the other in an ongoing cycle.",
          selected: null
        },
        {
          question: "Which approach is recommended for applying these concepts in real-world situations?",
          options: [
            "Strict adherence to theoretical models",
            "Adaptive application based on context",
            "Prioritizing practical outcomes over theoretical consistency",
            "Avoiding application until complete mastery is achieved"
          ],
          correctAnswer: 1,
          explanation: "The chapter advocates for an adaptive approach that considers contextual factors when applying theoretical concepts to real-world situations.",
          selected: null
        }
      ];
      
      setEvaluation(mockEvaluation);
    } catch (error) {
      console.error("Error generating evaluation:", error);
    } finally {
      setGeneratingEvaluation(false);
    }
  };
  
  const askQuestion = async () => {
    if (!userQuestion.trim() || !chapter?.content) return;
    
    setAskingQuestion(true);
    setAiResponse(null);
    
    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response based on question
      const mockResponse = `Based on the chapter content, your question about "${userQuestion}" relates to key concepts discussed. 

The chapter explains that this topic involves understanding the fundamental principles and their applications in various contexts. It's important to consider how these ideas connect to the broader framework presented in the material.

For more specific details, you might want to review the section that discusses related concepts or check the recommended references for additional information.`;
      
      setAiResponse(mockResponse);
      setUserQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
      setAiResponse("Sorry, I encountered an error while processing your question. Please try again.");
    } finally {
      setAskingQuestion(false);
    }
  };

  const toggleRevealAnswer = (index: number) => {
    setQuestions(questions.map((q, i) => 
      i === index ? { ...q, revealed: !q.revealed } : q
    ));
  };

  const selectOption = (questionIndex: number, optionIndex: number) => {
    setEvaluation(evaluation.map((q, i) => 
      i === questionIndex ? { ...q, selected: optionIndex } : q
    ));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading chapter content...</p>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Failed to load chapter"}</p>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0F0A27] transition-all duration-300 ease-in-out flex flex-col h-full fixed`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 shrink-0">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold text-white">Olabs</span>}
          </Link>
          <button onClick={toggleSidebar} className="text-white p-1 hover:bg-white/5 rounded">
            {isSidebarOpen ? 
              <ChevronRight className="h-5 w-5" /> : 
              <Menu className="h-5 w-5" />
            }
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-grow">
          <div className="space-y-1">
            <Link 
              href="/admin/dashboard"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'dashboard' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="h-5 w-5" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link 
              href="/admin/dashboard/classes"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'classes' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              <Video className="h-5 w-5" />
              {isSidebarOpen && <span>Classes</span>}
            </Link>
            <Link 
              href="/admin/dashboard/subjects"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'subjects' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              <BookOpen className="h-5 w-5" />
              {isSidebarOpen && <span>Subjects</span>}
            </Link>
            <Link 
              href="/admin/dashboard/students"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'students' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users className="h-5 w-5" />
              {isSidebarOpen && <span>Students</span>}
            </Link>
            <Link 
              href="/chapters"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'content' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <BookmarkPlus className="h-5 w-5" />
              {isSidebarOpen && <span>Chapters</span>}
            </Link>
          </div>
          
          <div className="mt-10 space-y-1">
            <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 cursor-pointer ${activeTab === 'settings' ? 'bg-white/10' : ''}`}>
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span>Settings</span>}
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 cursor-pointer">
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span>Logout</span>}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/chapters"
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">{chapter.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-700">ST</span>
              </div>
            </div>
          </div>
        </header>

        {/* Learning Sections Tabs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              <button 
                onClick={() => setActiveSection('theory')}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeSection === 'theory' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-4 w-4" />
                Theory
              </button>
              <button 
                onClick={() => setActiveSection('video')}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeSection === 'video' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Youtube className="h-4 w-4" />
                Video Content
              </button>
              <button 
                onClick={() => {
                  setActiveSection('questions');
                  if (questions.length === 0) generateQuestions();
                }}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeSection === 'questions' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageCircleQuestion className="h-4 w-4" />
                Q&A
              </button>
              <button 
                onClick={() => {
                  setActiveSection('references');
                  if (references.length === 0) generateReferences();
                }}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeSection === 'references' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookMarked className="h-4 w-4" />
                References
              </button>
              <button 
                onClick={() => {
                  setActiveSection('evaluation');
                  if (evaluation.length === 0) generateEvaluation();
                }}
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeSection === 'evaluation' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="h-4 w-4" />
                Evaluate Yourself
              </button>
            </div>
          </div>
        </div>

        {/* Section Content */}
        <main className="p-6">
          {activeSection === 'theory' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory Content</h2>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: chapter.content?.replace(/\n/g, '<br/>') || 'No content available' }} />
              </div>
            </div>
          )}

          {activeSection === 'video' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Video Resources</h2>
              {Array.isArray(chapter.yt_links) && chapter.yt_links.length > 0 ? (
                <div className="space-y-8">
                  {chapter.yt_links.map((link, idx) => {
                    const embedUrl = getYouTubeEmbedUrl(link.url);
                    return (
                      <div key={idx} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video">
                          {embedUrl ? (
                            <iframe
                              className="w-full h-full"
                              src={embedUrl}
                              title={link.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <p className="text-gray-500">Video unavailable</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-medium mb-2">{link.title}</h3>
                          <p className="text-gray-600">{link.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                  <p className="text-gray-600">No video resources available for this chapter.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'questions' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Questions & Answers</h2>
                <button 
                  onClick={generateQuestions}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                  disabled={generatingQuestions}
                >
                  {generatingQuestions ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
              </div>
              
              {generatingQuestions ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Generating questions with AI...</p>
                </div>
              ) : questions.length > 0 ? (
                <div className="space-y-6">
                  {/* Ask a Question */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-800 mb-3">Ask Your Own Question</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="Type your question about this chapter..."
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={askingQuestion}
                      />
                      <button
                        onClick={askQuestion}
                        disabled={!userQuestion.trim() || askingQuestion}
                        className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {askingQuestion ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Ask
                      </button>
                    </div>
                    {askingQuestion && (
                      <div className="mt-3 text-purple-700 text-sm flex items-center gap-2">
                        <Loader className="h-3 w-3 animate-spin" />
                        Processing your question...
                      </div>
                    )}
                    {aiResponse && (
                      <div className="mt-4 bg-white p-4 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Response:</h4>
                        <div className="text-gray-700 text-sm whitespace-pre-line">
                          {aiResponse}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Generated Q&A */}
                  <h3 className="text-lg font-medium text-gray-700 mt-6">Common Questions</h3>
                  <div className="divide-y">
                    {questions.map((q, index) => (
                      <div key={index} className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium text-sm flex-shrink-0 mt-0.5">
                            Q
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">{q.question}</p>
                            
                            {q.revealed ? (
                              <div className="mt-3">
                                <div className="flex items-start gap-3">
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium text-sm flex-shrink-0 mt-0.5">
                                    A
                                  </div>
                                  <div className="text-gray-600">{q.answer}</div>
                                </div>
                                <button 
                                  onClick={() => toggleRevealAnswer(index)}
                                  className="ml-9 mt-2 text-sm text-purple-600 hover:text-purple-800"
                                >
                                  Hide answer
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => toggleRevealAnswer(index)}
                                className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                              >
                                Show answer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600">Click the "Regenerate" button to generate questions about this chapter.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'references' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Additional References</h2>
                <button 
                  onClick={generateReferences}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                  disabled={generatingReferences}
                >
                  {generatingReferences ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
              </div>
              
              {generatingReferences ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Finding relevant references with AI...</p>
                </div>
              ) : references.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {references.map((ref, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <h3 className="font-medium text-lg text-gray-800 mb-2">{ref.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{ref.description}</p>
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Resource
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BookMarked className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click the "Regenerate" button to find relevant references for this chapter.</p>
                  <button 
                    onClick={generateReferences}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Generate References
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'evaluation' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Evaluate Your Understanding</h2>
                <button 
                  onClick={generateEvaluation}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                  disabled={generatingEvaluation}
                >
                  {generatingEvaluation ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>New Quiz</span>
                    </>
                  )}
                </button>
              </div>
              
              {generatingEvaluation ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Creating quiz questions with AI...</p>
                </div>
              ) : evaluation.length > 0 ? (
                <div className="space-y-8">
                  {evaluation.map((question, qIndex) => (
                    <div key={qIndex} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b">
                        <h3 className="font-medium text-gray-800">Question {qIndex + 1}</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-800 mb-4">{question.question}</p>
                        
                        <div className="space-y-3 mb-6">
                          {question.options.map((option, oIndex) => {
                            const isSelected = question.selected === oIndex;
                            const isCorrect = question.selected === question.correctAnswer;
                            const isCorrectAnswer = oIndex === question.correctAnswer;
                            
                            // Only show feedback colors if an option is selected
                            let optionClass = "border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer ";
                            
                            if (question.selected !== null) {
                              if (isCorrectAnswer) {
                                optionClass += "bg-green-50 border-green-300";
                              } else if (isSelected && !isCorrect) {
                                optionClass += "bg-red-50 border-red-300";
                              } else {
                                optionClass += "bg-white border-gray-200";
                              }
                            } else {
                              optionClass += "hover:bg-gray-50 border-gray-200";
                            }
                            
                            return (
                              <div 
                                key={oIndex} 
                                className={optionClass}
                                onClick={() => question.selected === null && selectOption(qIndex, oIndex)}
                              >
                                <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-400'
                                }`}>
                                  {isSelected && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <span className="text-gray-800">{option}</span>
                                {question.selected !== null && isCorrectAnswer && (
                                  <Check className="ml-auto h-5 w-5 text-green-500" />
                                )}
                                {question.selected === oIndex && !isCorrect && (
                                  <X className="ml-auto h-5 w-5 text-red-500" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {question.selected !== null && (
                          <div className={`mt-4 p-4 rounded-lg ${
                            question.selected === question.correctAnswer ? 
                              'bg-green-50 border border-green-200 text-green-800' : 
                              'bg-red-50 border border-red-200 text-red-800'
                          }`}>
                            <div className="flex items-center gap-2 font-medium mb-2">
                              {question.selected === question.correctAnswer ? (
                                <>
                                  <Check className="h-5 w-5" />
                                  <span>Correct!</span>
                                </>
                              ) : (
                                <>
                                  <X className="h-5 w-5" />
                                  <span>Incorrect</span>
                                </>
                              )}
                            </div>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Results Summary */}
                  {evaluation.every(q => q.selected !== null) && (
                    <div className="bg-purple-50 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-semibold text-purple-800 mb-2">Quiz Results</h3>
                      <div className="text-4xl font-bold text-purple-700 mb-4">
                        {evaluation.filter(q => q.selected === q.correctAnswer).length} / {evaluation.length}
                      </div>
                      <p className="text-purple-700">
                        You answered {evaluation.filter(q => q.selected === q.correctAnswer).length} out of {evaluation.length} questions correctly.
                      </p>
                      <button 
                        onClick={generateEvaluation} 
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Try a New Quiz
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Take a quiz to test your understanding of the chapter content.</p>
                  <button 
                    onClick={generateEvaluation}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}