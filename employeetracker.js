//Require mysql, inquirer, console.table
const inquirer = require('inquirer');
require("./.gitignore/node_modules/console.table")
const mysql = require("mysql");
const util = require("util");

//mysql create connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) {
        console.error(`error connecting: ${err.stack}`)
    }
    console.log(`Connected as ${connection.threadId}`)
    startMenu();
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
                "View all employees",
                "View departments",
                "View roles",
                "Add department",
                "Add employee",
                "Add role",
                "Update employee role",
                "View all employees by department",
                "View all employees by manager",
                "Remove employee",
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
            console.log(answer.department)
            insertDepartment(answer.department)
            //startMenu();
        })
}
// function add role -- requires title, salary, dept
async function addRole() {
    const departments = await getDepartments();
    const departmentChoices = await departments.map(function(elem) {
        return {
            name: elem.name,
            value: elem.id
        }
    })
    console.log(departmentChoices)
    inquirer
        .prompt({
            type: "input",
            name: "role",
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
            insertRole(answer.role)
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
    connection.query(`
    UPDATE employee SET role_id = ?`, role, function(err, result) {
        if (err) throw err;
        console.log(result)
    })
    startMenu();
}

// Insert department in db
function insertDepartment(department){
    connection.query("INSERT INTO department SET ?", department, function(err, result) {
        if (err) throw err;
        //console.log(result)
    })
    startMenu();
}

//Insert role in db
async function insertRole(role){
    connection.query("INSERT INTO role SET ?", role, function(err, result) {
        if (err) throw err;
        console.log(result)
    })
    startMenu();
}

//Return departments
async function getDepartments(){
    connection.query("SELECT * FROM department", function(err, result) {
        if (err) throw err;
        console.log(result)
    })
    startMenu();
}

//View all employees function
function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, result) {
        if (err) throw err;
        console.log(result)
    })
    startMenu();
}

//View roles by ID
function getRoles() {
    connection.query(`
    SELECT role_id FROM employee`, function(err, result) {
        if (err) throw err;
        console.log(result)
    })
    startMenu();
}

//View manager by ID
async function getManagers() {
    connection.query(`
    SELECT manager_id FROM employee`)
}


//view all employees by department function
//function 

//view all employees by manager function



//remove employee function

//update employee role function

//update employee manager function

//startMenu();
