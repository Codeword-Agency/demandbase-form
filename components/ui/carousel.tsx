"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  children: React.ReactNode
}

interface CarouselItemProps {
  children: React.ReactNode
}

export function CarouselItem({ children }: CarouselItemProps) {
  return <div className="carousel-item w-full flex-shrink-0">{children}</div>
}

export default function Carousel({ children }: CarouselProps) {
  const childrenArray = React.Children.toArray(children)
  const itemCount = childrenArray.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? itemCount - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === itemCount - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setTranslateX(0)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const diff = clientX - startX
    setTranslateX(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50 // minimum distance to trigger slide change
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
    setTranslateX(0)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="w-full carousel">
      {/* Carousel Content */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-lg mb-6 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${-currentIndex * 100 + (isDragging ? (translateX / (carouselRef.current?.offsetWidth || 1)) * 100 : 0)}%)`,
            transitionDuration: isDragging ? "0ms" : "300ms",
          }}
        >
          {childrenArray}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-200 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-3">
          {Array.from({ length: itemCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                index === currentIndex
                  ? "bg-white active shadow-lg scale-110"
                  : "bg-white/30 border-white/50 hover:bg-white/50 hover:border-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-200 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
