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
  MessageSquare,
  X,
  ChevronRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  
  // Mock statistics data
  const stats = [
    { label: 'Total Students', value: '3,721', icon: Users, trend: '+12%', color: 'bg-blue-500' },
    { label: 'Total Courses', value: '48', icon: BookOpen, trend: '+5%', color: 'bg-purple-500' },
    { label: 'Total Classes', value: '186', icon: Video, trend: '+8%', color: 'bg-pink-500' },
    { label: 'Active Subjects', value: '26', icon: GraduationCap, trend: '+3%', color: 'bg-amber-500' },
  ];

  // Mock recent enrollments
  const recentEnrollments = [
    { id: 1, student: 'Emma Thompson', course: 'Advanced Mathematics', date: '2023-11-10', status: 'Completed' },
    { id: 2, student: 'James Wilson', course: 'Introduction to Physics', date: '2023-11-09', status: 'In Progress' },
    { id: 3, student: 'Sophia Garcia', course: 'English Literature', date: '2023-11-08', status: 'In Progress' },
    { id: 4, student: 'Liam Johnson', course: 'Computer Science Basics', date: '2023-11-07', status: 'Completed' },
    { id: 5, student: 'Noah Brown', course: 'Chemistry 101', date: '2023-11-06', status: 'Not Started' },
  ];

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
        <header className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 rounded-full bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-700">AD</span>
                </div>
                {isSidebarOpen && (
                  <div>
                    <span className="block text-sm font-medium">Admin User</span>
                    <span className="block text-xs text-gray-500">admin@olabs.edu</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link 
              href="/admin/dashboard/classes/add" 
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Video className="h-4 w-4" />
              <span>Add New Class</span>
            </Link>
            <Link 
              href="/admin/dashboard/subjects/add" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Add New Subject</span>
            </Link>
            <Link 
              href="/admin/dashboard/students/add" 
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Student</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="flex items-center text-sm font-medium text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Enrollments</h2>
              <Link href="/admin/dashboard/enrollments" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentEnrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.student}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enrollment.course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{enrollment.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${enrollment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              enrollment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
