import React, { useEffect, useState } from "react";
import "./ViewTaskModal.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";

export default function ViewTaskModal({ task, closeModal }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));


  // ⏱️ TIME AGO FUNCTION
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 }
    ];

    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count > 0) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  // FETCH COMMENTS
  const fetchComments = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(
      `${apiUrl}/tasks/${task.id}/comments`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(
      `${apiUrl}/tasks/${task.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ comment: newComment })
      }
    );

    const data = await res.json();

    // 🔥 INSTANT UI UPDATE
    setComments(prev => [...prev, {
    user_id: currentUser.id,
    user_name: currentUser.name,
    profile_pic: currentUser.profile_pic,
    comment: newComment,
    created_at: new Date().toISOString()
    }]);
    setNewComment("");
  };

  return (
    <div className="view-modal-overlay">
      <div className="view-modal">
        <div className="view-header">
          <h2>{task.title}</h2>
          <CloseIcon onClick={closeModal} className="close-icon" />
        </div>

        <div className="task-details">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {task.due_date}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Assigned By:</strong> {task.assigned_by}</p>
        </div>

        {/* 💬 COMMENTS */}
        <div className="comments-section">
          <h3>Comments</h3>

          <div className="comment-input">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>
              <SendIcon />
            </button>
          </div>

          <div className="comments-list">
            {comments.map((c) => (
              <div key={`${c.user_id}-${c.created_at}`} className="comment">
                {c.profile_pic ? (
                  <img src={c.profile_pic} alt="" />
                ) : (
                  <PersonIcon className="avatar" />
                )}

                <div className="comment-content">
                  <div className="comment-top">
                    <span className="name">{c.user_name}</span>
                    <span className="time">{timeAgo(c.created_at)}</span>
                  </div>

                  <p>{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}