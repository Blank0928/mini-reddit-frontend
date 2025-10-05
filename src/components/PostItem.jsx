import React, { useState } from 'react'
import { updatePost, deletePost, addComment, updateComment, deleteComment } from '../api'
import CommentForm from './CommentForm'
import PostForm from './PostForm'

export default function PostItem({ post, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [addingComment, setAddingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [localPost, setLocalPost] = useState(post)
  const [busy, setBusy] = useState(false)

  const refreshLocal = (updated) => {
    setLocalPost(updated)
    onUpdate && onUpdate(updated)
  }

  const handleUpdatePost = async (payload) => {
    setBusy(true)
    try {
      const upd = await updatePost(localPost.id, payload)
      refreshLocal(upd)
      setEditing(false)
    } catch (err) {
      alert('Update failed: ' + (err.message || err))
    } finally { setBusy(false) }
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await deletePost(localPost.id)
      onDelete && onDelete(localPost.id)
    } catch (err) {
      alert('Delete failed: ' + (err.message || err))
    }
  }

  const handleAddComment = async (payload) => {
    try {
      const newComment = await addComment(localPost.id, payload)
      const updated = { ...localPost, comments: [...(localPost.comments || []), newComment] }
      refreshLocal(updated)
      setAddingComment(false)
    } catch (err) {
      alert('Add comment failed: ' + (err.message || err))
    }
  }

  const handleEditComment = async (commentId, payload) => {
    try {
      const updatedComment = await updateComment(localPost.id, commentId, payload)
      const comments = (localPost.comments || []).map(c => (c.id === commentId ? updatedComment : c))
      const updated = { ...localPost, comments }
      refreshLocal(updated)
      setEditingCommentId(null)
    } catch (err) {
      alert('Edit comment failed: ' + (err.message || err))
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(localPost.id, commentId)
      const comments = (localPost.comments || []).filter(c => c.id !== commentId)
      const updated = { ...localPost, comments }
      refreshLocal(updated)
    } catch (err) {
      alert('Delete comment failed: ' + (err.message || err))
    }
  }

  return (
    <article className="post-item">
      <div className="post-header">
        <div>
          <h3>{localPost.title}</h3>
          <div className="meta">by <strong>{localPost.author}</strong> • id: {localPost.id}</div>
        </div>

        <div className="post-actions">
          <button onClick={() => setExpanded(s => !s)}>{expanded ? 'Hide' : 'Show'}</button>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button className="btn-delete" onClick={handleDeletePost}>Delete</button>
        </div>
      </div>

      {editing ? (
        <PostForm
          initial={localPost}
          submitLabel={busy ? 'Saving...' : 'Save'}
          onSubmit={handleUpdatePost}
          onCancel={() => setEditing(false)}
        />
      ) : expanded && (
        <>
          <p className="content">{localPost.content}</p>

          <section className="comments">
            <h4>Comments ({(localPost.comments || []).length})</h4>
            <div className="comment-list">
              {(localPost.comments || []).map(c => (
                <div key={c.id} className="comment">
                  <div className="comment-body">
                    <div><strong>{c.author}</strong> <span className="comment-meta">• id: {c.id}</span></div>
                    <div className="comment-text">{c.content}</div>
                  </div>
                  <div className="comment-actions">
                    <button onClick={() => setEditingCommentId(c.id)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDeleteComment(c.id)}>Delete</button>
                  </div>

                  {editingCommentId === c.id && (
                    <CommentForm
                      initial={c}
                      submitLabel="Save comment"
                      onSubmit={(payload) => handleEditComment(c.id, payload)}
                      onCancel={() => setEditingCommentId(null)}
                    />
                  )}
                </div>
              ))}
            </div>

            {addingComment ? (
              <CommentForm onSubmit={handleAddComment} onCancel={() => setAddingComment(false)} />
            ) : (
              <button className="btn-add-comment" onClick={() => setAddingComment(true)}>Add comment</button>
            )}
          </section>
        </>
      )}
    </article>
  )
}
