# Family Budgeting API

## Overview

This Family Budgeting API is a comprehensive financial management solution that allows families to track their budgets, expenses, incomes, and generate detailed financial reports.

## Features

### Authentication

- User Registration
- User Login
- JWT-based Authentication

### Budget Management

- Create Budgets
- Retrieve Budgets
- Update Budgets
- Delete Budgets

### Expense Tracking

- Add Expenses
- List Expenses
- Update Expenses
- Delete Expenses

### Income Tracking

- Add Incomes
- List Incomes
- Update Incomes
- Delete Incomes

### Reporting

- Monthly Financial Reports
- Category-based Expense Reports
- Annual Financial Overviews
- Budget Comparison Reports

## Technology Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT for Authentication
- bcrypt for Password Hashing

## Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL
- npm or yarn

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/family-budget-api.git
cd family-budget-api
```

Install dependencies

```bash
npm install
```

Set up environment variables Create a .env file in the root directory with:

```
DATABASE_URL=postgresql://username:password@localhost:5432/budgetdb
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

Set up Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

## Running the API

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Budgets

- `POST /api/budget`s - Create a new budget
- `GET /api/budgets` - List all budgets
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

### Expenses

- `POST /api/expenses` - Add an expense
- `GET /api/expenses` - List expenses
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

### Incomes

- `POST /api/incomes` - Add an income
- `GET /api/incomes` - List incomes
- `PUT /api/incomes/:id` - Update an income
- `DELETE /api/incomes/:id` - Delete an income

### Reports

- `GET /api/reports/monthly` - Monthly financial report
- `GET /api/reports/category-expenses` - Category expense report
- `GET /api/reports/annual-overview` - Annual financial overview
- `GET /api/reports/budget-comparison` - Budget comparison report

## Authentication

All routes except /api/auth/login and /api/auth/register require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Request Validation

All endpoints have built-in validation
Proper error messages for invalid inputs
Type and format checking for request bodies

## Error Handling

- Comprehensive error responses
- Detailed error messages in development
- Minimal error details in production

## Pagination & Filtering

- Supports pagination for list endpoints
- Filtering options available for reports

## Security Features

- Password hashing
- JWT authentication
- Input validation
- Protected routes
- Rate limiting

## Logging

- Console logging in development
- Configurable logging levels

## Testing

```bash
npm test
```

## Deployment

- Compatible with various cloud platforms
- Docker configuration available
- Environment-specific configurations

## Contributing

- Fork the repository
- Create your feature branch
- Commit your changes
- Push to the branch
- Create a Pull Request

## License

[MIT License]
