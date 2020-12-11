![License](https://img.shields.io/badge/license-MIT-blue)
# Employee Tracker

## Description

This is command application helps you to easily view and manage the departments, roles, and employees in your company. 

## Table of Contents

* [Installation](#installation)

* [Usage](#usage)

* [License](#license)

* [Contributing](#contributing)

* [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:
```
npm i
```
It will install `inquirer`, `mysql`, `dotenv`, and `console-table-printer`.
`inquirer` is used to prompt questions on your command line.
`mysql` creates a connection between your MySQL database and this application.
`dotenv` will protect your credentials, check `.env.EXAMPLE` to see what you need on your `.env` file.
` console-table-printer` is used to format your tables on the command line response.

## Usage

To start, run on your command line `npm start`, this will prompt a series of questions to ask what you would like to do. The options include:
* View All Departments
	* This will print your **department** table in the command line.
 * View All Roles
	* This will print your **roles** table in the command line.
* View All Employees
	* This will print an **employee** table which will list the employee id, first name, last name, title, department name, salary, and manager name if applicable.
* View All Employees by Department
	* This will print an **employee** table which will list the employee id, first name, last name, title, department name, salary, and manager name if applicable for a specific department.
* View All Employees by Manager
	* This will print an **employee** table which will list the employee id, first name, last name, title, department name, salary, and manager name if applicable for a specific manager.
* Add Department
	* This will prompt a question to enter the name of the department you would like to create. It will verify if the department already exist before creating it, if it already exists it will not create the department, and it will notify the user that the department already exist.
* Add Role
	* This will prompt three questions, one to enter the title for this role, the salary, and it will list the current departments to select to which this role belongs to. It will verify if the role already exists before creating it, if it already exists it will not create the role, and it will notify the user that the role already exists. It also verifies if user entered a number for the salary.
* Add Employee
	* This will prompt fours questions, one to enter the employee first name, last name, it will list the roles available to select from, as well as a list of managers if applicable for the employee.
* Update Employee Role
	* This will prompt three questions, one to enter the employee first name, the employee last name that you would like to update the role, and it will list the current roles to select the new department for that employee.
* Exit
	* This will exit the command line application.

Click on the gif below to watch a demo video for this application.

[![Employee Tracker](https://github.com/Mimila-85/employeeTracker/blob/master/assets/images/employeeTrackerDemo.gif)](https://youtu.be/QChVNUY0VtA)

## License

This project is licensed under the terms of the MIT license.

## Contributing

If you would like to participate on this project please submit any bugs or feature requests to the contact listed on the `questions` section of this README. 

## Questions

If you have any questions about the repo, open an issue or contact me directly at camila.alves85@gmail.com. You can find more of my work at [Mimila-85](https://github.com/Mimila-85).
