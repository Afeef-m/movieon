"use client"
import { Play } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface Props{
    trailer?:string;
}

export default function ShowTrailer({trailer}:Props) {
      const [showTrailer, setShowTrailer] = useState(false);
      useEffect(() => {
          const timer = setTimeout(() => {
            setShowTrailer(true);
          }, 5000);
      
          return () => clearTimeout(timer);
        }, []);
        

          if (!trailer) return null;

  return (
    <div className="border-t border-white/10 pt-10 pb-20">
            <h2 className="text-3xl font-bold mb-6 text-white">Watch Trailer</h2>
            <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden border-2 border-white/10 bg-black shadow-2xl">
              {showTrailer ? (
                <iframe
                  src={`${trailer}?autoplay=1&mute=1`}
                  title="Movie Trailer"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div 
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-center h-full cursor-pointer group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-600/30 rounded-full blur-2xl group-hover:bg-red-600/50 transition-all" />
                    <div className="relative bg-red-600 hover:bg-red-700 p-6 rounded-full shadow-xl shadow-red-500/50 group-hover:scale-110 transition-all">
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
  )
}


