import React from 'react'

export default function Footer() {
  return (
    <footer className="flex items-center justify-center 
  text-sm text-gray-300 
  bg-[#0a0f1a] 
  w-full h-20 mt-10 border-t border-white/10">
  © {new Date().getFullYear()} MOVION — All rights reserved.
</footer>

  )
}
