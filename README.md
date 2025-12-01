# Invoice Service


Fullstack invoice service application built with Next.js (frontend) and Express (backend).

Check out the latest build [here](https://invoice-service-frontend-ten.vercel.app/)

## Project Structure

```
invoice-service/
├── frontend/     # Next.js application
├── backend/      # Express.js API server
├── package.json  # Root package.json (workspace configuration)
└── README.md     # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies for the root workspace:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building

Build both frontend and backend:
```bash
npm run build
```

## Deployment

This application is deployed using a multi-platform architecture:
- **Backend**: Railway
- **Frontend**: Vercel
- **Database**: Supabase (PostgreSQL)

### Backend Deployment (Railway)

1. **Repository Setup**
   - The repository was pushed to GitHub

2. **Railway Project Creation**
   - A new project was created in Railway
   - The project was configured to deploy from the GitHub repository

3. **Service Configuration**
   - Railway automatically detected the `backend/` directory as a service
   - The service was configured to point to the `/backend` folder

4. **Environment Variables**
   - The following environment variables were configured in Railway's Variables tab:
     ```
     SUPABASE_URL
     SUPABASE_SERVICE_ROLE_KEY
     PORT
     ```

5. **Deployment**
   - After the service was deployed successfully, Railway generated a public URL for the backend API

6. **Verification**
   - The deployment was verified by testing the health endpoint
   - By requesting a health-check URL in the form: `https://<sample-railway-address>.up.railway.app/health` 
   - The API responded correctly, confirming successful deployment

### Frontend Deployment (Vercel)

1. **Repository Import**
   - The GitHub repository was imported into Vercel

2. **Project Configuration**
   - The root directory was set to `frontend/`
   - Vercel automatically detected the project as a Next.js application

3. **Environment Variables**
   - The backend API URL was configured as an environment variable:
     ```
     NEXT_PUBLIC_API_URL
     ```

4. **Deployment**
   - The Next.js application was built and deployed by Vercel

5. **Verification**
   - The deployment was verified by testing the UI functionality
   - Invoice operations were tested to confirm frontend-backend communication

### Live Application

- **Frontend**: [https://invoice-service-frontend-ten.vercel.app/](https://invoice-service-frontend-ten.vercel.app/)
- **Backend**: Deployed on Railway
- **Database**: Hosted on Supabase

## Technologies

- **Frontend**: Next.js
- **Backend**: Express.js

## Use of AI Tools

AI-assisted tools (ChatGPT and Cursor) were used selectively to improve development efficiency and code quality. Their role was limited to producing preliminary ideas, exploring alternative approaches, and clarifying technical considerations when needed.

All architecture decisions, business logic, data modeling, validation rules, and the final implementation were designed and written manually to ensure correctness, maintainability, and full alignment with project requirements.

AI was not used to build complete features end-to-end. Instead, it served as a supportive tool for tasks such as:

- Confirming best practices for Express and Next.js project structure
- Validating TypeScript types and Zod schemas
- Refining the API contract and HTTP method choices
- Identifying potential edge cases
- Accelerating documentation and improving error-handling patterns

The final codebase, including architecture, implementation details, and deployment configuration, was reviewed and verified manually.

## License

ISC

