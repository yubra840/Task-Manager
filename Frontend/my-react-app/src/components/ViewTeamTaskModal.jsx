//src/components/ViewTeamTaskModal.jsx
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import "./ViewTeamTaskModal.css";

export default function ViewTeamTaskModal({ task, closeModal }) {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [task]);

  const fetchComments = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(
      `${apiUrl}/team-task-comments/${task.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setComments(data);
  };

  // ⏱ TIME AGO FUNCTION
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hrs ago`;
    const days = Math.floor(hrs / 24);
    return `${days} days ago`;
  };

  // 💬 ADD COMMENT
  const handleComment = async () => {
    if (!text.trim()) return;
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(
      `${apiUrl}/team-task-comments/${task.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ comment: text })
      }
    );

    const data = await res.json();

    // ⚡ INSTANT UI UPDATE
    setComments(prev => [...prev, {
    user_id: currentUser.id,
    name: currentUser.name,
    profile_pic: currentUser.profile_pic,
    comment: text,
    created_at: new Date().toISOString()
    }]);

    setText("");
  };

  return (
    <div className="modal-overlay">
      <div className="view-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>{task.title}</h3>
          <CloseIcon onClick={closeModal} className="close-icon" />
        </div>

        {/* TASK INFO */}
        <div className="task-info">
          <p><b>Description:</b> {task.description}</p>
          <p><b>Status:</b> {task.status}</p>
          <p><b>Priority:</b> {task.priority}</p>
          <p><b>Due Date:</b> {task.due_date}</p>
          <p><b>Assigned By:</b> {task.assigned_by_name}</p>
        </div>

        <hr />

        {/* COMMENTS */}
        <div className="comments-section">

          <h4>Comments</h4>

          <div className="comments-list">
            {comments.map(c => (
              <div key={`${c.user_id}-${c.created_at}`} className="comment">

                {c.profile_pic ? (
                  <img src={c.profile_pic} />
                ) : (
                  <PersonIcon className="avatar" />
                )}

                <div>
                  <b>{c.name}</b>
                  <p>{c.comment}</p>
                  <span>{timeAgo(c.created_at)}</span>
                </div>

              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="comment-input">
            <textarea
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button onClick={handleComment}>
              <SendIcon /> Comment
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}