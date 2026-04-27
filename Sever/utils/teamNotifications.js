import { createNotification } from "./createNotification.js";

// helper: notify multiple users
export const notifyMany = (users, payload) => {
  users.forEach((user) => {
    if (!user?.id) return;
    createNotification({ ...payload, userId: user.id });
  });
};