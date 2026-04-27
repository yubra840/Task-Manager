import db from "../config/db.js";

// GET ALL NOTIFICATIONS
export const getNotifications = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// MARK AS READ
export const markAsRead = (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Notification marked as read" });
    }
  );
};

export const getUnreadCount = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT COUNT(*) AS count
    FROM notifications
    WHERE user_id = ? AND is_read = FALSE
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ count: result[0].count });
  });
};