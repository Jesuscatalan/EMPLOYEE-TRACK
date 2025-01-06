DROP DATABASE company_database;

CREATE DATABASE company_database;

\c company_database;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(40)
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(40),
    salary DECIMAL,
    department INT,
    FOREIGN KEY (department) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);