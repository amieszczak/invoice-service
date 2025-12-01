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

### Frontend
The frontend application is deployed on **Vercel** and is accessible at:
- Production: [https://invoice-service-frontend-ten.vercel.app/](https://invoice-service-frontend-ten.vercel.app/)

### Backend
The backend API is deployed on **Railway** and configured to work with the frontend application.

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

