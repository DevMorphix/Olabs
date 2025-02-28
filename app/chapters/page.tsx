"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { getchapter } from "@/app/api/index";
import Link from "next/link";

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

  const fetchChaptersData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getchapter();
      console.log("API Response:", response); // Log the raw response
      
      // Check if response exists and has expected properties
      if (!response) {
        throw new Error("No response received from the API");
      }
      
      // Some fetch responses might not have an 'ok' property
      // or the API might return a different structure
      if (response.ok === false) {
        throw new Error(`Failed to fetch chapters: ${response.statusText || 'Unknown error'}`);
      }
      
      let responseData;
      try {
        // The API might directly return JSON instead of a Response object
        if (typeof response.json === 'function') {
          responseData = await response.json();
        } else {
          // If the response is already parsed JSON
          responseData = response;
        }
        console.log("API Response Data:", responseData);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Failed to parse API response");
      }
      
      // Handle the specific response format where chapters are in a nested data array
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        console.log("Chapters found in data array:", responseData.data.length);
        setChapters(responseData.data);
      } else if (Array.isArray(responseData)) {
        // In case the API returns a direct array
        console.log("Chapters found in direct array:", responseData.length);
        setChapters(responseData);
      } else if (responseData && typeof responseData === 'object' && responseData._id) {
        // Handle case where a single chapter object is returned
        console.log("Single chapter object found");
        setChapters([responseData]);
      } else {
        console.log("No recognizable chapter data in response:", responseData);
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Learning Chapters</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchChaptersData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/test">Create New Summary</Link>
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && !error ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : chapters.length === 0 && !error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No chapters found. Create your first chapter by summarizing a video.</p>
            </CardContent>
          </Card>
        ) : (
          // Safe array mapping after ensuring chapters is always an array
          chapters.map((chapter) => (
            <Card key={chapter._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">{chapter.title}</CardTitle>
                <CardDescription>
                  Created on {new Date(chapter.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Array.isArray(chapter.yt_links) ? (
                  chapter.yt_links.map((link, idx) => {
                    const embedUrl = getYouTubeEmbedUrl(link.url);
                    return (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-xl font-medium">{link.title}</h3>
                        {embedUrl && (
                          <div className="aspect-video w-full">
                            <iframe
                              className="w-full h-full"
                              src={embedUrl}
                              title={link.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}
                        <p className="text-muted-foreground">{link.description}</p>
                      </div>
                    );
                  })
                ) : (
                  <p>No video links available for this chapter.</p>
                )}
                <div className="prose dark:prose-invert mt-6">
                  <h3 className="text-xl font-medium">Summary</h3>
                  <div dangerouslySetInnerHTML={{ __html: chapter.content?.replace(/\n/g, '<br/>') || 'No content available' }} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
