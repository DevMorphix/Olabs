"use client";
import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import olabsboy from '../../public/assets/olabsboy.svg';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data:', { name, email, message });
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-[#0F0A27] font-sans">
      <Navbar />
      <main className="relative pt-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 py-16 lg:grid-cols-2 lg:py-24">
            {/* Left Column */}
            <div className="relative z-10">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Contact Us
              </h1>
              <p className="mb-8 max-w-lg text-lg text-white/80">
                We'd love to hear from you! Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column */}
            <div className="relative">
              {/* You can add an image or any other content here */}
              <img
                  src={olabsboy.src || "/placeholder.svg"}
                  alt="Student learning"
                  className="rounded-2xl h-screen flex items-center justify-center"
                />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;