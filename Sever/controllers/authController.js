//Sever/controllers/authController.js
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../config/mailer.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(400).json({ error: "User already exists" });
      }

      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
      
  });
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  const expiry = Date.now() + 1000 * 60 * 10; // 10 minutes

  const sql = "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?";

    db.query(sql, [token, expiry, email], (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const resetLink = `https://task-manager-six-lake-86.vercel.app/reset-password/${token}`;

      transporter.sendMail({
        to: email,
        subject: "Password Reset",
        html: `<h3>Click link to confirm reset</h3>
               <a href="${resetLink}">${resetLink}</a>`,
      });

      res.json({ message: "Reset link sent to email" });
    });
};

// ================= RESET PASSWORD =================
export const resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  const sql =
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?";

  db.query(sql, [token, Date.now()], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateSql =
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?";

      db.query(updateSql, [hashedPassword, token], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Failed to update password" });
        }

        return res.json({ message: "Password reset successful" });
      });
    } catch (hashErr) {
      return res.status(500).json({ error: "Password hashing failed" });
    }
  });
};
