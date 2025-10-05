import React, { useEffect, useState } from 'react'
import { getPosts, createPost } from '../api'
import PostItem from './PostItem'
import PostForm from './PostForm'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await getPosts()
      setPosts(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (payload) => {
    try {
      const newPost = await createPost(payload)
      // Insert to top
      setPosts(prev => [newPost, ...prev])
    } catch (err) {
      alert('Create post failed: ' + (err.message || err))
    }
  }

  const handleUpdateInList = (updated) => {
    setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)))
  }

  const handleDeleteInList = (deletedId) => {
    setPosts(prev => prev.filter(p => p.id !== deletedId))
  }

  return (
    <section className="posts-section">
      <div className="left-col">
        <PostForm onSubmit={handleCreate} />
      </div>

      <div className="right-col">
        <h2>All Posts</h2>
        {loading && <div className="info">Loading posts...</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && posts.length === 0 && <div className="info">No posts yet — create the first one!</div>}
        <div className="posts-list">
          {posts.map(post => (
            <PostItem
                key={post.id}
                post={post}
                onUpdate={handleUpdateInList}
                onDelete={handleDeleteInList} // just pass the function
            />
          ))}
        </div>
      </div>
    </section>
  )
}
