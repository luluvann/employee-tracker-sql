INSERT INTO departments (name)
VALUES ('Corporate'),
  ('Sales'),
  ('Finance') ;

INSERT INTO roles (title, salary, department_id)
VALUES ('Branch Manager', 150000, 1),
  ('CEO', 200000, 1),
  ('Sales Lead', 100000, 2),
  ('Sales person', 90000, 2),
  ('Accountant', 80000, 3),
  ('HR representant', 80000, 1);
 

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'Scott', 1, 2),
  ('David', 'Wallace', 2, NULL),
  ('Jim', 'Halpert', 3, 1),
  ('Dwight', 'Schrute', 4, 3),
  ('Angela', 'Martin', 5, 1),
  ('Toby', 'Flenderson', 6, 2);



/* SELECT e.id, e.first_name, m.first_name FROM employees e INNER JOIN employees m ON e.id = m.manager_id;
 */
