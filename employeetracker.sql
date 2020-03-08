drop database if exists employee_trackerDB;
create database employee_trackerDB;
use employee_trackerDB;

create table department (
    id INT auto_increment NOT NULL,
    PRIMARY KEY (id),
    name VARCHAR(30) NOT NULL
);

create table role (
    id INT auto_increment NOT NULL,
    PRIMARY KEY (id),
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

create table employee (
    id INT auto_increment NOT NULL,
    PRIMARY KEY (id),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role (id),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);


select * from employee;
select * from role;
select * from department;


INSERT INTO department (name)
VALUES ("Information Technology"), ("Finance"), ("Engineering"), ("Sales"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 80000, 4), ("Software Engineer", 90000, 3), ("Accountant", 70000, 2), ("Technical Support", 75000, 1), ("Attorney", 95000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Brown", 6, 2), ("Cam", "Cobb", 7, 3), ("Deb", "Dunn", 8, 4), ("Eric", "Ellen", 9, 5), ("Fred", "Fulton", 10, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bob", "Brown", 6), ("Cam", "Cobb", 7), ("Deb", "Dunn", 8), ("Eric", "Ellen", 9), ("Fred", "Fulton", 10);

UPDATE employee SET manager_id=12 WHERE id=13;