const inquirer = require("inquirer");
const db = require("./connection");
const cTable = require("console.table");

async function viewAllDepartments() {
  db.query(`SELECT name AS 'department', id FROM departments`, (err, rows) => {
    const table = cTable.getTable(rows);
    console.log("\n", "\n", "All Departments", "\n", table, "\n", "\n");
  });
  await init();
}

async function viewAllRoles() {
  db.query(
    `SELECT roles.title, roles.id, departments.name AS 'department', roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`,
    (err, rows) => {
      const table = cTable.getTable(rows);
      console.log("\n", "\n", "All Roles", "\n", table, "\n", "\n");
    }
  );
  await init();
}

async function viewAllEmployees() {
  db.query(
    `SELECT 
    e.id, 
    e.first_name, 
    e.last_name, 
    roles.title, 
    departments.name AS 'department',
    roles.salary,
    CONCAT(m.first_name,' ' ,m.last_name) AS 'manager' 
  FROM employees e 
  LEFT JOIN employees m ON e.manager_id = m.id
  LEFT JOIN roles ON e.role_id = roles.id 
  LEFT JOIN departments ON roles.department_id = departments.id`,
    (err, rows) => {
      const table = cTable.getTable(rows);
      console.log("\n", "\n", "All Employees", "\n", table, "\n", "\n");
    }
  );
  await init();
}

async function addADepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Enter the name of the department to add: ",
      },
    ])
    .then((data) => {
      let department_name = [[data.addDepartment]];
      console.log(department_name);
      db.query(
        "INSERT INTO departments (name) VALUES ?",
        [department_name],
        (err, results) => {
          if (err) {
            return console.error(err.message);
          }
          console.log(
            "Number of rows successfully added: " + results.affectedRows
          );
        }
      );
    });
  await init();
}

const addRoleQuestions = [
  {
    type: "input",
    name:"title",
    message:"What is the role's title?: "
  },
  {
    type: "input",
    name:"title",
    message:"What is the role's salary?: "
  },
  {
    type: "input",
    name:"title",
    message:"What is the deparment's ID which the role belongs to?: "
  },
];

const initialQuestion = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do: ",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add a employee",
      "update an employee role",
      "exit",
    ],
  },
];

function init() {
  inquirer.prompt([...initialQuestion]).then((data) => {
    if (data.action === "view all employees") {
      viewAllEmployees();
    }
    if (data.action === "view all roles") {
      viewAllRoles();
    }
    if (data.action === "view all departments") {
      viewAllDepartments();
    }
    if (data.action === "add a department") {
      addADepartment();
    }
    if (data.action === "exit") {
      process.exit();
    }
  });
}

init();
