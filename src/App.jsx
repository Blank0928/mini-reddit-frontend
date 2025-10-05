import React from 'react'
import PostList from './components/PostList'

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Mini Reddit — Posts & Comments</h1>
        <p className="subtitle">Simple demo: create posts, add comments, edit or delete.</p>
      </header>

      <main>
        <PostList />
      </main>

      <footer>
        <small>Local demo • Backend expected at <code>http://localhost:8080/api</code></small>
      </footer>
    </div>
  )
}
