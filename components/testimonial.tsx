"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Pause, Play } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  image: string
  rating: number
  text: string
}

export default function TestimonialCarouselAutoplay() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Marketing Director",
      company: "TechCorp",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "This product has completely transformed our workflow. The intuitive interface and powerful features have increased our team's productivity by 40%. I can't imagine going back to our old system.",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Senior Developer",
      company: "InnovateSoft",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "As a developer, I appreciate the clean architecture and robust API. Integration was seamless, and the documentation is comprehensive. The support team was also incredibly responsive when we needed help.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "CEO",
      company: "GrowthStartup",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4,
      text: "Implementing this solution helped us scale our operations efficiently. The analytics dashboard provides valuable insights that drive our business decisions. It's been a game-changer for our company.",
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Product Manager",
      company: "InnovateNow",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "The flexibility and customization options are outstanding. We were able to tailor the platform to our specific needs without any compromise. The ROI has exceeded our expectations.",
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "Operations Director",
      company: "GlobalSystems",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "After evaluating several options, we're so glad we chose this solution. The onboarding process was smooth, and our team adapted quickly. The automation features have saved us countless hours.",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isPlaying, setIsPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - itemsPerView ? 0 : prevIndex + 1))
  }, [itemsPerView, testimonials.length])

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - itemsPerView : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    const slideIndex = index * itemsPerView
    setCurrentIndex(slideIndex < testimonials.length ? slideIndex : 0)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, nextSlide])

  const totalSlides = Math.ceil(testimonials.length / itemsPerView)

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView)

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-16 px-4 bg-[#0F0A27]">
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experience working with us.
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-md p-6 flex-1 min-w-0 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {/* <div className="mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div> */}
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {testimonial.position}, {testimonial.company}
                    </p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center mt-8">
          {/* Autoplay Toggle */}
          <button
            onClick={toggleAutoplay}
            className="flex items-center justify-center mr-4 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? <Pause className="h-4 w-4 text-gray-700" /> : <Play className="h-4 w-4 text-gray-700" />}
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerView) === index ? "bg-indigo-600 w-6" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

