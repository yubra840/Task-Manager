import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const  urlDB = `msql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;
const db = mysql.createConnection(urlDB);

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("MySQL Connected...");
  }
});

export default db;