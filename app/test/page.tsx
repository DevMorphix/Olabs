"use client";
import { useState } from 'react';

export default function YouTubeLinkProcessor() {
  const [ytLink, setYtLink] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const processYoutubeLink = async (link: string) => {
    // Validate YouTube link
    const youtubeLinkRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    
    if (!youtubeLinkRegex.test(link)) {
      return {
        success: false,
        message: 'Invalid YouTube link format'
      };
    }
    
    // Here you would add code to process the YouTube link
    // For example, sending it to an API, extracting data, etc.
    console.log('Processing YouTube link:', link);
    
    // Simulating API call with timeout
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'YouTube link processed successfully'
        });
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Processing...');
    
    try {
      const result: any = await processYoutubeLink(ytLink);
      setStatus(result.message);
    } catch (error) {
      setStatus('Error processing the link');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">YouTube Link Processor</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ytLink" className="block mb-2">
            Enter YouTube Link:
          </label>
          <input
            type="text"
            id="ytLink"
            value={ytLink}
            onChange={(e) => setYtLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 text-white rounded ${
            isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Process Link'}
        </button>
      </form>
      
      {status && (
        <div className={`mt-4 p-3 rounded ${status === 'Processing...' 
          ? 'bg-yellow-100' 
          : status.includes('successfully') 
            ? 'bg-green-100' 
            : 'bg-red-100'}`}>
          {status}
        </div>
      )}
    </div>
  );
}
