//Sever/server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/tasks.js";
import contactRoutes from "./routes/contactRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import teamTaskRoutes from "./routes/teamTaskRoutes.js";
import commentRoutes from "./routes/teamTaskCommentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notifications.js";



dotenv.config();
console.log("JWT SECRET:", process.env.JWT_SECRET);


const app = express();
const corsOptions = {
  origin: "https://task-manager-hcmw.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// ✅ Handle preflight

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/team-tasks", teamTaskRoutes);
app.use("/api/team-task-comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});