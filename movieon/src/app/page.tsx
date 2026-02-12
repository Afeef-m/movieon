import React from 'react'
import Banner from './components/banner'
import MovieList from './components/movie/movieList'

export default function Home() {
  return (
    <main className="flex flex-col">
      <Banner/>

      <section id='list-section'>
        <MovieList/>
      </section>
    </main>
  )
}


