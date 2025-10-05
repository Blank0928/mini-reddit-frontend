// api.js — Mini Reddit Frontend API Wrapper

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

// General request helper
async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })

  if (!res.ok) {
    const text = await res.text()
    let message = text
    try { message = JSON.parse(text).message || message } catch(e){}
    const error = new Error(message || 'Request failed')
    error.status = res.status
    throw error
  }

  // For DELETE requests, or other responses with no body
  if (res.status === 204) return null

  // Try parsing JSON if content exists
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// Posts
export const getPosts = () => request('/posts')
export const getPost = (id) => request(`/posts/${id}`)
export const createPost = (payload) => request('/posts', { method: 'POST', body: JSON.stringify(payload) })
export const updatePost = (id, payload) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

// DELETE posts — return true instead of JSON
export const deletePost = async (id) => {
  const res = await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete post')
  }
  return true
}

// Comments
export const addComment = (postId, payload) => request(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(payload) })
export const updateComment = (postId, commentId, payload) => request(`/posts/${postId}/comments/${commentId}`, { method: 'PUT', body: JSON.stringify(payload) })

// DELETE comments — return true instead of JSON
export const deleteComment = async (postId, commentId) => {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete comment')
  }
  return true
}
