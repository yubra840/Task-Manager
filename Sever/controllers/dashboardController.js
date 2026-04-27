import db from "../config/db.js";

export const getDashboardStats = (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name.toLowerCase();

  const sql = `
    SELECT 
      COUNT(*) AS totalTasks,

      SUM(CASE WHEN status = 'in progress' THEN 1 ELSE 0 END) AS inProgress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending

    FROM tasks
    WHERE 
      user_id = ?
      OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(assigned_to, '$[*]'))) LIKE ?
  `;

  db.query(sql, [userId, `%${userName}%`], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
};