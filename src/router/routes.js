import Login from '../components/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Clients from '../pages/clients/Clients.vue'
import Departments from '../pages/departments/Departments.vue'
import Expenses from '../pages/expenses/Expenses.vue'
import Posts from '../pages/posts/Posts.vue'
import Employees from '../pages/employees/Employees.vue'
import Employee from '../pages/employees/Employee.vue'
import AddEmployee from '../pages/employees/AddEmployee.vue'
import EditEmployee from '../pages/employees/EditEmployee.vue'
import Projects from '../pages/projects/Projects.vue'
import Revenues from '../pages/revenues/Revenues.vue'
import Payments from '../pages/payments/Payments.vue'
import Users from '../pages/users/Users.vue'
import Profile from '../pages/users/Profile.vue'


const routes = [
    {path: '/', component: Login, name: 'login', meta: { guest: true }},
    {path: '/dashboard', component: Dashboard, name: 'dashboard', meta: {requiresAuth: true}},
    {path: '/clients', component: Clients, name: 'clients', meta: {requiresAuth: true}},
    {path: '/departments', component: Departments, name: 'departments', meta: {requiresAuth: true}},
    {path: '/employees', component: Employees, name: 'employees', meta: {requiresAuth: true}},
    {path: '/add-employee', component: AddEmployee, name: 'add-employee', meta: {requiresAuth: true}},
    {path: '/employees/:id', name: 'employee', component: Employee, meta: {requiresAuth: true}},
    {path: '/employees/:id/edit', name: 'edit-employee', component: EditEmployee, meta: {requiresAuth: true}},
    {path: '/expenses', component: Expenses, name: 'expenses', meta: {requiresAuth: true}},
    {path: '/posts', component: Posts, name: 'posts', meta: {requiresAuth: true}},
    {path: '/projects', component: Projects, name: 'projects', meta: {requiresAuth: true}},
    {path: '/revenues', component: Revenues, name: 'revenues', meta: {requiresAuth: true}},
    {path: '/payments', component: Payments, name: 'payments', meta: {requiresAuth: true}},
    {path: '/users', component: Users, name: 'users', meta: {requiresAuth: true}},
    {path: '/me', component: Profile, name: 'me', meta: {requiresAuth: true}}
]

export default routes