const { Pool } = require("pg");
require("dotenv").config();

let dbUrl = process.env.DATABASE_URL || "";
if (dbUrl.includes("sslmode=require")) {
  dbUrl = dbUrl.replace("sslmode=require", "sslmode=verify-full");
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: dbUrl.includes("localhost")
    ? false
    : { rejectUnauthorized: false }
});

module.exports = pool;