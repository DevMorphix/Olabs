"use client";
import { useState, useEffect } from 'react';
import { GraduationCap, Search, Menu, ChevronDown, ShoppingCart, BookOpen, Clock, Users, ArrowLeft, Play, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import { getchapterbysubject, enrollCourse} from '@/app/api/index';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to perform this action?" 
}: ConfirmationModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-[#1A1333] p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        
        <p className="mb-6 text-white/80">{message}</p>
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

interface Chapter {
  _id: string;
  title: string;
  content: string;
  chapter_id: string;
  yt_links: {
    title: string;
    url: string;
    description: string;
  }[];
  class_id: {
    _id: string;
    title: string;
    course_id: string;
  };
  subject_id: string;
  createdAt: string;
  updatedAt: string;
}

export default function SubjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Confirmation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    onConfirm: () => {},
  });

  // Function to show confirmation dialog
  const showConfirmation = (config: any) => {
    setModalConfig({
      title: config.title || "Confirm Action",
      message: config.message || "Are you sure you want to proceed?",
      onConfirm: config.onConfirm || (() => {}),
    });
    setModalOpen(true);
  };

  // Example function for enrollment with API POST request
  const handleEnrollment = async () => {
    try {
      // API POST request would go here
      // Example: await enrollInSubject(params.id);
      const student_id = localStorage.getItem("user_id");     
      
      const data = {
        status: "started",
        chapter_id: chapters[0]?._id,
        student_id: student_id,
        mark: 0,
      }
      const response = await enrollCourse(data);
      console.log("API Response:", response);
      // Success message
      alert("Successfully enrolled in the subject!");
    } catch (err) {
      console.error("Error enrolling in subject:", err);
      alert("Failed to enroll. Please try again later.");
    }
  };

  // Fetch subject and chapters data
  useEffect(() => {
    async function fetchSubjectDetails() {
      try {
        setLoading(true);
        const response = await getchapterbysubject(params.id);
        console.log("API Response:", response);
        
        if (response && response.status === 200 && Array.isArray(response.data)) {
          // Since the response is an array of chapters, we'll extract subject info from the first chapter
          if (response.data.length > 0) {
            const firstChapter = response.data[0];
            
            // Create a subject object from available chapter data
            const subjectInfo = {
              _id: firstChapter.subject_id,
              title: "Subject Title", // Default since actual subject title isn't in the response
              class: firstChapter.class_id?.title || "Unknown Class",
              chapters: response.data.length
            };
            
            setSubject(subjectInfo);
            setChapters(response.data);
          } else {
            // No chapters found for this subject
            setSubject({ _id: params.id, title: "Subject", chapters: 0 });
            setChapters([]);
          }
        } else {
          setError("Failed to load subject details. Invalid response format.");
        }
      } catch (err) {
        console.error("Error fetching subject details:", err);
        setError("Failed to load subject details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchSubjectDetails();
    }
  }, [params.id]);

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
      <Navbar></Navbar>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          modalConfig.onConfirm();
          setModalOpen(false);
        }}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      {/* Main Content */}
      <main className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link 
            href="/subject" 
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Subjects
          </Link>

          {loading ? (
            <div className="mt-10 flex flex-col items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
              <p className="mt-4 text-lg text-white/70">Loading subject details...</p>
            </div>
          ) : error ? (
            <div className="mt-10 rounded-xl bg-red-500/10 p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold text-red-400">Error</h3>
              <p className="text-white/70">{error}</p>
              <button 
                onClick={() => router.push('/subject')}
                className="mt-4 rounded-lg bg-white/10 px-6 py-2 text-white hover:bg-white/20"
              >
                Return to Subjects
              </button>
            </div>
          ) : subject ? (
            <>
              {/* Subject Header */}
              <div className="rounded-xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 mb-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="h-32 w-32 overflow-hidden rounded-xl bg-purple-700 flex items-center justify-center">
                    {subject.image ? (
                      <img src={subject.image} alt={subject.title} className="h-full w-full object-cover" />
                    ) : (
                      <BookOpen className="h-16 w-16 text-white/50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                      {subject.title || "Subject Name"}
                    </h1>
                    <p className="mb-4 text-lg text-white/80 max-w-2xl">
                      {subject.description || "This subject contains educational resources and chapters."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-white/70">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>Class: {subject.class || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{chapters.length || 0} chapters</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-3">
                    <button 
                      className="rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white hover:bg-purple-700 transition w-full"
                      onClick={() => showConfirmation({
                        title: "Confirm Enrollment",
                        message: "Are you sure you want to enroll in this subject? This will submit a request to the server.",
                        onConfirm: handleEnrollment
                      })}
                    >
                      Enroll Now
                    </button>
                    <button className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 font-medium text-white hover:bg-white/10 transition w-full">
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Chapters Section */}
              <div className="mb-16">
                <h2 className="mb-6 text-2xl font-bold text-white">Chapters</h2>
                
                {chapters.length === 0 ? (
                  <div className="rounded-xl bg-white/5 p-8 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-white/30" />
                    <h3 className="mb-2 text-xl font-semibold text-white">No chapters available</h3>
                    <p className="text-white/70">
                      This subject doesn't have any chapters yet. Check back soon for updates.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chapters.map((chapter, index) => (
                      <div key={chapter._id} className="rounded-xl bg-white/5 p-6 transition hover:bg-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
                                <FileText className="h-5 w-5" />
                              </div>
                              <h3 className="font-semibold text-white text-lg">
                                {chapter.title || `Chapter ${index + 1}`}
                              </h3>
                            </div>
                            
                            {/* Content preview */}
                            {chapter.content && (
                              <p className="mt-2 ml-13 text-white/70">
                                {chapter.content.length > 100
                                  ? `${chapter.content.substring(0, 100)}...`
                                  : chapter.content}
                              </p>
                            )}

                            {/* YouTube Links preview */}
                            {chapter.yt_links && chapter.yt_links.length > 0 && (
                              <div className="mt-4 ml-13">
                                <p className="text-sm font-medium text-white/80">
                                  {chapter.yt_links.length} video resource{chapter.yt_links.length > 1 ? 's' : ''} available
                                </p>
                              </div>
                            )}
                          </div>
                          <Link 
                            href={`/chapter/${chapter._id}`} 
                            className="rounded-lg bg-purple-600/20 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-600/30 transition whitespace-nowrap"
                          >
                            View Chapter
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-xl bg-white/5 p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">Subject Not Found</h3>
              <p className="text-white/70">
                We couldn't find the subject you're looking for. It may have been removed or the ID is invalid.
              </p>
              <button 
                onClick={() => router.push('/subject')}
                className="mt-4 rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
              >
                Browse All Subjects
              </button>
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