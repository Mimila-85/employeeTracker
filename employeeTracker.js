// Import the mysql connection.
const connection = require("./config/connection");
// Import the inquirer package.
const inquirer = require("inquirer");
// Import the package that format tables in the console log.
const { printTable } = require("console-table-printer");

// Make initial connection with mysql.
connection.connect(err=> {
    if (err) throw err;
    start();
});

// This function display the first set of options for the use to chose what he/she would like to do.
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(answer => {
            // Depending of the user choice it runs the correspondent function.
            switch(answer.action){
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Employees by Department":
                    viewDepartment();
                    break;
                case "View All Employees by Manager":
                    viewManager();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployee();
                    break;
                case "Exit":
                    // Ends mysql connection.
                    connection.end();
                    break;
            }
        });
}

function viewDepartments(){
    // Select/read all columns from the table department.
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res)=>{
        if (err) throw err;
        // Create a variable to hold the object created with the response from mysql to be format as a table to be displayed to the user in the command line.
        const table = [];
        res.forEach(dep =>{
            const newDep = {
                id: dep.id,
                department: dep.dep_name
            };
            table.push(newDep);                        
        });
        // Function from console-table-printer package to format table.
        printTable(table);      
        // Run start function again to prompt user with choices to choose what he/she would like to do next.  
        start();
    })
};

function viewRoles(){
    // Select/read all columns from the table roles.
    const query = `SELECT * FROM roles`;
    connection.query(query, (err, res)=>{
        if (err) throw err;
        // Create a variable to hold the object created with the response from mysql to be format as a table to be displayed to the user in the command line.
        const table = [];
        res.forEach(role =>{
            const newRole = {
                id: role.id,
                title: role.title,
                salary: role.salary,
                department: role.dep_id
            };
            table.push(newRole);                        
        });
        // Function from console-table-printer package to format table.
        printTable(table); 
        // Run start function again to prompt user with choices to choose what he/she would like to do next.  
        start();
    })
};

function viewEmployees(){
    // Select/read the described columns from the respective tables, also concatenate(join) employee first name and last name to create a new column called manager. Inner join tables roles and department tables with employee table on the columns that the ids match (foreign keys). Also left join the new manager column on employee.manager_id = m.id. 
    const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dep_name, roles.salary, CONCAT(m.first_name, " ", m.last_name) 'manager'
    FROM  employee
    INNER JOIN roles ON (roles.id = employee.role_id)
    INNER JOIN department ON (employee_db.department.id = employee_db.roles.dep_id)
    LEFT JOIN employee m 
	ON (employee.manager_id = m.id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res)=>{
        if (err) throw err;
        // Create a variable to hold the object created with the response from mysql to be format as a table to be displayed to the user in the command line.
        const table = [];
        res.forEach(employee =>{
            const newEmployee= {
                id: employee.id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                title: employee.title,
                department: employee.dep_name,
                salary: employee.salary,
                manager: employee.manager
            };
            table.push(newEmployee);                        
        });
        // Function from console-table-printer package to format table.
        printTable(table);   
        // Run start function again to prompt user with choices to choose what he/she would like to do next.     
        start();
    })
}

