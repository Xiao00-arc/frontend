**API Documentation**
=====================

This document provides a detailed overview of the API endpoints for the expense management system. It is intended to be used by developers and can be easily parsed by tools like GitHub Copilot.

**1\. General Information**
---------------------------

### **Authentication**

This API uses JSON Web Tokens (JWT) for authentication. To access protected endpoints, you must include an Authorization header with the value Bearer .

You can obtain a JWT token by sending a POST request to the /api/authenticate endpoint with a valid username and password.

**Example Request Header:**

Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

### **Error Response Format**

In case of an error, the API will return a JSON object with a structure that depends on the error type.

For validation errors (HTTP 400 - Bad Request):

The response body will be a map of field names to error messages.

{    "fieldName1": "Error message for fieldName1",    "fieldName2": "Error message for fieldName2"}

For other errors (e.g., HTTP 401, 403, 404, 500):

The response body may be empty or contain a generic error message provided by the Spring Boot framework.

### **Pagination**

For endpoints that return a list of resources, the API uses pagination. You can control the pagination using the following query parameters:

*   page: The page number to retrieve (0-indexed).
    
*   size: The number of items per page.
    
*   sort: The property to sort by, followed by a comma and the sort direction (asc or desc). For example, sort=expenseDate,desc.
    

The paginated response will have the following structure:

{    "content": \[ ... \],    "pageable": {        "sort": {            "sorted": true,            "unsorted": false,            "empty": false        },        "offset": 0,        "pageNumber": 0,        "pageSize": 20,        "paged": true,        "unpaged": false    },    "last": true,    "totalPages": 1,    "totalElements": 10,    "size": 20,    "number": 0,    "sort": {        "sorted": true,        "unsorted": false,        "empty": false    },    "first": true,    "numberOfElements": 10,    "empty": false}

### **Status Codes**

The API uses the following standard HTTP status codes:

|

| Code | Meaning | Description |

| 200 | OK | The request was successful. |

| 400 | Bad Request | The request was invalid (e.g., missing required fields, invalid data format). |

| 401 | Unauthorized | The request requires authentication, but no valid JWT token was provided. |

| 403 | Forbidden | The authenticated user does not have the necessary permissions. |

| 404 | Not Found | The requested resource could not be found. |

| 500 | Internal Server Error | An unexpected error occurred on the server. |

**2\. Data Models**
-------------------

### **User**

Represents a user of the system.

| Field | Type | Description |

| id | Long | The unique identifier for the user. |

| username | String | The user's username. Must be unique. |

| email | String | The user's email address. Must be unique and valid. |

| password | String | The user's hashed password (write-only, not returned in responses). |

| role | String | The user's role (e.g., "EMPLOYEE", "MANAGER", "ADMIN", "FINANCE\_MANAGER"). |

| employeeId | String | The user's employee ID. Must be unique. |

| departmentId | Long | The ID of the department the user belongs to. |

| managerId | Long | The ID of the user's manager. |

### **Expense**

Represents an expense claim.

| Field | Type | Description |

| id | Long | The unique identifier for the expense. |

| employeeId | Long | The ID of the employee who submitted the expense. |

| amount | BigDecimal | The amount of the expense. Must be a positive value. |

| description | String | A description of the expense. |

| expenseDate | LocalDate | The date of the expense. Cannot be in the future. |

| categoryId | Long | The ID of the expense category. |

| status | String | The status of the expense (e.g., "PENDING", "APPROVED", "REJECTED"). |

| paymentAmount | BigDecimal | The amount paid for the expense. |

| paymentDate | LocalDate | The date the expense was paid. |

| paymentMethod | String | The method used to pay the expense. |

| transactionId | String | The transaction ID for the payment. |

### **ExpenseCategory**

Represents a category for expenses.

| Field | Type | Description |

| id | Long | The unique identifier for the expense category. |

| categoryName | String | The name of the category. Must be unique. |

| categoryCode | String | A unique code for the category. |

| spendingLimit | BigDecimal | The spending limit for this category. |

### **Department**

Represents a department within the organization.

| Field | Type | Description |

