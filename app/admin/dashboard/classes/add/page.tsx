"use client";

import { useState } from 'react';
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
  Save,
  X,
  Type,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClass } from '@/app/api';

export default function AddClassPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Updated form state to use title instead of subject_name
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API error when form is modified
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Class title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      console.log("Submitting class data:", formData);
      const response = await createClass(formData);
      console.log("Class creation response:", response);
      
      if (response && !response.error) {
        // If successful, redirect to classes page
        router.push('/admin/dashboard/classes');
      } else {
        // Handle API error response
        setApiError(response?.message || 'Failed to create class. Please try again.');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      setApiError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
              href="/admin/dashboard/students"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 ${activeTab === 'students' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users className="h-5 w-5" />
              {isSidebarOpen && <span>Students</span>}
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
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard/classes" className="p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Add New Class</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="p-6">
          {apiError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
              <div className="flex items-start">
                <X className="h-5 w-5 mr-2" />
                <span>{apiError}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">Class Information</h2>
              <p className="mt-1 text-sm text-gray-600">Fill in the details to create a new class</p>
            </div>
            
            <div className="px-6 py-4">
              {/* Class Title */}
              <div className="max-w-md">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Class Title <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Type className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`block w-full rounded-md border ${errors.title ? 'border-red-300' : 'border-gray-300'} pl-10 pr-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                    placeholder="e.g. Class 10, Class 12, etc."
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              {/* Description - Optional */}
              <div className="mt-6 max-w-md">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                  placeholder="Enter a description for this class (optional)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <Link
                href="/admin/dashboard/classes"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Link>
              <button
                type="submit"
                className={`inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
