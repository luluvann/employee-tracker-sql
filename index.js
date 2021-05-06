const inquirer = require("inquirer");
/* const db = require("./db/db.sql"); */

/* db.query(`SELECT * FROM employees`, (err, rows) => {
    console.log(rows);
  });

  console.log("works") */

  const initialQuestion = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do:",
        choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add am employee",
            "update an employee role"
        ],
      },
  ]

  function init() {
    return inquirer.prompt([...initialQuestion]);
  }
  
  init()
  .then((data) => {
      console.log(data)
  })