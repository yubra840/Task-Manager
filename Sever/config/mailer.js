//Sever/config/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
        user: "demoprojects254@gmail.com",
        pass: "asid qlje zfly aazm",
  },
});

export default transporter;