DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(30) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dep_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (dep_id)
        REFERENCES department(id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id)
        REFERENCES roles(id),
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
);

INSERT INTO department(dep_name)
VALUES ("Finance"), ("HR"), ("Engineering");

INSERT INTO roles(title, salary, dep_id)
VALUES ("Financial Manager", 100000, 1), ("Financial Assistant", 60000, 1), ("Human Resources Manager", 80000, 2), ("HR Assistant", 50000, 2), ("Engineering Manager", 200000, 3), ("Sr Engineer", 150000, 3), ("Engineer I", 60000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Smith", 1,null), ("Rich", "Brown", 2, 1), ("John", "Johnson", 3,null), ("Robert", "Lee", 4, 3), ("Mike", "Miller", 5,null), ("Ben", "Jackson", 6, 5), ("Aaron", "Davis", 7, 5);


