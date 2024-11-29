# Family Budgeting API Documentation

Welcome to the Family Budgeting API documentation! This API allows users to manage their budgets, expenses, incomes, and generate various reports. Below, you'll find detailed information on how to use the API, including authentication, endpoints, request and response formats, and validation rules.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [User Authentication](#user-authentication)
  - [Budget Management](#budget-management)
  - [Expense Management](#expense-management)
  - [Income Management](#income-management)
  - [Reporting](#reporting)
- [Validation](#validation)
- [Error Handling](#error-handling)

## Base URL

All API requests should be made to the following base URL:

```

http://localhost:5000/api

```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, you must include a valid token in the Authorization header of your requests.

**Example:**

```

Authorization: Bearer <your_token>

```

## Endpoints

### User Authentication

#### Register User

- **POST** `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Response:**

- **201 Created**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "your_jwt_token"
}
```

- **400 Bad Request**

```json
{
  "message": "User already exists"
}
```

#### Login User

- **POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Response:**

- **200 OK**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "your_jwt_token"
}
```

- **401 Unauthorized**

```json
{
  "message": "Invalid credentials"
}
```

### Budget Management

#### Create Budget

- **POST** `/budgets`

**Request Body:**

```json
{
  "name": "Monthly Expenses",
  "totalAmount": 1000,
  "startDate": "2023-01-01",
  "endDate": "2023-01-31"
}
```

**Response:**

- **201 Created**

```json
{
  "id": 1,
  "name": "Monthly Expenses",
  "totalAmount": 1000,
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2023-01-31T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Get Budgets

- **GET** `/budgets`

**Response:**

- **200 OK**

```json
[
  {
    "id": 1,
    "name": "Monthly Expenses",
    "totalAmount": 1000,
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-31T00:00:00.000Z",
    "userId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Update Budget

- **PUT** `/budgets/:id`

**Request Body:**

```json
{
  "name": "Updated Budget",
  "totalAmount": 1200,
  "startDate": "2023-01-01",
  "endDate": "2023-01-31"
}
```

**Response:**

- **200 OK**

```json
{
  "id": 1,
  "name": "Updated Budget",
  "totalAmount": 1200,
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2023-01-31T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Delete Budget

- **DELETE** `/budgets/:id`

**Response:**

- **204 No Content**

### Expense Management

#### Create Expense

- **POST** `/expenses`

**Request Body:**

```json
{
  "amount": 200,
  "category": "Groceries",
  "date": "2023-01-15",
  "budgetId": 1,
  "description": "Weekly grocery shopping"
}
```

**Response:**

- **201 Created**

```json
{
  "id": 1,
  "amount": 200,
  "category": "Groceries",
  "date": "2023-01-15T00:00:00.000Z",
  "userId": 1,
  "budgetId": 1,
  "description": "Weekly grocery shopping",
  "createdAt": "2023-01-15T00:00:00.000Z"
}
```

#### Get Expenses

- **GET** `/expenses`

**Response:**

- **200 OK**

```json
[
  {
    "id": 1,
    "amount": 200,
    "category": "Groceries",
    "date": "2023-01-15T00:00:00.000Z",
    "userId": 1,
    "budgetId": 1,
    "description": "Weekly grocery shopping",
    "createdAt": "2023-01-15T00:00:00.000Z"
  }
]
```

#### Update Expense

- **PUT** `/expenses/:id`

**Request Body:**

```json
{
  "amount": 250,
  "category": "Groceries",
  "date": "2023-01-15",
  "budgetId": 1,
  "description": "Updated grocery shopping"
}
```

**Response:**

- **200 OK**

```json
{
  "id": 1,
  "amount": 250,
  "category": "Groceries",
  "date": "2023-01-15T00:00:00.000Z",
  "userId": 1,
  "budgetId": 1,
  "description": "Updated grocery shopping",
  "createdAt": "2023-01-15T00:00:00.000Z"
}
```

#### Delete Expense

- **DELETE** `/expenses/:id`

**Response:**

- **204 No Content**

### Income Management

#### Create Income

- **POST** `/incomes`

**Request Body:**

```json
{
  "amount": 1500,
  "source": "Salary",
  "date": "2023-01-31",
  "budgetId": 1,
  "description": "Monthly salary"
}
```

**Response:**

- **201 Created**

```json
{
  "id": 1,
  "amount": 1500,
  "source": "Salary",
  "date": "2023-01-31T00:00:00.000Z",
  "userId": 1,
  "budgetId": 1,
  "description": "Monthly salary",
  "createdAt": "2023-01-31T00:00:00.000Z"
}
```

#### Get Incomes

- **GET** `/incomes`

**Response:**

- **200 OK**

```json
[
  {
    "id": 1,
    "amount": 1500,
    "source": "Salary",
    "date": "2023-01-31T00:00:00.000Z",
    "userId": 1,
    "budgetId": 1,
    "description": "Monthly salary",
    "createdAt": "2023-01-31T00:00:00.000Z"
  }
]
```

#### Update Income

- **PUT** `/incomes/:id`

**Request Body:**

```json
{
  "amount": 1600,
  "source": "Salary",
  "date": "2023-01-31",
  "budgetId": 1,
  "description": "Updated monthly salary"
}
```

**Response:**

- **200 OK**

```json
{
  "id": 1,
  "amount": 1600,
  "source": "Salary",
  "date": "2023-01-31T00:00:00.000Z",
  "userId": 1,
  "budgetId": 1,
  "description": "Updated monthly salary",
  "createdAt": "2023-01-31T00:00:00.000Z"
}
```

#### Delete Income

- **DELETE** `/incomes/:id`

**Response:**

- **204 No Content**

### Reporting

#### Generate Monthly Report

- **GET** `/reports/monthly?month=1&year=2023`

**Response:**

- **200 OK**

```json
{
  "totalIncome": 1500,
  "totalExpense": 500,
  "balance": 1000
}
```

## Validation

- All request bodies are validated for the required fields. Missing or incorrect data will result in a `400 Bad Request` error.

## Error Handling

Errors are returned in the following format:

```json
{
  "message": "Error message"
}
```

Common errors:

- **400 Bad Request**: Invalid or missing data.
- **401 Unauthorized**: Missing or invalid token.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Unexpected server error.

For any questions or support, please contact our API team.
