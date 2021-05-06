DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments(
  id INTEGER AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE roles(
  id INTEGER AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10,2) NOT NULL,
  department_id INTEGER, 
  PRIMARY KEY(id),
  CONSTRAINT fk_departmentID 
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);

CREATE TABLE employees(
  id INTEGER AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT fk_roleID 
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);