function viewDepartment(){
    // Select/read all columns from the table department.
    connection.query("SELECT * FROM department", (err, resDep) => {
        if (err) throw err;
        // Prompt user to choose a department.
        inquirer
            .prompt({
                name: "dep",
                type: "list",
                message: "Which department you would like to see?",
                // Arrow function that takes the response from the mysql connection, loop through the departments names and return as choices for the user.
                choices: () => {
                    const depArray = [];
                    resDep.forEach(dep =>{
                        depArray.push(dep.dep_name);
                    })
                    return depArray;
                }
            })
            .then(answer =>{
                // Uses the same query select syntax from function viewEmloyees. With the addition of WHERE department.dep_name=? to display only the employees for the selected department.
                const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dep_name, roles.salary, CONCAT(m.first_name, " ", m.last_name) 'manager'
                FROM  employee
                INNER JOIN roles ON (roles.id = employee.role_id)
                INNER JOIN department ON (employee_db.department.id = employee_db.roles.dep_id)
                LEFT JOIN employee m 
                ON (employee.manager_id = m.id)
                WHERE department.dep_name=?
                ORDER BY employee.id;`;
        // Use the query syntax substitute the ? on WHERE department.dep_name=? with the department name selected by the user.        
        connection.query(query, answer.dep, (err, res)=>{
            if (err) throw err;
            // Create a variable to hold the object created with the response from mysql to be format as a table to be displayed to the user in the command line.
            const table = [];
            res.forEach(employee =>{
                const newEmployee= {
                    id: employee.id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    title: employee.title,
                    department: employee.dep_name,
                    salary: employee.salary,
                    manager: employee.manager
                };
                table.push(newEmployee);                        
            });
            // Function from console-table-printer package to format table.
            printTable(table);   
            // Run start function again to prompt user with choices to choose what he/she would like to do next.      
            start();
            });
        });
    });
}



function viewManager(){
    // Select/read concatenate(join) employee first name and last name to create a new column called manager, and join the new manager column on employee.manager_id = m.id. It also display the result by alphabetical order. 
    const queryManager = `SELECT CONCAT(m.first_name, " ", m.last_name) 'manager'
    FROM  employee
    JOIN employee m 
    ON (employee.manager_id = m.id)
    ORDER BY manager ASC;`
    connection.query(queryManager, (err, resManager) => {
        if (err) throw err;
        inquirer
            .prompt({
                name: "manager",
                type: "list",
                message: "Which manager team you would like to see?",
                // Arrow function that takes the response from the mysql connection, loop through the managers names and return as choices for the user.
                choices: () => {
                    const managerArray = [];
                    resManager.forEach(manager => {
                        // Returns a boolean value to verify if the manager already exist inside the array, so we don't repeat names.
                        const managerExist = managerArray.includes(manager.manager);
                        // If mangerExist returns false, then push to the array.
                        if (!managerExist) managerArray.push(manager.manager);
                    })
                    return managerArray;
                }
            })
            .then(answer =>{
                // Uses the same query select syntax from function viewEmloyees. With the addition of WHERE CONCAT(m.first_name, " ", m.last_name)=? to display only the employees under the selected manager.
                const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dep_name, roles.salary, CONCAT(m.first_name, " ", m.last_name) 'manager'
                FROM  employee
                INNER JOIN roles ON (roles.id = employee.role_id)
                INNER JOIN department ON (employee_db.department.id = employee_db.roles.dep_id)
                LEFT JOIN employee m 
                ON (employee.manager_id = m.id)
                WHERE CONCAT(m.first_name, " ", m.last_name)=?
                ORDER BY employee.id;`;
        connection.query(query, answer.manager, (err, res)=>{
            if (err) throw err;
            // Create a variable to hold the object created with the response from mysql to be format as a table to be displayed to the user in the command line.
            const table = [];
            res.forEach(employee =>{
                const newEmployee= {
                    id: employee.id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    title: employee.title,
                    department: employee.dep_name,
                    salary: employee.salary,
                    manager: employee.manager
                };
                table.push(newEmployee);                        
            });
            // Function from console-table-printer package to format table.
            printTable(table);  
            // Run start function again to prompt user with choices to choose what he/she would like to do next.
            start();
            });
        });        
    });
}

function addDepartment(){
    // Select/read column dep_name from table department.
    const queryDep = `SELECT dep_name FROM department;`
    connection.query(queryDep, (err, resDep) => {
        if (err) throw err;
        inquirer
            .prompt({
                name: "dep",
                type: "input",
                message: "What is the name of the department you would like to add?",
                // Check if the department already exist before creating it.
                validate: value => {
                    const depArray = [];
                    // Push all dep_name from our table to the depArray.
                    resDep.forEach(department => {
                        depArray.push(department.dep_name);
                    })

                    if (value){
                        // Returns a boolean value to verify if the department already exist inside the array, so we don't repeat names.
                        const depExist = depArray.includes(value);
                        // If depExist returns false, then return true, which allows the new department to be added to the table.
                        if (!depExist) {
                            return true;
                        }else{
                            // If the depExist returns true, it means the department already exist; therefore, we notify the user.
                            return "This department already exist."
                        }
                    }
                }
            })
            .then(answer => {
                // Insert/Add to the table departmet on column dep_name the name entered by the user.
                const query = `INSERT INTO department SET dep_name=?;`;
                connection.query(query, answer.dep, err => {
                    if (err) throw err;
                    // Call function viewDepartments to display the department table with the added row.
                    viewDepartments();
                })
            })            
    });
}

