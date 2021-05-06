const inquirer = require("inquirer");
const db = require("./connection");
const cTable = require("console.table");

function viewAllDepartments() {
  db.query(`SELECT name AS 'department', id FROM employees`, (err, rows) => {
    const table = cTable.getTable(rows);
    console.log(table);
  });
  init();
}

function viewAllRoles() {
  db.query(
    `SELECT roles.title, roles.id, departments.name AS 'department', roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`,
    (err, rows) => {
      const table = cTable.getTable(rows);
      console.log(table);
    }
  );
  init();
}

function viewAllEmployees() {
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
      console.log(table);
    }
  );
  init();
}

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
      "update an employee role",
    ],
  },
];

function init() {
  return inquirer.prompt([...initialQuestion]);
}

init().then((data) => {
  if (data.action === "view all employees") {
    viewAllEmployees();
  } else if (data.action === "view all roles") {
    viewAllRoles();
  } else if (data.action === "view all departments") {
    viewAllDepartments();
  }
});
