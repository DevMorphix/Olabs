"use client";
import { useState, useEffect } from 'react';
import { GraduationCap, Search, Menu, ChevronDown, ShoppingCart, Filter, Clock, Users } from 'lucide-react';
import { Getsubject } from '@/app/api/index';
import Link from 'next/link';  // Add this import for the Link component

// Mock data for subjects
const mockSubjects = [
  {
    id: 1,
    title: "Mathematics",
    description: "Algebra, Calculus, Geometry and more",
    image: "https://placehold.co/400x300/purple/white?text=Mathematics",
    studentsCount: 1432,
    lessonsCount: 24,
    difficulty: "Intermediate"
  },
  {
    id: 2,
    title: "Physics",
    description: "Mechanics, Thermodynamics, Electromagnetism and more",
    image: "https://placehold.co/400x300/blue/white?text=Physics",
    studentsCount: 1254,
    lessonsCount: 18,
    difficulty: "Advanced"
  },
  {
    id: 3,
    title: "Chemistry",
    description: "Organic Chemistry, Inorganic Chemistry, Biochemistry",
    image: "https://placehold.co/400x300/green/white?text=Chemistry",
    studentsCount: 986,
    lessonsCount: 20,
    difficulty: "Intermediate"
  },
  {
    id: 4,
    title: "Biology",
    description: "Genetics, Ecology, Cellular Biology and more",
    image: "https://placehold.co/400x300/red/white?text=Biology",
    studentsCount: 1120,
    lessonsCount: 22,
    difficulty: "Beginner"
  },
  {
    id: 5,
    title: "Computer Science",
    description: "Programming, Algorithms, Data Structures and more",
    image: "https://placehold.co/400x300/orange/white?text=CS",
    studentsCount: 1875,
    lessonsCount: 30,
    difficulty: "Advanced"
  },
  {
    id: 6,
    title: "English Literature",
    description: "Classic and Modern Literature, Poetry and Analysis",
    image: "https://placehold.co/400x300/teal/white?text=English",
    studentsCount: 965,
    lessonsCount: 15,
    difficulty: "Beginner"
  }
];

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [apiSubjects, setApiSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects from API
  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        const response = await Getsubject();
        console.log("API Response:", response);
        
        if (response && Array.isArray(response.data)) {
          setApiSubjects(response.data);
        } else {
          console.warn("Unexpected API response format:", response);
          // Fallback to mock data if API response format is unexpected
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects. Using mock data instead.");
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  // Use API data if available, otherwise fall back to mock data
  const subjectsToDisplay = apiSubjects.length > 0 ? apiSubjects : mockSubjects;

  const filteredSubjects = subjectsToDisplay.filter(subject => {
    const matchesSearch = subject.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        subject.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || subject.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const navItems = [
    { label: "Home", active: false, hasDropdown: true },
    { label: "Subjects", active: true, hasDropdown: true },
    { label: "Events", active: false, hasDropdown: true },
    { label: "Blog", active: false, hasDropdown: true },
    { label: "Pages", active: false, hasDropdown: true },
    { label: "Contact", active: false, hasDropdown: false },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F0A27]/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Olabs</span>
              </a>
              <button className="hidden items-center gap-2 rounded-md px-3 py-2 text-green-400 transition hover:bg-white/5 lg:flex">
                <Menu className="h-5 w-5" />
                <span>Explore</span>
              </button>
            </div>

            {/* Center */}
            <div className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className={`flex items-center gap-1 text-sm ${item.active ? "text-white" : "text-white/90 transition hover:text-white"}`}
                    >
                      {item.label}
                      {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              <button className="text-white/90 hover:text-white">
                <Search className="h-5 w-5" />
              </button>
              <button className="relative text-white/90 hover:text-white">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  0
                </span>
              </button>
              <div className="hidden items-center gap-4 sm:flex">
                <button className="text-sm text-white/90 transition hover:text-white">
                  Log in
                </button>
                <button
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0F0A27] transition hover:bg-white/90"
                >
                  Sign up
                </button>
              </div>
              <button className="text-white lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Available Subjects</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              Browse our collection of curriculum-aligned digital learning resources across multiple subjects
            </p>
            {error && <p className="mt-2 text-red-400">{error}</p>}
            {loading && <p className="mt-2 text-yellow-400">Loading subjects...</p>}
            {apiSubjects.length > 0 && <p className="mt-2 text-green-400">Successfully loaded {apiSubjects.length} subjects from API</p>}
          </div>

          {/* Search and Filters */}
          <div className="mb-12 flex flex-col gap-4 rounded-xl bg-white/5 p-6 backdrop-blur-md md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                placeholder="Search for subjects"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-white/70" />
                <span className="text-sm text-white/70">Difficulty:</span>
              </div>
              <select
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All" className="bg-[#0F0A27]">All Levels</option>
                <option value="Beginner" className="bg-[#0F0A27]">Beginner</option>
                <option value="Intermediate" className="bg-[#0F0A27]">Intermediate</option>
                <option value="Advanced" className="bg-[#0F0A27]">Advanced</option>
              </select>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading state
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse rounded-xl bg-white/5 overflow-hidden">
                  <div className="h-48 bg-white/10"></div>
                  <div className="p-6">
                    <div className="h-7 bg-white/10 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-white/5 rounded mb-4 w-4/5"></div>
                    <div className="h-px bg-white/10 my-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-white/5 rounded w-1/3"></div>
                      <div className="h-8 bg-purple-600/20 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredSubjects.map((subject) => (
                <div key={subject.id} className="group overflow-hidden rounded-xl bg-white/5 transition hover:bg-white/10">
                  <div className="relative">
                    <img 
                      src={subject.image || "https://placehold.co/400x300/purple/white?text=Subject"} 
                      alt={subject.title} 
                      className="h-48 w-full object-cover" 
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                      {subject.difficulty}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-white group-hover:text-purple-400">
                      {subject.title}
                    </h3>
                    <p className="mb-4 text-white/70">{subject.description}</p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-white/70">
                          <Users className="h-4 w-4" />
                          <span>{(subject.studentsCount || 0).toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-white/70">
                          <Clock className="h-4 w-4" />
                          <span>{subject.lessonsCount || 0} lessons</span>
                        </div>
                      </div>
                      <Link 
                        href={`/subject/${subject._id}`}
                        className="rounded-md bg-purple-600/20 px-3 py-1 text-sm font-medium text-purple-400 transition hover:bg-purple-600/30"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {!loading && filteredSubjects.length === 0 && (
            <div className="mx-auto my-16 max-w-md rounded-xl bg-white/5 p-8 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-white/30" />
              <h3 className="mb-2 text-xl font-semibold text-white">No subjects found</h3>
              <p className="text-white/70">
                We couldn't find any subjects that match your search criteria. Please try a different search term or filter.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Wave Divider */}
      <div className="mt-20">
        <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" className="fill-white">
          <path d="M0,32L60,37.3C120,43,240,53,360,48C480,43,600,21,720,16C840,11,960,21,1080,32C1200,43,1320,53,1380,58.7L1440,64L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
        </svg>
      </div>
    </div>
  );
}
