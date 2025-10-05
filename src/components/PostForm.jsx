import React, { useState } from 'react'

export default function PostForm({ onSubmit, initial = null, submitLabel = 'Create Post', onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [author, setAuthor] = useState(initial?.author || '')
  const [saving, setSaving] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Title, content, and author are required.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), author: author.trim() })
      if (!initial) {
        setTitle(''); setContent(''); setAuthor('')
      }
    } catch (err) {
      alert('Error: ' + (err.message || err))
    } finally { setSaving(false) }
  }

  return (
    <form className="post-form" onSubmit={handle}>
      <h3>{initial ? 'Edit Post' : 'Create New Post'}</h3>
      <label>Title
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
      </label>
      <label>Content
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write something..." />
      </label>
      <label>Author
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name" />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
        {onCancel && <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