function addRole(){
    // Select/read the described columns and right join roles and department table on the foreign key dep_id.
    const queryRoles = `SELECT roles.title, department.dep_name, department.id AS dep_id
    FROM roles
    RIGHT JOIN department
    ON roles.dep_id = department.id;`
    connection.query(queryRoles, (err, resRolesDep) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What title you would like to add?",
                    // Check if role already exist before creating it.
                    validate: value => {
                        const titleArray = [];
                        // Push all titles from our table to the titleArray.
                        resRolesDep.forEach(role => {
                            titleArray.push(role.title);
                        })

                        if (value){
                            // Returns a boolean value to verify if the title already exist inside the array, so we don't repeat titles.
                            const titleExist = titleArray.includes(value);
                            // If titleExist returns false, then return true, which allows the new title to be added to the table.    
                            if (!titleExist) {
                                    return true;
                            }else{
                                // If the titleExist returns true, it means the title already exist; therefore, we notify the user.
                                return "This title already exist."
                            }
                        }
                    }
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for this role?",
                    // Check if user entered a number.
                    validate: value => {
                        if (!isNaN(value)){
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "dep_name",
                    type: "list",
                    message: "Please select a department.",
                    // // Arrow function that takes the response from the mysql connection, loop through the departments names and return as choices for the user.
                    choices: () => {
                        const depArray = [];
                        
                        resRolesDep.forEach(dep => {
                            // Returns a boolean value to verify if the department already exist inside the array, so we don't repeat names.
                            const depExist = depArray.includes(dep.dep_name);
                            // If depExist returns false, push the dep_name to the depArray.
                            if (!depExist) depArray.push(dep.dep_name);
                        });                        
                        return depArray;
                    }
                }
            ])
            .then(answer => {
                let depId
                // Loop through the initial query result to compare where the answer from the user match with the department on our table, grab the department id for the respective dep_name and make it to be our dep_id to be inserted in our table.
                resRolesDep.forEach(dep => {
                    if (answer.dep_name === dep.dep_name) {
                        depId = dep.dep_id;
                    }
                })
                // Insert/Add to the table roles on columns title, salary, and dep_id as entered by the user.
                const query = `INSERT INTO roles (title, salary, dep_id)
                VALUES ("${answer.title}", ${answer.salary}, ${depId});`;
                connection.query(query, err => {
                    if (err) throw err;
                    // Call function viewRoles to display the roles table with the added row.
                    viewRoles();
                });
            });            
    });
}

