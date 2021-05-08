const inquirer = require("inquirer");
const db = require("./connection");
const cTable = require("console.table");



/* Query functions */
/* view tables functions*/
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
/* add to tables functions*/
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
      init();
    });
}

async function addRole(addRoleQuestions) {
  let newAddRoleQuestions = queryDepartmentsList(addRoleQuestions);
  inquirer.prompt([...newAddRoleQuestions]).then((data) => {
    db.query(
      "SELECT id FROM departments WHERE name = ?",
      [[data.department]],
      (err, results) => {
        if (err) {
          return console.error(err.message);
        }
        let role_data = [[data.title, data.salary, results[0].id]];
        db.query(
          "INSERT INTO roles (title, salary, department_id) VALUES ?",
          [role_data],
          (err, results) => {
            if (err) {
              return console.error(err.message);
            }
            console.log(
              "Number of rows successfully added: " + results.affectedRows
            );
          }
        );
      }
    );
    init();
  });
}

function queryRolesManagersLists(addEmployeeQuestions) {
  let rolesList = [];
  db.query(`SELECT title, id FROM roles `, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      rolesList.push(rows[i].title);
    }
    addEmployeeQuestions[2].choices = rolesList;
  });
  let managersList = [];
  db.query(
    `SELECT CONCAT(first_name,", " , last_name) AS managers, id FROM employees`,
    (err, rows) => {
      for (let i = 0; i < rows.length; i++) {
        managersList.push(rows[i].managers);
      }
      addEmployeeQuestions[3].choices = managersList;
    }
  );

  return addEmployeeQuestions;
}

function queryRolesEmployeesLists(updateEmployeeRoleQuestions) {
  let rolesList = [];
  db.query(`SELECT title, id FROM roles `, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      rolesList.push(rows[i].title);
    }
    updateEmployeeRoleQuestions[2].choices = rolesList;
  });

  let employeesList = [];
  db.query(
    `SELECT CONCAT(first_name,", " , last_name) AS employee, id FROM employees`,
    (err, rows) => {
      for (let i = 0; i < rows.length; i++) {
        employeesList.push(rows[i].employee);
      }
      updateEmployeeRoleQuestions[1].choices = employeesList;
    }
  );

  return updateEmployeeRoleQuestions;
}

function queryDepartmentsList(addRoleQuestions) {
  let departmentsList = [];
  db.query(`SELECT name AS department FROM departments `, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      departmentsList.push(rows[i].department);
    }
    addRoleQuestions[2].choices = departmentsList;
  });

  return addRoleQuestions;
}

async function addEmployee(addEmployeeQuestions) {
  let newAddEmployeeQuestions = queryRolesManagersLists(addEmployeeQuestions);
  inquirer.prompt([...newAddEmployeeQuestions]).then((data) => {
    /* Get the role's id from the table*/
    let roleID = "";
    db.query(
      `SELECT id FROM roles WHERE title = ?`,
      [[data.role]],
      (err, rows) => {
        roleID = rows[0].id;

        /* Get the manager's id from the table*/
        let managerID = "";
        let splittedManagerName = data.manager.split(", ");
        let firstNameManager = splittedManagerName[0];
        let lastNameManager = splittedManagerName[1];

        db.query(
          `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`,
          [firstNameManager, lastNameManager],
          (err, rows) => {
            managerID = rows[0].id;

            /*Data to Insert in employees table*/
            let employee_data = [
              [data.firstName, data.lastName, roleID, managerID],
            ];

            db.query(
              "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ?",
              [employee_data],
              (err, results) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log(
                  "Number of rows successfully added: " + results.affectedRows
                );
              }
            );
          }
        );
      }
    );
    init();
  });
}

async function updateEmployeeRole(updateEmployeeRoleQuestions) {
  let newUpdateEmployeeRoleQuestions = queryRolesEmployeesLists(
    updateEmployeeRoleQuestions
  );
  inquirer.prompt([...newUpdateEmployeeRoleQuestions]).then((data) => {
    let roleID = "";
    let employeeFirstName = data.employeeToUpdate.split(", ")[0];
    let employeeLastName = data.employeeToUpdate.split(", ")[1];
    db.query(
      `SELECT id FROM roles WHERE title = ?`,
      [[data.role]],
      (err, rows) => {
        roleID = rows[0].id;

        db.query(
          `UPDATE employees
            SET role_id = ?
            WHERE first_name = ? AND last_name = ?`,
          [roleID, employeeFirstName, employeeLastName],
          (err, results) => {
            if (err) {
              return console.error(err.message);
            }
            console.log(
              "Number of rows successfully updated: " + results.affectedRows
            );
          }
        );
      }
    );
    init();
  });
}

/* Questions */
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
      "add an employee",
      "update an employee role",
      "exit",
    ],
  },
];

const addRoleQuestions = [
  {
    type: "input",
    name: "title",
    message: "What is the role's title?: ",
  },
  {
    type: "input",
    name: "salary",
    message: "What is the role's salary?: ",
  },
  {
    type: "list",
    name: "department",
    message: "Select the department which the role belongs to: ",
    choices: [""],
  },
];

const addEmployeeQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "What is the new employee's first name?: ",
  },
  {
    type: "input",
    name: "lastName",
    message: "What is the new employee's last name?: ",
  },
  {
    type: "list",
    name: "role",
    message: "What role will the new employee have?: ",
    choices: [""],
  },
  {
    type: "list",
    name: "manager",
    message: "Who will the new employee report to?: ",
    choices: ["none"],
  },
];

const updateEmployeeRoleQuestions = [
  {
    type: "input",
    name: "test",
    message: "",
  },

  {
    type: "list",
    name: "employeeToUpdate",
    message: "Select the employee you'd like to modify: ",
    choices: [""],
  },
  {
    type: "list",
    name: "role",
    message: "Select the new role of the employee: ",
    choices: [""],
  },
];

/* Prompts function*/
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
    if (data.action === "add a role") {
      addRole(addRoleQuestions);
    }
    if (data.action === "add an employee") {
      addEmployee(addEmployeeQuestions);
    }
    if (data.action === "update an employee role") {
      updateEmployeeRole(updateEmployeeRoleQuestions);
    }
    if (data.action === "exit") {
      process.exit();
    }
  });
}

/* App start*/
init();
