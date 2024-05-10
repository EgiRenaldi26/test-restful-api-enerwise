const mysql = require("mysql");

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test-api-kwh",
});

database.connect((err) => {
  if (err) throw err;
  console.log("Database Test API Connected");
});

module.exports = database;
