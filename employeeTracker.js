const connection = require("./config/connection");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");

connection.connect(err=> {
    if (err) throw err;
    start();
});

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
                    connection.end();
                    break;
            }
        });
}

function viewDepartments(){
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res)=>{
        if (err) throw err;
        const table = [];
        res.forEach(dep =>{
            const newDep = {
                id: dep.id,
                department: dep.dep_name
            };
            table.push(newDep);                        
        });
        printTable(table);        
        start();
    })
};

function viewRoles(){
    const query = `SELECT * FROM roles`;
    connection.query(query, (err, res)=>{
        if (err) throw err;
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
        printTable(table);        
        start();
    })
};

function viewEmployees(){
    const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dep_name, roles.salary, CONCAT(m.first_name, " ", m.last_name) 'manager'
    FROM  employee
    INNER JOIN roles ON (roles.id = employee.role_id)
    INNER JOIN department ON (employee_db.department.id = employee_db.roles.dep_id)
    LEFT JOIN employee m 
	ON (employee.manager_id = m.id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res)=>{
        if (err) throw err;
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
        printTable(table);        
        start();
    })
}

function viewDepartment(){
    connection.query("SELECT * FROM department", (err, resDep) => {
        if (err) throw err;
        inquirer
            .prompt({
                name: "dep",
                type: "list",
                message: "Which department you would like to see?",
                choices: () => {
                    const depArray = [];
                    resDep.forEach(dep =>{
                        depArray.push(dep.dep_name);
                    })
                    return depArray;
                }
            })
            .then(answer =>{
                const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dep_name, roles.salary, CONCAT(m.first_name, " ", m.last_name) 'manager'
                FROM  employee
                INNER JOIN roles ON (roles.id = employee.role_id)
                INNER JOIN department ON (employee_db.department.id = employee_db.roles.dep_id)
                LEFT JOIN employee m 
                ON (employee.manager_id = m.id)
                WHERE department.dep_name=?
                ORDER BY employee.id;`;
        connection.query(query, answer.dep, (err, res)=>{
            if (err) throw err;
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
            printTable(table);        
            start();
            });
        });
    });
}



function viewManager(){
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
                choices: () => {
                    const managerArray = [];
                    resManager.forEach(manager => {
                        const managerExist = managerArray.includes(manager.manager);
                        if (!managerExist) managerArray.push(manager.manager);
                    })
                    return managerArray;
                }
            })
            .then(answer =>{
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
            printTable(table);        
            start();
            });
        });        
    });
}

function addDepartment(){
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
                    
                    resDep.forEach(department => {
                        depArray.push(department.dep_name);
                    })

                    if (value){
                        const depExist = depArray.includes(value);
                            if (!depExist) {
                                return true;
                            }else{
                                return "This department already exist."
                            }
                    }
                }
            })
            .then(answer => {
                const query = `INSERT INTO department SET dep_name=?;`;
                connection.query(query, answer.dep, err => {
                    if (err) throw err;
                    viewDepartments();
                })
            })            
    });
}

function addRole(){
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
                        
                        resRolesDep.forEach(role => {
                            titleArray.push(role.title);
                        })

                        if (value){
                            const titleExist = titleArray.includes(value);
                                if (!titleExist) {
                                    return true;
                                }else{
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
                    choices: () => {
                        const depArray = [];
                        
                        resRolesDep.forEach(dep => {
                            const depExist = depArray.includes(dep.dep_name);
                            if (!depExist) depArray.push(dep.dep_name);
                        })
                        
                        return depArray;
                    }
                }
            ])
            .then(answer => {
                
                    let depId
                    resRolesDep.forEach(dep => {
                        if (answer.dep_name === dep.dep_name) {
                            depId = dep.dep_id;
                        }
                    })
                
                const query = `INSERT INTO roles (title, salary, dep_id)
                VALUES ("${answer.title}", ${answer.salary}, ${depId});`;
                connection.query(query, err => {
                    if (err) throw err;
                    viewRoles();
                });
            });            
    });
}

function addEmployee(){
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
                    choices: () => {
                        const titleArray = [];
                        
                        resAll.forEach(role => {
                            const titleExist = titleArray.includes(role.title);
                            if (!titleExist) titleArray.push(role.title);
                        });
                        
                        return titleArray;
                    }
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Which manager team you would like to see?",
                    choices: () => {
                        const managerArray = ["Not Applicable"];
                        resAll.forEach(manager => {
                            
                            const managerExist = managerArray.includes(manager.manager);
                            if (!managerExist) managerArray.push(manager.manager);
                        })
                        const notNullString = managerArray.filter(notNull => notNull !=null);
                        return notNullString;
                    }
                }
            ])
    .then(answer => {
        let roleId
        resAll.forEach(role => {
            if (answer.role === role.title) {
                roleId = role.id;
            }
        });
        
        let managerId;
        

        resAll.forEach(manager => {
            
            if (answer.manager === manager.manager) {
                managerId = manager.manager_id;
            }

            else if (answer.manager === "Not Applicable"){
                managerId = null;
            }
            
        });
        
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.first_name}", "${answer.last_name}", ${roleId}, ${managerId});`;
                
                connection.query(query, err => {
                    if (err) throw err;
                    
                    viewEmployees(); 
                });
        
    });
    
    });
}

function updateEmployee(){
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
                    choices: () => {
                        const titleArray = [];
                        
                        resAll.forEach(role => {
                            const titleExist = titleArray.includes(role.title);
                            if (!titleExist) titleArray.push(role.title);
                        })
                        
                        return titleArray;
                    }
                }
            ])
            
            .then(answer => {
                let roleId
                resAll.forEach(role => {
                    if (answer.role === role.title) {
                        roleId = role.role_id;
                    }
                });
                
                const query = `UPDATE employee SET role_id=${roleId} WHERE first_name="${answer.first_name}" AND last_name="${answer.last_name}"`;
                connection.query(query, err => {
                    if (err) throw err;
                    viewEmployees(); 
                });
            });
               
    });
}
