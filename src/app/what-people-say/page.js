"use client"

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WhatPeopleSayPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (!response.ok) throw new Error("Failed to fetch feedback");
        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= feedbacks.length ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <span className="loading loading-spinner text-primary"></span>
        <span className="text-gray-600 mx-4">Loading feedback...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" bg-black text-red-400 flex items-center justify-center font-mono">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            What Our Clients Say
          </h1>
          <div className="w-24 h-1 mx-auto bg-primary rounded-full"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all p-8 h-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 rounded-full">
                            <img src={feedback.avatar || "https://placehold.co/80"} alt={feedback.name} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-base-content">
                            {feedback.name}
                          </h3>
                          <p className="text-base-content/50 text-sm mt-1">
                            {feedback.role}
                          </p>
                        </div>
                      </div>
                      <div className="rating rating-md">
                        {[...Array(5)].map((_, starIndex) => (
                          <input
                            key={starIndex}
                            type="radio"
                            name={`rating-${feedback._id}`}
                            className={`mask mask-star-2 ${starIndex < feedback.rating ? "bg-amber-400" : "bg-gray-300"}`}
                            checked={starIndex === feedback.rating - 1}
                            readOnly
                          />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-base-content/80 text-lg leading-relaxed before:content-['“'] after:content-['”'] before:text-3xl before:text-primary/30 before:mr-2 after:text-3xl after:text-primary/30 after:ml-2">
                      {feedback.comment}
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 -left-4 flex items-center">
            <button
              onClick={goToPrev}
              className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-transform hover:-translate-x-1"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 -right-4 flex items-center">
            <button
              onClick={goToNext}
              className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-transform hover:translate-x-1"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {feedbacks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`btn btn-xs btn-circle ${index === currentIndex ? "btn-primary" : "btn bg-base-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
