"use client"
import React from 'react'
import Image from 'next/image'

export default function Banner() {
  
  return (
   <div className="relative w-full h-[500px] md:h-[700px]">
      <Image
        src="/images/banner2.jpg"
        alt="banner"
        fill
        className="object-cover brightness-[0.65]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20">
        <div className="max-w-2xl space-y-4 backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 shadow-xl">

          <h2 className="text-white text-3xl md:text-6xl font-extrabold leading-tight drop-shadow-xl">
            Movies Near You:
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Discover. Select. Book Instantly.
            </span>
          </h2>

          <h3 className="text-gray-200 text-lg md:text-2xl font-light">
            Browse movies across multiple theaters, choose your location,
            and enjoy seamless booking with
            <span className="font-semibold text-white ml-2">Movion</span>
          </h3>

          <button
            className="
              mt-4 w-fit px-6 py-3 
              bg-gradient-to-r from-red-600 to-orange-500 
              text-white font-semibold text-lg 
              rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-2xl 
              active:scale-95 transition-all
            "
            onClick={() => {
              const el = document.getElementById("list-section")
              el?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Explore Movies
          </button>

        </div>
      </div>
   </div>
  )
}
