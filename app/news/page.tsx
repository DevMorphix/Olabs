"use client";

import React from 'react';
import Navbar from '../../components/navbar';

function News() {
  const newsItems = [
    {
      title: "New Course Launch",
      date: "March 1, 2025",
      description: "We are excited to announce the launch of our new course on Advanced React Development. Enroll now to enhance your skills!",
    },
    {
      title: "Upcoming Webinar",
      date: "March 5, 2025",
      description: "Join us for an exclusive webinar on the latest trends in web development. Register today to secure your spot!",
    },
    {
      title: "Student Success Stories",
      date: "March 10, 2025",
      description: "Read inspiring stories from our students who have successfully transitioned into their dream careers after completing our courses.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      <Navbar />
      <main className="relative pt-20">
        <div className="container mx-auto px-4">
          <div className="py-16 lg:py-24">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Latest News
            </h1>
            <div className="grid gap-16 lg:grid-cols-3">
              {newsItems.map((item, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-lg">
                  <h2 className="mb-2 text-2xl font-semibold text-[#0F0A27]">{item.title}</h2>
                  <p className="mb-4 text-sm text-gray-500">{item.date}</p>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default News;