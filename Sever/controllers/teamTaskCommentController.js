import db from "../config/db.js";
import { notifyMany } from "../utils/teamNotifications.js";


// ✅ ADD COMMENT
export const addComment = async (req, res) => {
  const taskId = req.params.taskId;
  const { comment } = req.body;

  const userId = req.user.id;
  const senderName = req.user.name;
  const senderAvatar = req.user.profile_pic;

  try {
    const [[task]] = await db.promise().query(
      "SELECT * FROM team_tasks WHERE id = ?",
      [taskId]
    );

    let assignedUsers = [];

    if (typeof task.assigned_to === "string") {
      assignedUsers = JSON.parse(task.assigned_to || "[]");
    } else {
      assignedUsers = task.assigned_to || [];
    }


    await db.promise().query(
      `INSERT INTO team_task_comments (task_id, user_id, comment)
       VALUES (?, ?, ?)`,
      [taskId, userId, comment]
    );

    // 🔔 notify all assigned + admin
    const [members] = await db.promise().query(`
      SELECT u.id, tm.role
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ?
    `, [task.team_id]);

    const recipients = members.filter(m => m.id !== userId);

    notifyMany(recipients, {
      senderName,
      senderAvatar,
      type: "team",
      referenceId: task.team_id,
      message: `${senderName} commented on team task "${task.title}"`
    });

    res.json({ message: "Comment added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET COMMENTS
export const getComments = async (req, res) => {
  const taskId = req.params.taskId;

  const [comments] = await db.promise().query(`
    SELECT c.*, u.name, u.profile_pic
    FROM team_task_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.task_id = ?
    ORDER BY c.created_at ASC
  `, [taskId]);

  res.json(comments);
};