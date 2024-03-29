# Task Management Application
![Group 47](https://github.com/GIHAA/task-management-application/assets/86099252/320834c3-9cbf-4003-b859-f8097be3ff5d)

## Live deployment
- **Frontend:** : https://task-management-application-pearl.vercel.app/
- **Backend:**  : https://task-manager-app.azurewebsites.net/api/v1/health

## Tech Stack
- **Frontend:** NEXT.js
- **Backend:** Spring Boot

## Local Setup Instructions
To set up the application locally, follow these steps:

1. Clone the repository.
2. Open IntelliJ IDEA, navigate to the backend folder, and run the Spring Boot application.
3. I've set the default port to be 80 (`http://localhost/`), and other configurations like the database URL are intentionally exposed for easy local setup.
4. Additionally, for an alternative deployment approach, you can leverage the flexibility of Docker to run the application. To do so, effortlessly build and execute the Docker image found in the `backend` folder. Alternatively, you may opt for an existing image available on Docker Hub by executing the following commands:
   
   ```bash
   docker pull gihaa/taskmanager:latest
   ```
   ```bash
   docker run -d -p 80:80 gihaa/taskmanager:latest
   ```
6. Verify the application's health by checking `http://localhost/api/v1/health`.
7. For the frontend, Change directory to the frontend and run `npm install` to install node modules.
8. Optionally, modify the API URL to use either the online backend or a local backend by commenting/uncommenting lines in `src/api/api.ts`:
   ```typescript
   //export const BE_URL = "http://localhost/api/v1";
   export const BE_URL = "https://task-manager-app.azurewebsites.net/api/v1";

9. Regarding the initial login request from the backend, it might take around 1 - 2 minute to complete. This delay is due to my current use of free hosting options, which tend to shut down due to inactivity. It is important to note that this issue is not related to the code quality of the backend. After reactivating from inactivity, the backend should work quickly and without issues. Additionally, the local setup doesn't experience this problem
   ![image](https://github.com/GIHAA/task-management-application/assets/86099252/96551a34-67fe-48eb-8e3f-5da719b55810)

10. Execute `npm run dev` to start the application.
11. Open `http://localhost:3000/` to access the application.
12. Now, you're ready to use the Task Management Application locally.
12. Example logins.. feel free to add new users as well
      |Role| Email | Password |
      |---------|----------|-------------|
      |Owner| owner@gmail.com | Gihan_123 |
      |Admin| admin@gmail.com |  Admin_123|
      |Regular User| pawan@gmail.com|  Pawan_123|


## Features
![Group 46](https://github.com/GIHAA/task-management-application/assets/86099252/7844616b-22c7-4559-930e-f4c5c3ea7115)

![Group 45](https://github.com/GIHAA/task-management-application/assets/86099252/e63116c0-595a-449a-a69e-a99e8431e456)

![Group 44](https://github.com/GIHAA/task-management-application/assets/86099252/7af2878e-98df-4fca-b787-53190f79a381)



## Diagrams
![Group 48](https://github.com/GIHAA/task-management-application/assets/86099252/3719d136-7f3b-4b37-96d3-321fb212a8b7)


