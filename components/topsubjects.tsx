"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, Megaphone, Monitor, Layout, Target, BarChart3 } from "lucide-react"

interface Category {
  id: number
  icon: React.ReactNode
  primaryTitle: string
  secondaryTitle: string
  courses: string
}

export default function TopCategories() {
  const categories: Category[] = [
    {
      id: 1,
      icon: <Download className="h-8 w-8 text-indigo-700" />,
      primaryTitle: "Design",
      secondaryTitle: "Creative",
      courses: "573+ Courses",
    },
    {
      id: 2,
      icon: <Megaphone className="h-8 w-8 text-indigo-700" />,
      primaryTitle: "Sales",
      secondaryTitle: "Marketing",
      courses: "565+ Courses",
    },
    {
      id: 3,
      icon: <Monitor className="h-8 w-8 text-indigo-700" />,
      primaryTitle: "Development",
      secondaryTitle: "IT",
      courses: "126+ Courses",
    },
    {
      id: 4,
      icon: <Layout className="h-8 w-8 text-indigo-700" />,
      primaryTitle: "Engineering",
      secondaryTitle: "Architecture",
      courses: "35+ Courses",
    },
    {
      id: 5,
      icon: <Target className="h-8 w-8 text-indigo-700" />,
      primaryTitle: "Personal",
      secondaryTitle: "Development",
      courses: "908+ Courses",
    },
    {
      id: 6,
      icon: <BarChart3 className="h-8 w-8 text-indigo-700" />,
      primaryTitle: "Finance",
      secondaryTitle: "Accounting",
      courses: "129+ Courses",
    },
  ]

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = {
    mobile: 1,
    tablet: 3,
    desktop: 6,
  }

  // Calculate total pages based on screen size
  const getVisibleItems = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        return categories.slice(currentPage, currentPage + itemsPerPage.mobile)
      } else if (window.innerWidth < 1024) {
        return categories.slice(
          currentPage * itemsPerPage.tablet,
          currentPage * itemsPerPage.tablet + itemsPerPage.tablet,
        )
      }
    }
    return categories
  }

  const totalPages =
    typeof window !== "undefined" && window.innerWidth < 640
      ? categories.length
      : typeof window !== "undefined" && window.innerWidth < 1024
        ? Math.ceil(categories.length / itemsPerPage.tablet)
        : 1

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      setCurrentPage(0) // Loop back to the first page
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    } else {
      setCurrentPage(totalPages - 1) // Loop to the last page
    }
  }

  return (
    <section className="py-12  ">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-900 mb-2">Top Subjects</h2>
        {/* <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur.</p> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-8">
        {getVisibleItems().map((category) => (
          <div key={category.id} className="bg-gray-100 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-5 mb-4 w-20 h-20 flex items-center justify-center">
              {category.icon}
            </div>
            <h3 className="font-medium text-lg text-indigo-900">{category.primaryTitle}</h3>
            <p className="text-indigo-900 mb-3">{category.secondaryTitle}</p>
            <p className="text-gray-500 text-sm">{category.courses}</p>
          </div>
        ))}
      </div>

      {/* <div className="flex justify-center items-center mt-10 gap-2">
        <button onClick={prevPage} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous page">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full ${currentPage === index ? "bg-indigo-600" : "bg-gray-300"}`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}

        <button onClick={nextPage} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next page">
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div> */}
    </section>
  )
}

