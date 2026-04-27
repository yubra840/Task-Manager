import db from "../config/db.js";
import { notifyMany } from "../utils/teamNotifications.js";


// ✅ CREATE TEAM
export const createTeam = async (req, res) => {
  const { name, description, members } = req.body;

  const userId = req.user.id;
  const senderName = req.user.name;
  const senderAvatar = req.user.profile_pic;

  try {
    const [result] = await db.promise().query(
      "INSERT INTO teams (name, description, created_by) VALUES (?, ?, ?)",
      [name, description, userId]
    );

    const teamId = result.insertId;

    // admin
    await db.promise().query(
      "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)",
      [teamId, userId, "admin"]
    );

    // members
    if (members?.length) {
      for (let m of members) {
        await db.promise().query(
          "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)",
          [teamId, m.id, "member"]
        );
      }
    }

    // 🔔 NOTIFY ALL MEMBERS
    notifyMany(members, {
      senderName,
      senderAvatar,
      type: "team",
      referenceId: teamId,
      message: `${senderName} added you to his team "${name}"`
    });

    res.json({ message: "Team created" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET USER TEAMS
export const getMyTeams = async (req, res) => {
  const userId = req.user.id;

  const [teams] = await db.promise().query(`
    SELECT t.*
    FROM teams t
    JOIN team_members tm ON tm.team_id = t.id
    WHERE tm.user_id = ?
    ORDER BY t.created_at DESC
  `, [userId]);

  res.json(teams);
};

// ✅ GET TEAM DETAILS
export const getTeamDetails = async (req, res) => {
  const teamId = req.params.id;
  const userId = req.user.id;

  try {
    const [[team]] = await db.promise().query(
      "SELECT * FROM teams WHERE id = ?",
      [teamId]
    );

    const [members] = await db.promise().query(`
      SELECT u.id, u.name, tm.role
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ?
    `, [teamId]);

    const role = members.find(m => m.id === userId)?.role;

    res.json({
      team,
      members,
      role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};