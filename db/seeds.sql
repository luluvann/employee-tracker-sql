INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Michael', 'Scott', 1, 2),
  ('David', 'Wallace', 2, ''),
  ('Jim', 'Halpert', 3, 1),
  ('Dwight', 'Schrute', 4, 3),
  ('Andy', 'Bernard', 4, 3),
  ('Angela', 'Martin', 5, 1),
  ('Toby', 'Flenderson', 6, 2),

INSERT INTO roles
  (title, salary, department_id)
VALUES
  ('Branch Manager', 150000, 1),
  ('CEO', 200000, 1),
  ('Sales Lead', 100000, 2),
  ('Sales person', 90000, 2),
  ('Accountant', 80000, 3),
  ('HR representant', 80000, 1),

  INSERT INTO departments
  (name)
VALUES
  ('Corporate'),
  ('Sales'),
  ('Finance') 
 

