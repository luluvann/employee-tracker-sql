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

  module.exports = {initialQuestion, addRoleQuestions, addEmployeeQuestions, updateEmployeeRoleQuestions}