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

## Technologies

- **Frontend**: Next.js
- **Backend**: Express.js

## License

ISC