| id | Long | The unique identifier for the department. |

| departmentName | String | The name of the department. Must be unique. |

| departmentCode | String | A unique code for the department. |

| managerId | Long | The ID of the user who is the department's manager. |

### **Approval**

Represents an approval step in the expense workflow.

| Field | Type | Description |

| id | Long | The unique identifier for the approval. |

| expenseId | Long | The ID of the expense being approved. |

| approverId | Long | The ID of the user responsible for this approval step. |

| approvalStatus | String | The status of the approval (e.g., "PENDING", "APPROVED", "REJECTED"). |

| comments | String | Any comments from the approver. |

| approvalDate | LocalDateTime | The date and time of the approval action. |

### **Receipt**

Represents a receipt file attached to an expense.

| Field | Type | Description |

| id | Long | The unique identifier for the receipt. |

| expenseId | Long | The ID of the expense the receipt is for. |

| fileName | String | The name of the receipt file. |

| filePath | String | The path to the receipt file on the server. |

| ocrText | String | The text extracted from the receipt using OCR (if available). |

### **AuditLog**

Represents a log of actions performed in the system.

| Field | Type | Description |

| id | Long | The unique identifier for the audit log. |

| userId | Long | The ID of the user who performed the action. |

| action | String | A description of the action performed. |

| entityType | String | The type of entity that was affected (e.g., "Expense", "User"). |

| entityId | Long | The ID of the entity that was affected. |

| timestamp | LocalDateTime | The date and time the action occurred. |

**3\. Endpoints**
-----------------

### **Authentication Endpoints**

#### **POST /api/authenticate**

Authenticates a user and returns a JWT token.

*   **Authentication:** Public
    
*   **Request Body:** AuthenticationRequest{    "username": "your\_username",    "password": "your\_password"}
    
*   **Successful Response (200 OK):** AuthenticationResponse{    "jwt": "your\_jwt\_token"}
    
*   **Error Responses:**
    
*   401 Unauthorized: If the username or password is incorrect.
    

### **User Endpoints**

#### **POST /api/users/post**

Creates a new user. Default role is "EMPLOYEE".

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Request Body:** UserSignUpRequest{    "username": "new\_user",    "email": "new\_user@example.com",    "password": "password123"}
    
*   **Successful Response (200 OK):** Returns the newly created User object.
    
*   **Error Responses:**
    
*   400 Bad Request: If validation on the request body fails.
    
*   403 Forbidden: If the authenticated user is not an admin.
    

#### **GET /api/users**

Retrieves a paginated list of all users.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of User objects.
    
*   **Error Responses:**
    
*   403 Forbidden: If the authenticated user is not an admin.
    

#### **GET /api/users/{id}**

Retrieves a single user by their ID.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Successful Response (200 OK):** Returns the User object.
    
*   **Error Responses:**
    
*   404 Not Found: If no user with the given ID is found.
    

#### **PUT /api/users/{id}**

Updates an existing user's details.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Request Body:** A User object with the updated fields.
    
*   **Successful Response (200 OK):** Returns the updated User object.
    
*   **Error Responses:**
    
*   400 Bad Request: If validation on the request body fails.
    
*   403 Forbidden: If the authenticated user is not an admin.
    
*   404 Not Found: If no user with the given ID is found.
    

#### **DELETE /api/users/{id}**

Deletes a user by their ID.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Successful Response (200 OK):** A confirmation message string.
    
*   **Error Responses:**
    
*   403 Forbidden: If the authenticated user is not an admin.
    
*   404 Not Found: If no user with the given ID is found.
    

### **Expense Endpoints**

#### **POST /api/expenses/post**

Creates a new expense record and initiates the approval workflow.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Request Body:** ExpenseCreateRequest{    "employeeId": 1,    "amount": 100.00,    "description": "Office supplies",    "expenseDate": "2025-10-14",    "categoryId": 1}
    
*   **Successful Response (200 OK):** Returns the newly created Expense object.
    
*   **Error Responses:**
    
*   400 Bad Request: If validation on the request body fails.
    

