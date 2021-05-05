DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;

CREATE TABLE employees (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER FOREIGN KEY,
  manager_id INTEGER, 
  FOREIGN KEY(manager_id)
  REFERENCES roles(id)
  ON DELETE SET NULL
)

CREATE TABLE roles (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10,2),
  department_id INTEGER, 
  FOREIGN KEY(department_id)
  REFERENCES departments(id)
  ON DELETE SET NULL
)

CREATE TABLE departments (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
)

