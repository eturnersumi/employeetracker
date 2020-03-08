//Require mysql, inquirer, console.table
const inquirer = require('inquirer');
require("./.gitignore/node_modules/console.table")
const mysql = require("mysql");
const util = require("util");

//mysql create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) {
        console.error(`error connecting: ${err.stack}`)
    }
    console.log(`Connected as ${connection.threadId}`)
});

// This allows to use async/await 
connection.query = util.promisify(connection.query);

//Call inquirer action function
const startMenu = () => {
    inquirer
        .prompt({
            type: "list",
            name: "selection",
            message: "Please select an action",
            choices: [
                "Add employee",
                "Add department",
                "Add role",
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Remove employee",
                "Update employee role",
                "Update employee manager"
            ]
        })
        .then((answer) => {
            switch (answer.selection) {
                case "Add employee":
                    addEmployee();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "View all employees":
                    viewEmployees();
                    break;

                case "View departments":
                    getDepartments();
                    break;

                case "View roles":
                    getRoles();
                    break;

                case "Update employee role":
                    updateEmployeeRole();
                    break;

                case "View all employees by department":
                    viewByDepartment();
                    break;

                case "View all employees by manager":
                    viewByManager();
                    break;

                case "Remove employee":
                    removeEmployee();
                    break;

                case "Update employee manager":
                    updateEmployeeManager();
                    break;

                default:
                    break;
            }
        })
}

//Function to add department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "department",
            message: "Please input a department"
        })
        .then(async function(answer) {

            // call the db and insert the department
            let result = await insertDepartment(answer.department)
             startMenu()
        })
}
// function add role -- requires title, salary, dept
async function addRole() {
    const departments = await getDepartments();
    const departmentChoices = departments.map(elem=> {
        return {
            name: elem.name,
            value: elem.id
        }
    })
    console.log(departmentChoices)
    inquirer
        .prompt({
            type: "input",
            name: "title",
            message: "Please input a role"
        },
        {
            type: "input",
            name: "salary",
            message: "Please input a salary"
        },
        {
            type: "list",
            name: "department_id",
            message: "Please select",
            choices: departmentChoices
        }
        )
        .then(async function(answer){

            // call the db and insert the department
            let result = await insertRole(answer)
             startMenu()
        })
}

// function add employee -- need to show roles and employee to choose the role id and the manager id
//add employee function
async function addEmployee() {
    const roles = await getRoles();
    const roleChoices = roles.map(elem=> {
        return {
            value: elem.id
        }
    })
    console.log(roleChoices)

    const managers = await getManagers();
    const managerChoices = managers.map(elem=> {
        return {
            value: elem.id
        }
    })

    inquirer
    .prompt({
        type: "input",
        name: "firstName",
        message: "Please enter the first name"
    },
    {
        type: "input",
        name: "lastName",
        message: "Please enter the last name"
    },
    {
        type: "list",
        name: "role_id",
        choices: roleChoices
    },
    {
        type: "list",
        name: "manager_id",
        choices: managerChoices
    }
    )
    .then(async function(answer){
        let result = await insertRole(answer)
         startMenu()
    })
}

async function updateEmployeeRole() {
    const employees = await getEmployees();
    const employeeChoices = employees.map(elem=> {
        return {
            name: elem.name
        }
    })
    const roles = await getRoles();
    const roleChoices = roles.map(elem=> {
        return {
            value: elem.id
        }
    })
    inquirer
    .prompt({
        type: "list",
        name: "employee",
        message: "Which employee do you want to update?",
        choices: employeeChoices
        },
        {
        type: "list",
        name: "role_id",
        message: "Please select a new role ID",
        choices: roleChoices
    })
}

async function updateRole(role){
    return connection.query(`
    UPDATE employee SET role_id = ?`, role)
}

// Insert department in db
async function insertDepartment(department){
    return connection.query("INSERT INTO department SET ?", department)
}

//Insert role in db
async function insertRole(role){
    return connection.query("INSERT INTO role SET ?", role)
}

//Return departments
async function getDepartments(){
    return connection.query("SELECT * FROM department")
}

//View all employees function
async function viewEmployees() {
    return connection.query("SELECT * FROM employee")
}

//View roles by ID
async function getRoles() {
    return connection.query(`
    SELECT role_id FROM employee`)
}

//View manager by ID
async function getManagers() {
    return connection.query(`
    SELECT manager_id FROM employee`)
}


//view all employees by department function
function 

//view all employees by manager function



//remove employee function

//update employee role function

//update employee manager function

startMenu();
