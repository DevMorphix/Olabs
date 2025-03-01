"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSubject, GetClass } from '@/app/api';
import { validateSubjectData, formatSubjectData } from '@/app/utils/validators';
import { Loader, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ClassOption {
  _id: string;
  title: string;
}

export default function AddSubjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class_id: ''
  });
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch class options for dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await GetClass();
        console.log("GetClass response:", response);
        
        // Format classes for the dropdown based on the API response structure
        if (response.data && Array.isArray(response.data)) {
          setClasses(response.data.map((cls: any) => ({
            _id: cls._id,
            title: cls.title
          })));
        } else if (response.classes && Array.isArray(response.classes)) {
          setClasses(response.classes.map((cls: any) => ({
            _id: cls._id,
            title: cls.class_name || cls.title
          })));
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate form data
    const validation = validateSubjectData(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    // Format data for API
    const formattedData = formatSubjectData(formData);
    
    console.log("Submitting subject data:", formattedData);
    setIsLoading(true);
    
    try {
      const response = await createSubject(formattedData);
      console.log("Create subject response:", response);
      
      if (response.error) {
        console.error('Error creating subject:', response);
        setError(response.message || 'Failed to create subject. Please try again.');
      } else {
        setSuccess('Subject created successfully!');
        // Reset form after successful submission
        setFormData({
          title: '',
          description: '',
          class_id: ''
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin/dashboard/subjects');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard/subjects" className="p-1 rounded-full hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Add New Subject</h1>
          </div>
          <Link 
            href="/admin/dashboard/subjects" 
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back to Subjects
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Subject Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                validationErrors.title ? 'border-red-500' : ''
              }`}
              placeholder="Enter subject name"
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Enter subject description"
            />
          </div>

          {/* Class ID */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="class_id">
              Class
            </label>
            <select
              id="class_id"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                validationErrors.class_id ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>
            {validationErrors.class_id && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.class_id}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Subject'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}