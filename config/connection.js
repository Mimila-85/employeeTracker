const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,

    port: process.env.PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASS,

    database: process.env.DB_DB,
});

module.exports = connection;