#### **GET /api/expenses/my-expenses**

Retrieves a paginated list of expenses for the currently authenticated user.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of Expense objects.
    

#### **GET /api/expenses**

Retrieves a paginated list of all expenses in the system.

*   **Authentication:** Admin or Finance Manager (hasRole('ADMIN') or hasRole('FINANCE\_MANAGER'))
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of Expense objects.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user lacks the required role.
    

#### **GET /api/expenses/{id}**

Retrieves a single expense by its ID.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Successful Response (200 OK):** Returns the Expense object.
    
*   **Error Responses:**
    
*   404 Not Found: If no expense with the given ID is found.
    

#### **PUT /api/expenses/{id}**

Updates an existing expense.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Request Body:** An Expense object with the updated fields.
    
*   **Successful Response (200 OK):** Returns the updated Expense object.
    
*   **Error Responses:**
    
*   400 Bad Request: If validation fails.
    
*   403 Forbidden: If the user is not an admin.
    
*   404 Not Found: If no expense with the given ID is found.
    

#### **DELETE /api/expenses/{id}**

Deletes an expense by its ID.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Successful Response (200 OK):** A confirmation message string.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user is not an admin.
    
*   404 Not Found: If no expense with the given ID is found.
    

### **Approval Endpoints**

#### **PUT /api/approvals/{id}/action**

Allows an authorized user to approve or reject an expense and triggers the next step in the workflow.

*   **Authentication:** Admin, Manager, or Finance Manager (hasAnyRole('ADMIN', 'MANAGER', 'FINANCE\_MANAGER'))
    
*   **Request Body:** ApprovalActionRequest{    "status": "APPROVED",    "comments": "This looks reasonable."}
    
*   **Successful Response (200 OK):** Returns the updated Approval object.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user lacks the required role.
    
*   404 Not Found: If no approval with the given ID is found.
    

#### **GET /api/approvals**

Retrieves a paginated list of all approvals.

*   **Authentication:** Admin or Finance Manager (hasAnyRole('ADMIN', 'FINANCE\_MANAGER'))
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of Approval objects.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user lacks the required role.
    

### **Receipt Endpoints**

#### **POST /api/receipts/upload**

Uploads a receipt file and associates it with an expense.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Request Body:** multipart/form-data with parts:
    
*   file: The receipt file to upload.
    
*   expenseId: The ID of the expense to associate with the receipt.
    
*   **Successful Response (200 OK):** Returns the newly created Receipt object.
    

#### **GET /api/receipts/files/{filename:.+}**

Serves a receipt file for viewing or download.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Successful Response (200 OK):** Returns the receipt file stream.
    
*   **Error Responses:**
    
*   404 Not Found: If the file is not found.
    

### **Department Endpoints**

#### **POST /api/departments/post**

Creates a new department.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Request Body:** A Department object.
    
*   **Successful Response (200 OK):** Returns the newly created Department object.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user is not an admin.
    

#### **GET /api/departments**

Retrieves a paginated list of all departments.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of Department objects.
    

### **Expense Category Endpoints**

#### **POST /api/expense-categories/post**

Creates a new expense category.

*   **Authentication:** Admin (hasRole('ADMIN'))
    
*   **Request Body:** An ExpenseCategory object.
    
*   **Successful Response (200 OK):** Returns the newly created ExpenseCategory object.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user is not an admin.
    

#### **GET /api/expense-categories**

Retrieves a paginated list of all expense categories.

*   **Authentication:** Authenticated (isAuthenticated())
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of ExpenseCategory objects.
    

### **Audit Log Endpoints**

#### **GET /api/audit-logs**

Retrieves a paginated list of all audit logs.

*   **Authentication:** Admin, Auditor, or Finance Manager (hasAnyRole('ADMIN', 'AUDITOR', 'FINANCE\_MANAGER'))
    
*   **Query Parameters:** See [Pagination](https://www.google.com/search?q=#pagination).
    
*   **Successful Response (200 OK):** Returns a paginated list of AuditLog objects.
    
*   **Error Responses:**
    
*   403 Forbidden: If the user lacks the required role.