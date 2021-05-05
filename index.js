const db = require("./db/db.sql")

db.query(`SELECT * FROM employees`, (err, rows) => {
    console.log(rows);
  });

  console.log("works")