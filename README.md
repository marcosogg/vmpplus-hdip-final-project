# VMP Plus: Vendor Management Platform

A full-stack web application built with React and Supabase to streamline vendor management processes, including onboarding, contract management, performance tracking, and document handling.

## Key Features

- **Vendor Management**: Create, view, update, and delete vendor profiles
- **Contract Management**: Track contracts with start dates, end dates, and relevant details
- **Document Management**: Upload, download, and manage vendor-related documents
- **User Authentication**: Secure login and registration with Supabase Auth
- **Role-based Access**: Different permissions for Admin and Buyer roles
- **Dashboard Overview**: Visual analytics of vendor performance and contract status
- **User Profiles**: Manage user information and preferences

## Technology Stack

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI (Component Library)
- React Router DOM (Routing)
- React Context API (State Management)
- React Hook Form + Zod (Form Handling & Validation)
- Chart.js (Data Visualization)

### Backend
- Supabase (Backend as a Service)
  - PostgreSQL Database
  - Authentication
  - Storage
  - Realtime Subscriptions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm or yarn
- A Supabase account and project

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd vmpplus-hdip-final-project
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example`
   - Replace the placeholder values with your actual Supabase project details:
     ```
     VITE_SUPABASE_URL=your-supabase-url-here
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
     ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Folder Structure Overview

- `src/`: Main source code folder
  - `components/`: Reusable UI components
    - `ui/`: Generic UI components (from shadcn/ui)
    - `layout/`: Layout structure components (Navbar, Sidebar)
    - `vendor/`: Components specific to Vendor features
    - `contract/`: Components specific to Contract features
    - `document/`: Components specific to Document features
    - `auth/`: Components specific to Authentication
  - `pages/`: Page-level components (routed views)
  - `context/`: React Context providers for state management
  - `lib/`: Library code and utilities
    - `api/`: Functions for interacting with Supabase backend
    - `supabase.ts`: Supabase client configuration
  - `hooks/`: Custom React hooks
  - `types/`: TypeScript type definitions
  - `schemas/`: Zod validation schemas
  - `router.tsx`: Application routing configuration
