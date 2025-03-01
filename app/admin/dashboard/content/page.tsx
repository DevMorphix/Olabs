"use client";

import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  BarChart3,
  BookmarkPlus,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronRight,
  Download,
  Plus,
  Loader,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { GetAllChapters } from '@/app/api';

// Interface for chapter data based on API response
interface ChapterData {
  _id: string;
  title: string;
  content?: string;
  class_id?: string;
  subject_id?: string;
  yt_links?: {
    title: string;
    url: string;
    description?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ContentPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setIsLoading(true);
        const response = await GetAllChapters();
        
        if (response.error) {
          setError(response.message || 'Failed to fetch chapters');
          return;
        }

        // Check if the response has chapters data
        if (response.data && Array.isArray(response.data)) {
          console.log("API chapters response:", response.data);
          setChapters(response.data);
          setError(null);
        } else if (response.chapters && Array.isArray(response.chapters)) {
          // Alternative response format
          setChapters(response.chapters);
          setError(null);
        } else {
          setError('Invalid response format from API');
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError('Failed to load chapters. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter chapters based on search term
  const filteredChapters = chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Truncate text for content preview
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return 'No content';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

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
            {isSidebarOpen && <span className="text-xl font-bold text-white">Olabs Admin</span>}
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
              <FileText className="h-5 w-5" />
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
              href="/admin/dashboard/content"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'content' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <BookmarkPlus className="h-5 w-5" />
              {isSidebarOpen && <span>Content</span>}
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
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search chapters..." 
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 rounded-full bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter dropdown could go here */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <Link href="/admin/dashboard/content/create" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Create New Chapter</span>
              </Link>
            </div>
          </div>

          {/* Chapters Grid or Table */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader className="h-8 w-8 text-purple-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading chapters...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-2">Error: {error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChapters.map((chapter) => (
                  <div key={chapter._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{chapter.title}</h3>
                    <div className="text-sm text-gray-500 mb-4">
                      {chapter.content ? (
                        <p>{truncateText(chapter.content)}</p>
                      ) : (
                        <p className="italic">No content description</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Created: {formatDate(chapter.createdAt)}</span>
                      <div className="flex gap-2">
                        <Link href={`/admin/dashboard/content/${chapter._id}`} className="p-1 text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/dashboard/content/${chapter._id}/edit`} className="p-1 text-purple-600 hover:text-purple-800">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {chapter.yt_links && chapter.yt_links.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-500">{chapter.yt_links.length} Video Resource{chapter.yt_links.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Empty state when no chapters match filter */}
              {filteredChapters.length === 0 && (
                <div className="py-12 text-center bg-white rounded-lg shadow-sm">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No chapters found</h3>
                  <p className="mt-1 text-gray-500">
                    We couldn't find any chapters matching your search criteria.
                  </p>
                  <Link
                    href="/admin/dashboard/content/create"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Create New Chapter
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!isLoading && !error && filteredChapters.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredChapters.length}</span> of <span className="font-medium">{chapters.length}</span> chapters
              </div>
              <nav className="flex items-center space-x-2">
                <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50" disabled>Previous</button>
                <button className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white">1</button>
                <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">Next</button>
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
