import React, { useState } from 'react'

export default function CommentForm({ onSubmit, initial = null, submitLabel = 'Add Comment', onCancel }) {
  const [content, setContent] = useState(initial?.content || '')
  const [author, setAuthor] = useState(initial?.author || '')
  const [saving, setSaving] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (!content.trim() || !author.trim()) {
      alert('Comment content and author are required.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({ content: content.trim(), author: author.trim() })
      if (!initial) {
        setContent(''); setAuthor('')
      }
    } catch (err) {
      alert('Error: ' + (err.message || err))
    } finally { setSaving(false) }
  }

  return (
    <form className="comment-form" onSubmit={handle}>
      <label>Comment
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Say something..." />
      </label>
      <label>Your name
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" />
      </label>
      <div className="form-actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
        {onCancel && <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
