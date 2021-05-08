const inquirer = require("inquirer");
const db = require("./connection");
const cTable = require("console.table");

/* import questions */
const questions = require("./questions");

const initialQuestion = questions.initialQuestion;
const addDepartmentQuestion = questions.addDepartmentQuestion;
const addRoleQuestions = questions.addRoleQuestions;
const addEmployeeQuestions = questions.addEmployeeQuestions;
const updateEmployeeRoleQuestions = questions.updateEmployeeRoleQuestions;

/* Query functions */
/* view tables functions*/

async function viewTable(sqlQuery, tableName) {
  db.query(sqlQuery, (err, rows) => {
    const table = cTable.getTable(rows);
    console.log("\n", "\n", `All ${tableName}`, "\n", table, "\n", "\n");
  });
  await prompt();
}

function viewAllDepartments() {
  const sqlQuery = `SELECT name AS 'department', id FROM departments`;
  const tableName = "Departments";
  viewTable(sqlQuery, tableName);
}

function viewAllRoles() {
  const sqlQuery = `SELECT roles.title, roles.id, departments.name AS 'department', roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
  const tableName = "Roles";
  viewTable(sqlQuery, tableName);
}

function viewAllEmployees() {
  const sqlQuery = `SELECT 
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
              LEFT JOIN departments ON roles.department_id = departments.id`;
  const tableName = "Employees";
  viewTable(sqlQuery, tableName);
}

/* Get the choices in the prompt questions*/
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

/* add to tables functions*/
async function addADepartment() {
  inquirer.prompt([...addDepartmentQuestion]).then((data) => {
    const sql = "INSERT INTO departments (name) VALUES ?";
    let department_name = [[data.addDepartment]];

    db.query(sql, [department_name], (err, results) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Number of rows successfully added: " + results.affectedRows);
    });
    prompt();
  });
}

async function addRole(addRoleQuestions) {
  let newAddRoleQuestions = queryDepartmentsList(addRoleQuestions);
  inquirer.prompt([...newAddRoleQuestions]).then((data) => {
    const sql = "SELECT id FROM departments WHERE name = ?";
    db.query(sql, [[data.department]], (err, results) => {
      if (err) {
        return console.error(err.message);
      }
      let role_data = [[data.title, data.salary, results[0].id]];
      const sqlInsert =
        "INSERT INTO roles (title, salary, department_id) VALUES ?";
      db.query(sqlInsert, [role_data], (err, results) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(
          "Number of rows successfully added: " + results.affectedRows
        );
      });
    });
    prompt();
  });
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
    prompt();
  });
}

/* Update functions*/
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
    prompt();
  });
}

/* Prompts function*/
function prompt() {
  inquirer.prompt([...initialQuestion]).then((data) => {
    if (data.action === "view all employees") {
      viewAllEmployees();
    } else if (data.action === "view all roles") {
      viewAllRoles();
    } else if (data.action === "view all departments") {
      viewAllDepartments();
    } else if (data.action === "add a department") {
      addADepartment();
    } else if (data.action === "add a role") {
      addRole(addRoleQuestions);
    } else if (data.action === "add an employee") {
      addEmployee(addEmployeeQuestions);
    } else if (data.action === "update an employee role") {
      updateEmployeeRole(updateEmployeeRoleQuestions);
    } else if (data.action === "exit") {
      process.exit();
    }
  });
}

/* App start*/
prompt();
