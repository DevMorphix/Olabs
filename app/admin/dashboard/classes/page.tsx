"use client";

import { useState, useEffect } from 'react';
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
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronRight,
  Download,
  Plus,
  Loader
} from 'lucide-react';
import Link from 'next/link';
import { GetClass } from '@/app/api';

// Interface for class data based on the actual API response
interface ClassData {
  _id: string;
  title: string;
  cource_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Additional fields we'll add for display purposes
  subject?: string;
  instructor?: string;
  schedule?: string;
  students?: number;
  status?: string;
}

export default function ClassesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await GetClass();
        
        if (response.error) {
          setError(response.message || 'Failed to fetch classes');
          return;
        }

        // Check if the response has data array according to the new format
        if (response.data && Array.isArray(response.data)) {
          console.log("API response data:", response.data);
          
          // Format the response data to match our display needs
          const formattedClasses = response.data.map((cls: any) => ({
            ...cls,
            // Use title as class_name for display
            class_name: cls.title,
            // Default values for missing fields
            subject: 'Unassigned',
            instructor: 'Not assigned',
            schedule: 'Not scheduled',
            students: 0,
            status: 'Active'
          }));
          
          setClasses(formattedClasses);
          setError(null);
        } else if (response.classes && Array.isArray(response.classes)) {
          // Fallback for previous API format
          const formattedClasses = response.classes.map((cls: any) => ({
            _id: cls._id,
            title: cls.class_name || cls.title,
            class_name: cls.class_name || cls.title,
            subject: cls.subject_name || 'Unassigned',
            instructor: cls.instructor || 'Not assigned',
            schedule: cls.schedule || 'Not scheduled',
            students: cls.students || 0,
            status: cls.status || 'Active'
          }));
          
          setClasses(formattedClasses);
          setError(null);
        } else {
          setError('Invalid response format from API');
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter classes based on search term and filters
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (cls.instructor && cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (cls.status && cls.status.toLowerCase() === statusFilter.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || 
                          (cls.subject && cls.subject.toLowerCase() === subjectFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Get unique subjects for filter
  const subjects = ['all', ...Array.from(new Set(classes
    .filter(cls => cls.subject)
    .map(cls => cls.subject!.toLowerCase())))];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
            <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search classes..." 
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

        {/* Main Classes Content */}
        <main className="p-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {/* Subject Filter */}
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <select
                  className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  {subjects.filter(subject => subject !== 'all').map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <Link href="/admin/dashboard/classes/add" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add New Class</span>
              </Link>
            </div>
          </div>

          {/* Classes Table */}
          <div className="bg-white rounded-lg shadow-sm">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader className="h-8 w-8 text-purple-600 animate-spin" />
                <span className="ml-2 text-gray-600">Loading classes...</span>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClasses.map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cls.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cls.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cls.cource_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(cls.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${cls.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {cls.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-3">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-900">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty state when no classes match filter */}
                {filteredClasses.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No classes found</h3>
                    <p className="mt-1 text-gray-500">
                      We couldn't find any classes matching your search criteria. Try adjusting your filters or search term.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setSubjectFilter('all');
                      }}
                      className="mt-4 inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredClasses.length}</span> of <span className="font-medium">{classes.length}</span> classes
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
