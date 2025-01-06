import inquirer from 'inquirer';
import { getRoles, getEmployees, getDepartments, getManagers } from './queries';

const createChoiceList = (data: any[], displayKey: string, valueKey: string): { name: string, value: number | null }[] => {
    return data.map((item: { [key: string]: any }) => ({
        name: item[displayKey],
        value: item[valueKey] ?? null,
    }));
};

export const showMainMenu = async (): Promise<{ action: string }> => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose your action:',
            choices: [
                'Display All Employees',
                'Add New Employee',
                'Remove Employee',
                'Modify Employee Role',
                'View Employees by Manager',
                'Change Employee Manager',
                'Show All Roles',
                'Add New Role',
                'Remove Role',
                'Show All Departments',
                'View Employees by Department',
                'Add New Department',
                'Delete Department',
                'Exit'
            ],
        },
    ]);
};

export const promptForNewEmployee = async (): Promise<{ firstName: string, lastName: string, roleId: number | null, managerId: number | null }> => {
    const roles = await getRoles();
    const employees = await getEmployees();

    const roleChoices = createChoiceList(roles, 'title', 'id');
    const employeeChoices = createChoiceList(employees, 'first_name', 'id');

    employeeChoices.push({ name: 'No Manager', value: null });

    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select role for the employee:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for the employee:',
            choices: employeeChoices,
        }
    ]);
};

export const promptForNewRole = async (): Promise<{ title: string, salary: number, departmentId: number }> => {
    const departments = await getDepartments();
    const departmentChoices = createChoiceList(departments, 'name', 'id');

    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Enter the salary for the role:',
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Choose the department for the role:',
            choices: departmentChoices,
        }
    ]);
};

export const promptForNewDepartment = async (): Promise<{ name: string }> => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department:',
        }
    ]);
};

export const promptForRoleChange = async (): Promise<{ employeeId: number, roleId: number }> => {
    const roles = await getRoles();
    const employees = await getEmployees();

    const roleChoices = createChoiceList(roles, 'title', 'id');
    const employeeChoices = createChoiceList(employees, 'first_name', 'id');

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Choose the employee whose role you want to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
        }
    ]);
};

export const promptForManagerChange = async (): Promise<{ employeeId: number, managerId: number | null }> => {
    const employees = await getEmployees();
    const employeeChoices = createChoiceList(employees, 'first_name', 'id');

    employeeChoices.push({ name: 'No Manager', value: null });

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose manager needs to be updated:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the new manager for this employee:',
            choices: employeeChoices,
        }
    ]);
};

export const promptForEmployeesByManager = async (): Promise<{ managerId: number }> => {
    const managers = await getManagers();
    const managerChoices = createChoiceList(managers, 'first_name', 'id');

    return inquirer.prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Choose a manager to see their direct reports:',
            choices: managerChoices,
        }
    ]);
};

export const promptForEmployeesByDepartment = async (): Promise<{ departmentId: number }> => {
    const departments = await getDepartments();
    const departmentChoices = createChoiceList(departments, 'name', 'id');

    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to see employees:',
            choices: departmentChoices,
        }
    ]);
};

export const promptForEmployeeDeletion = async (): Promise<{ employeeId: number } | undefined> => {
    const employees = await getEmployees();
    const employeeChoices = createChoiceList(employees, 'first_name', 'id');
    
    employeeChoices.unshift({ name: 'Cancel', value: undefined });

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to remove:',
            choices: employeeChoices,
        }
    ]);
};

export const promptForRoleDeletion = async (): Promise<{ roleId: number } | undefined> => {
    const roles = await getRoles();
    const roleChoices = createChoiceList(roles, 'title', 'id');
    
    roleChoices.unshift({ name: 'Cancel', value: undefined });

    return inquirer.prompt([
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role to delete:',
            choices: roleChoices,
        }
    ]);
};

export const promptForDepartmentDeletion = async (): Promise<{ departmentId: number } | undefined> => {
    const departments = await getDepartments();
    const departmentChoices = createChoiceList(departments, 'name', 'id');
    
    departmentChoices.unshift({ name: 'Cancel', value: undefined });

    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department to delete:',
            choices: departmentChoices,
        }
    ]);
};
