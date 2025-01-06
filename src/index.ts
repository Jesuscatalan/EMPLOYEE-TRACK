import { displayHeader, displayTable } from './display';
import { 
  mainMenu, 
  promptAddEmployee, 
  promptUpdateEmployeeRole, 
  promptUpdateEmployeeManager, 
  promptAddRole, 
  promptAddDepartment, 
  promptViewEmployeeByManager, 
  promptViewEmployeeByDepartment, 
  promptDeleteEmployee, 
  promptDeleteRole, 
  promptDeleteDepartment 
} from './prompts';
import { 
  addEmployee, 
  getEmployees, 
  updateEmployeeRole, 
  updateEmployeeManager, 
  getEmployeesByManager, 
  getEmployeesByDepartment, 
  addRole, 
  getRoles, 
  addDepartment, 
  getDepartments, 
  deleteEmployee, 
  deleteRole, 
  deleteDepartment 
} from './queries';

const handleEntityDeletion = async (entityType: string, promptFunction: Function, deleteFunction: Function) => {
  const entity = await promptFunction();

  if (entity && entity.id) {
    try {
      await deleteFunction(entity.id);
      console.log(`${entityType} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete ${entityType}:`, error);
    }
  } else {
    console.log(`${entityType} deletion was cancelled.`);
  }
};

const startApp = async (): Promise<void> => {
  displayHeader();
  
  let shouldExit = false;

  while (!shouldExit) {
    const { action } = await mainMenu();

    switch (action) {
      case 'View All Employees':
        const employees = await getEmployees();
        displayTable(employees);
        break;
      
      case 'Add Employee':
        const employeeData = await promptAddEmployee();
        await addEmployee(employeeData.firstName, employeeData.lastName, employeeData.roleId, employeeData.managerId);
        console.log('Employee added successfully.');
        break;

      case 'Delete Employee':
        await handleEntityDeletion('Employee', promptDeleteEmployee, deleteEmployee);
        break;

      case 'Update Employee Role':
        const employeeRoleData = await promptUpdateEmployeeRole();
        await updateEmployeeRole(employeeRoleData.employeeId, employeeRoleData.roleId);
        console.log('Employee role updated successfully.');
        break;

      case 'Update Employee Manager':
        const managerUpdateData = await promptUpdateEmployeeManager();
        await updateEmployeeManager(managerUpdateData.employeeId, managerUpdateData.managerId);
        console.log('Employee manager updated successfully.');
        break;

      case 'View Employees by Manager':
        const managerViewData = await promptViewEmployeeByManager();
        const employeesUnderManager = await getEmployeesByManager(managerViewData.managerId);
        displayTable(employeesUnderManager);
        break;

      case 'View All Roles':
        const roles = await getRoles();
        displayTable(roles);
        break;

      case 'Add Role':
        const roleData = await promptAddRole();
        await addRole(roleData.title, roleData.salary, roleData.departmentId);
        console.log('Role added successfully.');
        break;

      case 'Delete Role':
        await handleEntityDeletion('Role', promptDeleteRole, deleteRole);
        break;

      case 'View All Departments':
        const departments = await getDepartments();
        displayTable(departments);
        break;

      case 'View Employees by Department':
        const departmentViewData = await promptViewEmployeeByDepartment();
        const employeesInDepartment = await getEmployeesByDepartment(departmentViewData.departmentId);
        displayTable(employeesInDepartment);
        break;

      case 'Add Department':
        const departmentData = await promptAddDepartment();
        await addDepartment(departmentData.name);
        console.log('Department added successfully.');
        break;

      case 'Delete Department':
        await handleEntityDeletion('Department', promptDeleteDepartment, deleteDepartment);
        break;

      case 'Quit':
        shouldExit = true;
        console.log('Goodbye!');
        break;

      default:
        console.log('This feature has not been implemented yet.');
    }
  }
};

startApp().catch((err) => console.error('An error occurred while starting the application:', err));
