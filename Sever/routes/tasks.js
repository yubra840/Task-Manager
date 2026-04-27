//routes/tasks.js
import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createNotification } from "../utils/createNotification.js";



const router = express.Router();

// CREATE TASK

router.post("/", verifyToken, (req, res) => {
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo
  } = req.body;

  const userId = req.user.id;
  const assignedBy = req.user.name;
  const avatar = req.user.profile_pic || null;

  const sql = `
    INSERT INTO tasks 
    (title, description, due_date, priority, status, user_id, assigned_by, assigned_to)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      dueDate,
      priority,
      status,
      userId,
      assignedBy,
      JSON.stringify(assignedTo)
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const taskId = result.insertId;

      // 🔔 NOTIFICATIONS
      assignedTo.forEach((user) => {
        if (user.id !== userId) {
          createNotification({
            userId: user.id,
            senderName: assignedBy,
            senderAvatar: avatar,
            message: `${assignedBy} has assigned you a task \"${title}\". Take a look`,
            type: "task",
            referenceId: taskId
          });
        }
      });

      res.json({ message: "Task created successfully" });
    }
  );
});
// GET TASKS
router.get("/", verifyToken, (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;

  const sql = `
    SELECT * FROM tasks
    WHERE user_id = ?
    OR JSON_SEARCH(assigned_to, 'one', ?) IS NOT NULL
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId, userName], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.delete("/:id", verifyToken, (req, res) => {
  const taskId = req.params.id;
  const userName = req.user.name;
  const avatar = req.user.profile_pic;

  db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) return res.status(500).json(err);

    const task = results[0];
    let assignedUsers = [];

    if (typeof task.assigned_to === "string") {
      assignedUsers = JSON.parse(task.assigned_to || "[]");
    } else {
      assignedUsers = task.assigned_to || [];
    }

    // 🔔 NOTIFY BEFORE DELETE
    assignedUsers.forEach((user) => {
      createNotification({
        userId: user.id,
        senderName: userName,
        senderAvatar: avatar,
        message: `${userName} deleted the task you were assigned \"${task.title}\"`,
        type: "task",
        referenceId: taskId
      });
    });

    db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Task deleted successfully" });
    });
  });
});

router.put("/:id", verifyToken, (req, res) => {
  const taskId = req.params.id;

  const { title, description, dueDate, priority, status } = req.body;

  const userName = req.user.name;
  const avatar = req.user.profile_pic;

  // 🔥 GET TASK FIRST
  db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) return res.status(500).json(err);

    const task = results[0];
    let assignedUsers = [];

    if (typeof task.assigned_to === "string") {
      assignedUsers = JSON.parse(task.assigned_to || "[]");
    } else {
      assignedUsers = task.assigned_to || [];
    }

    const sql = `
      UPDATE tasks
      SET title = ?, description = ?, due_date = ?, priority = ?, status = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [title, description, dueDate, priority, status, taskId],
      (err) => {
        if (err) return res.status(500).json(err);

        // 🔔 NOTIFICATIONS
        assignedUsers.forEach((user) => {
          if (user.name === userName) {
            // assignee updated → notify creator
            createNotification({
              userId: task.user_id,
              senderName: userName,
              senderAvatar: avatar,
              message: `${userName} updated the task you assigned him \"${task.title}\"`,
              type: "task",
              referenceId: taskId
            });
          } else {
            // creator updated → notify assignees
            createNotification({
              userId: user.id,
              senderName: userName,
              senderAvatar: avatar,
              message: `${userName} updated your assigned task \"${task.title}\"`,
              type: "task",
              referenceId: taskId
            });
          }
        });

        res.json({ message: "Task updated successfully" });
      }
    );
  });
});
router.get("/:id/comments", verifyToken, (req, res) => {
  const taskId = req.params.id;

  const sql = `
    SELECT * FROM comments 
    WHERE task_id = ? 
    ORDER BY created_at DESC
  `;

  db.query(sql, [taskId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
router.post("/:id/comments", verifyToken, (req, res) => {
  const taskId = req.params.id;
  const { comment } = req.body;

  const userId = req.user.id;
  const userName = req.user.name;
  const profilePic = req.user.profile_pic;

  db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) return res.status(500).json(err);

    const task = results[0];

    const sql = `
      INSERT INTO comments (task_id, user_id, user_name, profile_pic, comment)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [taskId, userId, userName, profilePic, comment],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // 🔔 NOTIFY CREATOR
        if (task.user_id !== userId) {
          createNotification({
            userId: task.user_id,
            senderName: userName,
            senderAvatar: profilePic,
            message: `${userName} made a comment on the task \"${task.title}\"`,
            type: "task",
            referenceId: taskId
          });
        }

        res.json({ message: "Comment added" });
      }
    );
  });
});

export default router;