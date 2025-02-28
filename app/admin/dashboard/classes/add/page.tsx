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
  Search,
  Menu,
  ChevronRight,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Save,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock subjects for dropdown
const mockSubjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Physics' },
  { id: 3, name: 'Chemistry' },
  { id: 4, name: 'Biology' },
  { id: 5, name: 'Computer Science' },
  { id: 6, name: 'English' },
];

// Mock instructors for dropdown
const mockInstructors = [
  { id: 1, name: 'Dr. Alan Smith' },
  { id: 2, name: 'Prof. Maria Johnson' },
  { id: 3, name: 'Dr. James Wilson' },
  { id: 4, name: 'Prof. Susan Miller' },
  { id: 5, name: 'Dr. Robert Chen' },
];

export default function AddClassPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    instructorId: '',
    description: '',
    schedule: '',
    startDate: '',
    endDate: '',
    capacity: '',
    location: '',
    status: 'active',
  });

  // Error state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Class title is required';
    }
    
    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }
    
    if (!formData.instructorId) {
      newErrors.instructorId = 'Instructor is required';
    }
    
    if (!formData.schedule.trim()) {
      newErrors.schedule = 'Schedule is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Here you would make an API call to create the class
      console.log('Submitting class data:', formData);
      
      // Simulate API call success
      setTimeout(() => {
        alert('Class created successfully!');
        router.push('/admin/dashboard/classes');
      }, 1000);
    } catch (error) {
      console.error('Error creating class:', error);
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
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">Class Information</h2>
              <p className="mt-1 text-sm text-gray-600">Fill in the details to create a new class</p>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Class Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Class Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                  placeholder="e.g. Introduction to Algebra"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              {/* Subject and Instructor Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="subjectId"
                      name="subjectId"
                      className={`block w-full rounded-md border ${errors.subjectId ? 'border-red-300' : 'border-gray-300'} pl-10 pr-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                      value={formData.subjectId}
                      onChange={handleChange}
                    >
                      <option value="">Select Subject</option>
                      {mockSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.subjectId && <p className="mt-1 text-sm text-red-600">{errors.subjectId}</p>}
                </div>
                
                <div>
                  <label htmlFor="instructorId" className="block text-sm font-medium text-gray-700">
                    Instructor <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="instructorId"
                      name="instructorId"
                      className={`block w-full rounded-md border ${errors.instructorId ? 'border-red-300' : 'border-gray-300'} pl-10 pr-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                      value={formData.instructorId}
                      onChange={handleChange}
                    >
                      <option value="">Select Instructor</option>
                      {mockInstructors.map(instructor => (
                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.instructorId && <p className="mt-1 text-sm text-red-600">{errors.instructorId}</p>}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                  placeholder="Provide a brief description of the class..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              {/* Schedule */}
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                  Schedule <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="schedule"
                    name="schedule"
                    className={`block w-full rounded-md border ${errors.schedule ? 'border-red-300' : 'border-gray-300'} pl-10 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                    placeholder="e.g. Mon, Wed 10:00-11:30 AM"
                    value={formData.schedule}
                    onChange={handleChange}
                  />
                </div>
                {errors.schedule && <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>}
              </div>
              
              {/* Start and End Date Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className={`block w-full rounded-md border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} pl-10 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className={`block w-full rounded-md border ${errors.endDate ? 'border-red-300' : 'border-gray-300'} pl-10 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
              </div>
              
              {/* Capacity and Location Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    className={`mt-1 block w-full rounded-md border ${errors.capacity ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm`}
                    placeholder="Maximum number of students"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                  {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                    placeholder="e.g. Room 101, Online, etc."
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
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
                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Class
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
