// utils/createNotification.js
import db from "../config/db.js";

export const createNotification = ({
  userId,
  senderName,
  senderAvatar,
  message,
  type,
  referenceId
}) => {
  const sql = `
    INSERT INTO notifications 
    (user_id, sender_name, sender_avatar, message, type, reference_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    userId,
    senderName,
    senderAvatar,
    message,
    type,
    referenceId
  ]);
};

