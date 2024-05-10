const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./config");
const port = 3000;

app.use(express.json());
app.use(cors());

// GET /api/users
app.get("/api/users", (req, res) => {
  const getUsers = "SELECT * FROM users";
  database.query(getUsers, (err, fields) => {
    if (err) throw err;
    res.json({
      success: true,
      message: "Getting users data",
      data: fields,
    });
  });
});

// GET /api/user?id={id}
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const getIdUsers = `SELECT * FROM users WHERE id = ${id}`;
  database.query(getIdUsers, (err, fields) => {
    if (err) throw err;
    res.json({
      success: true,
      message: "Getting Users By Id",
      data: fields,
    });
  });
});

// - POST /api/user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  const postTesti = `INSERT INTO users ( name , email ) VALUES ('${name}' , '${email}')`;
  database.query(postTesti, (err, fields) => {
    if (err) {
      console.error("Gagal menyimpan data ke database:", err);
      res.status(500).json({ message: "Gagal menyimpan data ke database" });
      return;
    }
    console.log("Insert users Berhasil!", { fields });
    res.status(201).json({ message: "Data berhasil disimpan ke database" });
  });
});

// PATCH /api/user?id={id}
app.patch("/api/users/:id", (req, res) => {
  const { name, email } = req.body;
  const id = req.body.id;
  const postTesti = `UPDATE users SET name = '${name}'  , email = '${email}' WHERE id = '${id}' `;
  database.query(postTesti, (err, fields) => {
    if (err) {
      console.error("Gagal menyimpan data ke database:", err);
      res.status(500).json({ message: "Gagal menyimpan data ke database" });
      return;
    }
    console.log("Update users Berhasil!", { fields });
    res.status(201).json({ message: "Data berhasil disimpan ke database" });
  });
});

// 2 . Tampilkan total penggunaan kwh per hari pada setiap kwh meter.
app.get("/api/kwh-usage", (req, res) => {
  const getKwhUsage = `
        SELECT
          kwh_meter_id,
          DATE_FORMAT(date, '%d/%m/%Y') AS date,
          SUM(kwh_usage) AS total_usage
        FROM
          kwh_usage
        GROUP BY
          kwh_meter_id,
          DATE(date)
        ORDER BY
          kwh_meter_id,
          DATE(date)`;
  database.query(getKwhUsage, (err, result) => {
    if (err) throw err;

    const data = result.map((row) => ({
      kwh_meter_id: row.kwh_meter_id,
      date: row.date,
      total_usage: row.total_usage,
    }));

    res.json({
      success: true,
      message: "Getting Kwh Usage data",
      data: data,
    });
  });
});

app.listen(port, () => {
  console.log("Server Running PORT", port);
});
