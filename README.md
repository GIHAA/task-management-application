# Task Management Application

![Application Screenshot](https://github.com/GIHAA/task-management-application/assets/86099252/af6a08cf-2e00-4b1b-843b-ec58f4375528)

## Tech Stack
- **Frontend:** NEXT.js
- **Backend:** Spring Boot

## Local Setup Instructions
To set up the application locally, follow these steps:

1. Clone the repository.
2. Open IntelliJ IDEA, navigate to the backend folder, and run the Spring Boot application.
3. I've set the default port to be 80 (`http://localhost/`), and other configurations like the database URL are intentionally exposed for easy local setup.
4. Verify the application's health by checking `http://localhost/api/v1/health`.
5. Change directory to the frontend and run `npm install` to install node modules.
6. Optionally, modify the API URL to use either the online backend or a local backend by commenting/uncommenting lines in `src/api/api.ts`:
   ```typescript
   //export const BE_URL = "http://localhost/api/v1";
   export const BE_URL = "https://task-manager-app.azurewebsites.net/api/v1";

8. Execute `npm run dev` to start the application.
9. Open `http://localhost:3000/` to access the application.

Now, you're ready to use the Task Management Application locally.

## Features
![Group 46](https://github.com/GIHAA/task-management-application/assets/86099252/7844616b-22c7-4559-930e-f4c5c3ea7115)

![Group 45](https://github.com/GIHAA/task-management-application/assets/86099252/e63116c0-595a-449a-a69e-a99e8431e456)

![Group 44](https://github.com/GIHAA/task-management-application/assets/86099252/7af2878e-98df-4fca-b787-53190f79a381)