function addEmployee(){
    // Select/read the described columns from the respective tables, also concatenate(join) employee first name and last name to create a new column called manager. Right join table roles with employee table on the columns that the ids match (foreign keys). Also left join the new manager column on employee.manager_id = m.id. Sorted by manager name.
    const queryAll = `SELECT employee.id, employee.first_name, employee.last_name, roles.id, roles.title, employee.manager_id,CONCAT(m.first_name, " ", m.last_name) 'manager'
    FROM  employee
    RIGHT JOIN roles ON (roles.id = employee.role_id)
    LEFT JOIN employee m 
	ON (employee.manager_id = m.id)
    ORDER BY manager ASC;`
    connection.query(queryAll, (err, resAll) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                   name: "first_name",
                   type: "input",
                   message: "What is the employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    // Arrow function that takes the response from the mysql connection, loop through the titles and return as choices for the user.
                    choices: () => {
                        const titleArray = [];
                        
                        resAll.forEach(role => {
                            // Returns a boolean value to verify if the title already exist inside the array, so we don't repeat titles.
                            const titleExist = titleArray.includes(role.title);
                            // If titleExist returns false, push the title to the titleArray.    
                            if (!titleExist) titleArray.push(role.title);
                        });
                        return titleArray;
                    }
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Which manager team you would like to see?",
                    // Arrow function that takes the response from the mysql connection, loop through the manager names and return as choices for the user. Also includes a Not Applicable option for employees who does not have a manager.
                    choices: () => {
                        const managerArray = ["Not Applicable"];
                        resAll.forEach(manager => {
                            // Returns a boolean value to verify if the manager already exist inside the array, so we don't repeat names.
                            const managerExist = managerArray.includes(manager.manager);
                            // If mangerExist returns false, then push to the array.
                            if (!managerExist) managerArray.push(manager.manager);
                        });
                        // Eliminates the null options from the array.
                        const notNullString = managerArray.filter(notNull => notNull !=null);
                        return notNullString;
                    }
                }
            ])
            .then(answer => {
                let roleId
                // Loop through the initial query result to compare where the answer from the user match with the title on our table, grab the role id for the respective title and make it to be our role id to be inserted in our table.
                resAll.forEach(role => {
                    if (answer.role === role.title) {
                        roleId = role.id;
                    }
                });
                
                let managerId;
                // Loop through the initial query result to compare where the answer from the user match with the manager on our table, grab the manager id for the respective title and make it to be our manager id to be inserted in our table. If user select Not Applicable, then managerId = null.
                resAll.forEach(manager => {
                    if (answer.manager === manager.manager) {
                        managerId = manager.manager_id;
                    }
                    else if (answer.manager === "Not Applicable"){
                        managerId = null;
                    }
                });
                // Insert/Add to the table employee on columns first_name, last_name, role_id and manager_id as entered by the user.
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES ("${answer.first_name}", "${answer.last_name}", ${roleId}, ${managerId});`;
                        
                connection.query(query, err => {
                    if (err) throw err;
                    // Call function viewEmployees to display the employees table with the added row.
                    viewEmployees(); 
                });
            });
    });
}

function updateEmployee(){
    // Select/read the described columns from the respective tables, also concatenate(join) employee first name and last name to create a new column called manager. Right join tables roles and department with employee table on the columns that the ids match (foreign keys). Also left join the new manager column on employee.manager_id = m.id. Sorted by manager name.
    const queryAll = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.id AS role_id, department.dep_name, roles.salary, CONCAT(m.first_name, " ", m.last_name) 'manager'
    FROM  employee
    RIGHT JOIN roles ON (roles.id = employee.role_id)
    RIGHT JOIN department ON (employee_db.department.id = employee_db.roles.dep_id)
    LEFT JOIN employee m 
    ON (employee.manager_id = m.id)
    ORDER BY manager ASC;`
    connection.query(queryAll, (err, resAll) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's new role?",
                    // Arrow function that takes the response from the mysql connection, loop through the titles and return as choices for the user.
                    choices: () => {
                        const titleArray = [];
                        resAll.forEach(role => {
                            // Returns a boolean value to verify if the title already exist inside the array, so we don't repeat titles.
                            const titleExist = titleArray.includes(role.title);
                            // If titleExist returns false, push the title to the titleArray.
                            if (!titleExist) titleArray.push(role.title);
                        });
                        return titleArray;
                    }
                }
            ])
            .then(answer => {
                let roleId
                // Loop through the initial query result to compare where the answer from the user match with the title on our table, grab the role id for the respective title and make it to be our role id to be inserted in our table.
                resAll.forEach(role => {
                    if (answer.role === role.title) {
                        roleId = role.role_id;
                    }
                });
                // Update the employee table with the new selected role id where the first name and last name match with the user response.
                const query = `UPDATE employee SET role_id=${roleId} WHERE first_name="${answer.first_name}" AND last_name="${answer.last_name}"`;
                connection.query(query, err => {
                    if (err) throw err;
                    // Call function viewEmployees to display the employees table with the updated row.
                    viewEmployees(); 
                });
            });
    });
}
