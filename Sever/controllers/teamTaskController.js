import db from "../config/db.js";
import { notifyMany } from "../utils/teamNotifications.js";


// ✅ CREATE TEAM TASK
export const createTeamTask = async (req, res) => {
  const teamId = req.params.teamId;
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  const userId = req.user.id;
  const senderName = req.user.name;
  const senderAvatar = req.user.profile_pic;

  try {
    await db.promise().query(
      `INSERT INTO team_tasks 
      (team_id, title, description, due_date, priority, status, assigned_by, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        teamId,
        title,
        description,
        dueDate,
        priority,
        status,
        userId,
        JSON.stringify(assignedTo || [])
      ]
    );

    // 🔔 notify assigned members
    notifyMany(assignedTo, {
      senderName,
      senderAvatar,
      type: "team",
      referenceId: teamId,
      message: `${senderName} assigned you a task in team "${title}"`
    });

    res.json({ message: "Task created" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET TEAM TASKS
export const getTeamTasks = async (req, res) => {
  const teamId = req.params.teamId;

  const [tasks] = await db.promise().query(`
    SELECT tt.*, u.name as assigned_by_name
    FROM team_tasks tt
    JOIN users u ON u.id = tt.assigned_by
    WHERE tt.team_id = ?
    ORDER BY tt.id DESC
  `, [teamId]);

  // ✅ normalize here
  const formatted = tasks.map(task => ({
    ...task,
    assigned_to:
      typeof task.assigned_to === "string"
        ? JSON.parse(task.assigned_to)
        : task.assigned_to || []
  }));

  res.json(formatted);
};

// ✅ DELETE TASK
export const deleteTeamTask = async (req, res) => {
  const taskId = req.params.taskId;

  await db.promise().query("DELETE FROM team_tasks WHERE id = ?", [taskId]);

  res.json({ message: "Deleted" });
};

// ✅ UPDATE TASK
export const updateTeamTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, status, priority } = req.body;

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

    const [teamMembers] = await db.promise().query(`
  SELECT u.id, tm.role
  FROM team_members tm
  JOIN users u ON u.id = tm.user_id
  WHERE tm.team_id = ?
`, [task.team_id]);

    const admin = teamMembers.find(m => m.role === "admin");

    await db.promise().query(
      `UPDATE team_tasks 
       SET title=?, description=?, status=?, priority=? 
       WHERE id=?`,
      [title, description, status, priority, taskId]
    );

    // =========================
    // 🔔 ADMIN UPDATED
    // =========================
    if (admin?.id === userId) {
      notifyMany(assignedUsers, {
        senderName,
        senderAvatar,
        type: "team",
        referenceId: task.team_id,
        message: `${senderName} updated team task "${title}"`
      });
    }

    // =========================
    // 🔔 MEMBER UPDATED
    // =========================
    else {
      const recipients = [
        admin,
        ...assignedUsers.filter(u => u.id !== userId)
      ].filter(Boolean); // remove null/undefined

      notifyMany(recipients, {
        senderName,
        senderAvatar,
        type: "team",
        referenceId: task.team_id,
        message: `${senderName} updated team task "${title}"`
      });
    }

    res.json({ message: "Updated" });

  } catch (err) {
    console.error("TEAM UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};