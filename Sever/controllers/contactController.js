import db from "../config/db.js";

// Get all users except current user
export const getAllUsers = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT id, name, profile_pic 
    FROM users 
    WHERE id != ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get my contacts
export const getMyContacts = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT u.id, u.name, u.profile_pic
    FROM contacts c
    JOIN users u ON c.contact_id = u.id
    WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Add contact
export const addContact = (req, res) => {
  const userId = req.user.id;
  const { contactId } = req.body;

  const query = `
    INSERT INTO contacts (user_id, contact_id)
    VALUES (?, ?)
  `;

  db.query(query, [userId, contactId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Contact added" });
  });
};

// Remove contact
export const removeContact = (req, res) => {
  const userId = req.user.id;
  const { contactId } = req.body;

  const query = `
    DELETE FROM contacts
    WHERE user_id = ? AND contact_id = ?
  `;

  db.query(query, [userId, contactId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Contact removed" });
  });
};