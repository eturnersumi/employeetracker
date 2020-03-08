/*
Naming Conventions
*/

drop database if exists employee_trackerDB;
create database employee_trackerDB;
use employee_trackerDB;

create table employee (
    id INT NOT NULL,
    PRIMARY KEY (id),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role (id),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

create table role (
    id INT NOT NULL,
    PRIMARY KEY (id),
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

create table department (
    id INT NOT NULL,
    PRIMARY KEY (id),
    name VARCHAR(30) NOT NULL
);


select * from employee;
select * from role;
select * from department;
