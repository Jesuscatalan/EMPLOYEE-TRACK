import dbPool from './db';

export const retrieveEmployees = async (): Promise<{ id: number, firstName: string, lastName: string, jobTitle: string, department: string, salary: number, managerName: string | null }[]> => {
    try {
        const { rows } = await dbPool.query(`
            SELECT 
                e.id, 
                e.first_name AS firstName, 
                e.last_name AS lastName, 
                r.title AS jobTitle, 
                d.name AS department, 
                r.salary, 
                COALESCE(CONCAT(m.first_name, ' ', m.last_name), NULL) AS managerName
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
        `);
        return rows;
    } catch (err) {
        console.error("Failed to retrieve employees:", err);
        throw err;
    }
};

export const retrieveManagers = async (): Promise<{ id: number, firstName: string, lastName: string }[]> => {
    try {
        const { rows } = await dbPool.query(`
            SELECT id, first_name AS firstName, last_name AS lastName
            FROM employee
            WHERE id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL)
        `);
        return rows;
    } catch (err) {
        console.error("Failed to retrieve managers:", err);
        throw err;
    }
};

export const retrieveEmployeesByManager = async (managerId: number): Promise<{ id: number, firstName: string, lastName: string, jobTitle: string, department: string, salary: number, managerName: string | null }[]> => {
    try {
        const { rows } = await dbPool.query(`
            SELECT 
                e.id, 
                e.first_name AS firstName, 
                e.last_name AS lastName, 
                r.title AS jobTitle, 
                d.name AS department, 
                r.salary, 
                COALESCE(CONCAT(m.first_name, ' ', m.last_name), NULL) AS managerName
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE e.manager_id = $1
        `, [managerId]);
        return rows;
    } catch (err) {
        console.error("Failed to retrieve employees by manager:", err);
        throw err;
    }
};

export const retrieveEmployeesByDepartment = async (departmentId: number): Promise<{ id: number, firstName: string, lastName: string, jobTitle: string, department: string, salary: number, managerName: string | null }[]> => {
    try {
        const { rows } = await dbPool.query(`
            SELECT 
                e.id, 
                e.first_name AS firstName, 
                e.last_name AS lastName, 
                r.title AS jobTitle, 
                d.name AS department, 
                r.salary, 
                COALESCE(CONCAT(m.first_name, ' ', m.last_name), NULL) AS managerName
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE d.id = $1
        `, [departmentId]);
        return rows;
    } catch (err) {
        console.error("Failed to retrieve employees by department:", err);
        throw err;
    }
}

export const retrieveRoles = async (): Promise<{ id: number, jobTitle: string, department: string, salary: number }[]> => {
    try {
        const { rows } = await dbPool.query(`
            SELECT 
                r.id, 
                r.title AS jobTitle, 
                d.name AS department, 
                r.salary
            FROM role r
            JOIN department d ON r.department = d.id
        `);
        return rows;
    } catch (err) {
        console.error("Failed to retrieve roles:", err);
        throw err;
    }
};

export const retrieveDepartments = async (): Promise<{ id: number; name: string; totalBudget: number | null }[]> => {
    try {
        const { rows } = await dbPool.query(`
            SELECT 
                d.id, 
                d.name, 
                COALESCE(SUM(r.salary), 0) AS total_salary
            FROM department d
            LEFT JOIN role r ON d.id = r.department
            LEFT JOIN employee e ON r.id = e.role_id
            GROUP BY d.id, d.name
            ORDER BY d.id
        `);
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            totalBudget: row.total_salary === 0 ? null : row.total_salary 
        }));
    } catch (err) {
        console.error("Failed to retrieve departments:", err);
        throw err;
    }
};

export const addNewEmployee = async (firstName: string, lastName: string, roleId: number | null, managerId: number | null): Promise<void> => {
    try {
        await dbPool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    } catch (err) {
        console.error("Failed to add new employee:", err);
        throw err;
    }
};

export const addNewRole = async (jobTitle: string, salary: number, departmentId: number): Promise<void> => {
    try {
        await dbPool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)', [jobTitle, salary, departmentId]);
    } catch (err) {
        console.error("Failed to add new role:", err);
        throw err;
    }
};

export const addNewDepartment = async (name: string): Promise<void> => {
    try {
        await dbPool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    } catch (err) {
        console.error("Failed to add new department:", err);
        throw err;
    }
};

export const changeEmployeeRole = async (employeeId: number, roleId: number): Promise<void> => {
    try {
        await dbPool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    } catch (err) {
        console.error("Failed to update employee's role:", err);
        throw err;
    }
};

export const changeEmployeeManager = async (employeeId: number, managerId: number | null): Promise<void> => {
    try {
        await dbPool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [managerId, employeeId]);
    } catch (err) {
        console.error("Failed to update employee's manager:", err);
        throw err;
    }
}

export const removeEmployeeFromSystem = async (employeeId: number | undefined): Promise<void> => {
    if (employeeId === undefined) {
        return;
    }
    try {
        await dbPool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
    } catch (err) {
        console.error("Failed to remove employee:", err);
        throw err;
    }
};

export const removeRoleFromSystem = async (roleId: number | undefined): Promise<void> => {
    if (roleId === undefined) {
        return;
    }
    try {
        await dbPool.query('DELETE FROM role WHERE id = $1', [roleId]);
    } catch (err) {
        console.error("Failed to remove role:", err);
        throw err;
    }
}

export const removeDepartmentFromSystem = async (departmentId: number | undefined): Promise<void> => {
    if (departmentId === undefined) {
        return;
    }
    try {
        await dbPool.query('DELETE FROM department WHERE id = $1', [departmentId]);
    } catch (err) {
        console.error("Failed to remove department:", err);
        throw err;
    }
}
