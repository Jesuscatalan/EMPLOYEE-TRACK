INSERT INTO department (name) VALUES 
('Finance'), 
('Legal'), 
('Engineering'), 
('Sales'),
('HR');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Software Engineer', 165000, 3),
    ('Sales Lead', 100000, 4),
    ('Accountant', 95000, 1),
    ('Lawyer', 100000, 2),
    ('HR Manager', 95000, 5),
    ('Sales Associate', 55000, 4),
    ('Finance Manager', 110000, 1),
    ('Legal Team Lead', 135000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Maria', 'Lopez', 1, 2),
    ('Jordan', 'Johnson', 2, 1),
    ('Mark', 'Young', 3, 1),
    ('Geovanni', 'Hill', 4, 3),
    ('Jose', 'Franks', 5, 3),
    ('Alondra', 'Perez', 6, 2),
    ('Amanda', 'Gill', 7, 3),
    ('Viviana', 'Rojas', 8, 4);