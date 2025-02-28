"use client";

import { useState, useEffect } from "react";
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
  Search,
  Menu,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Clock,
  Youtube,
  FileText,
  ExternalLink,
  Eye
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

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchChaptersData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getchapter();
      
      if (!response) {
        throw new Error("No response received from the API");
      }
      
      if (response.ok === false) {
        throw new Error(`Failed to fetch chapters: ${response.statusText || 'Unknown error'}`);
      }
      
      let responseData;
      try {
        if (typeof response.json === 'function') {
          responseData = await response.json();
        } else {
          responseData = response;
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Failed to parse API response");
      }
      
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setChapters(responseData.data);
      } else if (Array.isArray(responseData)) {
        setChapters(responseData);
      } else if (responseData && typeof responseData === 'object' && responseData._id) {
        setChapters([responseData]);
      } else {
        setChapters([]);
        setError("Received data in an unexpected format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching chapters");
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChaptersData();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Filter chapters based on search query
  const filteredChapters = chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-gray-800">Learning Chapters</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search chapters..." 
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 rounded-full bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <Link
                href="/test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create New Summary</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Refresh button */}
          <div className="mb-6 flex justify-end">
            <button 
              onClick={fetchChaptersData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {loading && !error ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredChapters.length === 0 && !error ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No chapters found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'No chapters match your search criteria' : 'Create your first chapter by summarizing a video'}
              </p>
              <Link
                href="/test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create New Summary</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredChapters.map((chapter) => (
                <div key={chapter._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                      {/* Make the chapter title clickable */}
                      <Link href={`/chapters/${chapter._id}`}>
                        <h2 className="text-xl font-semibold text-gray-800 hover:text-purple-600 transition-colors">{chapter.title}</h2>
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(chapter.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* YouTube Links */}
                    {Array.isArray(chapter.yt_links) && chapter.yt_links.length > 0 && (
                      <div className="mb-6 space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Youtube className="h-5 w-5 text-red-600" />
                          <h3 className="text-lg font-medium text-gray-800">Video Resources</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {chapter.yt_links.map((link, idx) => {
                            const embedUrl = getYouTubeEmbedUrl(link.url);
                            return (
                              <div key={idx} className="border rounded-lg overflow-hidden">
                                {embedUrl ? (
                                  <div className="aspect-video">
                                    <iframe
                                      className="w-full h-full"
                                      src={embedUrl}
                                      title={link.title}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                    <div className="text-gray-400">Video not available</div>
                                  </div>
                                )}
                                <div className="p-4">
                                  <h4 className="font-medium mb-2">{link.title}</h4>
                                  <p className="text-gray-600 text-sm mb-3">{link.description}</p>
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Open on YouTube
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Chapter Content Preview */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-medium text-gray-800">Content Summary</h3>
                      </div>
                      <div className="prose max-w-none line-clamp-3 mb-4">
                        <div dangerouslySetInnerHTML={{ __html: chapter.content?.replace(/\n/g, '<br/>') || 'No content available' }} />
                      </div>
                      
                      {/* Add View Details Button */}
                      <div className="mt-4 flex justify-end">
                        <Link 
                          href={`/chapters/${chapter._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Full Chapter</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
