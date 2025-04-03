# IMPORTANT: Tailwind CSS v4 PostCSS Integration Error

## Error Description

During the project setup phase, we encountered an error related to Tailwind CSS v4 and its PostCSS integration:

```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

## Cause

This error occurred because:

1. **Tailwind CSS v4 Architecture Change**: In Tailwind CSS v4, the PostCSS plugin functionality has been moved to a separate package (`@tailwindcss/postcss`).
2. **Outdated Configuration**: Our `postcss.config.js` was still using the older format that directly referenced `tailwindcss` as a plugin.

## Solution

The fix was to update the PostCSS configuration file to reference the new package:

```javascript
// postcss.config.js - CORRECT for Tailwind CSS v4
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Changed from 'tailwindcss: {}'
    autoprefixer: {},
  },
}
```

## Prevention Strategy

To prevent similar errors throughout the project development:

1. Always check the dependency versions in `package.json` before modifying configuration files
2. When using Tailwind CSS v4:
   - Use `@tailwindcss/postcss` (not `tailwindcss`) in the PostCSS config
   - Use `@tailwindcss/vite` in Vite config (not a direct Tailwind plugin)
3. Refer to the official Tailwind CSS v4 documentation when implementing features that interact with the styling system

---

# Git Workflow Integration

To ensure proper version control throughout the project, we'll follow the Git Flow principles outlined in the Git Flow Plan. This section provides detailed instructions on how to integrate Git commits with our implementation steps, using PowerShell for all commands.

## Initial Repository Setup

If the repository hasn't been initialized yet, begin with:

```powershell
# Initialize Git repository
git init

# Create initial commit for completed phases 1-2
git add .
git commit -m "feat: initial project setup including UI infrastructure (Phases 1-2)"

# Rename current branch to main (if needed)
git branch -M main

# Create and checkout develop branch
git checkout -b develop
git push -u origin develop
```

## Complete Git Workflow for Each Phase

For each phase, follow this comprehensive workflow using CLI commands:

### 1. Starting a New Phase

```powershell
# Ensure you're on the develop branch and it's up to date
git checkout develop
git pull origin develop

# Create and checkout a new feature branch
git checkout -b feature/phase-name
```

### 2. During Development

Make regular, atomic commits after completing each step:

```powershell
# Stage and commit changes for a completed step
git add .
git commit -m "feat: implement specific feature X"
```

### 3. Completing a Phase

When all tasks for the phase are complete:

```powershell
# Stage all remaining changes
git add .

# Commit with a phase completion message
git commit -m "feat: complete phase X implementation"

# Push your feature branch to the remote repository
git push -u origin feature/phase-name
```

### 4. Creating and Merging Pull Request

For GitHub (using GitHub CLI):

```powershell
# Install GitHub CLI if not already installed
# winget install GitHub.cli

# Authenticate (if needed)
# gh auth login

# Create pull request
gh pr create --base develop --head feature/phase-name --title "Feature: Complete Phase X Implementation" --body "Implements all requirements for Phase X including components A, B, and C."

# Check PR status
gh pr view feature/phase-name

# Merge the pull request
gh pr merge feature/phase-name --merge
```

For GitLab (using GitLab CLI):

```powershell
# Install GitLab CLI if not already installed
# winget install gitlab.cli

# Create a merge request
glab mr create --base develop --head feature/phase-name --title "Feature: Complete Phase X Implementation" --description "Implements all requirements for Phase X including components A, B, and C."

# Merge the request
glab mr merge
```

Alternative manually-executed merge (if CLI tools aren't available):

```powershell
# Switch to develop branch
git checkout develop
git pull origin develop

# Merge the feature branch
git merge --no-ff feature/phase-name -m "Merge feature/phase-name into develop"

# Push the changes to remote
git push origin develop
```

### 5. Clean Up

After the PR is merged:

```powershell
# Switch to develop branch and pull the latest changes
git checkout develop
git pull origin develop

# Delete the local feature branch
git branch -d feature/phase-name

# Delete the remote feature branch
git push origin --delete feature/phase-name
```

### 6. Start Next Phase

```powershell
# Create a new feature branch for the next phase
git checkout -b feature/next-phase-name
```

## Milestone Releases

When a significant milestone is reached:

```powershell
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Merge develop into main
git checkout main
git pull origin main
git merge --no-ff develop -m "Release version X.Y.Z: [Milestone Description]"

# Tag the release
git tag -a vX.Y.Z -m "Release version X.Y.Z: [Milestone Description]"

# Push changes and tags
git push origin main
git push origin vX.Y.Z

# Return to develop branch
git checkout develop
```

Let's proceed with the implementation plan, now with Git steps integrated at each point.

---

# VMP PLUS Implementation Plan (Revised)

This implementation plan is organized into sequential phases, each containing clearly defined steps. Follow the exact order and complete each step fully before proceeding to the next. Adherence to the rules defined in `general.mdc`, `auth-rules.md`, `frontend-rules.md`, and `backend-rules.md` is mandatory.

**Important Note on PowerShell Commands:** When executing terminal commands that involve changing directories and then running another command (e.g., `cd <directory>` followed by `npx ...`), use a semicolon (`;`) as the separator, not `&&`. Example: `cd C:\path\to\project; npx command`.

C:\Dev\hdip\vmp-plus-final-project\vmpplus-hdip-final-project\

## Phase 1: Project Setup and Core Infrastructure

### Step 1.1: Initialize Vite with React and TypeScript
**Task:** Create a new Vite project with React and TypeScript template.
**Commands:**
```bash
npm create vite@latest -- --template react-ts
npm install
```
**Validation Criteria:**
[x] Project directory structure matches `general.mdc#project-structure`
[x] Project builds successfully with `npm run dev`
[x] TypeScript configuration exists and is properly set up
[x] React components can be created and rendered

**Git Commit:**
```powershell
git add .
git commit -m "feat: initialize Vite with React and TypeScript"
```

### Step 1.2: Install and Configure Tailwind CSS
**Task:** Add Tailwind CSS to the project.
**Commands:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
**File Operations:**
- Create or modify `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
- Add Tailwind directives to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
**Validation Criteria:**
[x] Tailwind CSS classes apply correctly to elements
[x] Build process includes CSS processing
[x] Configuration files exist in the correct locations

**Git Commit:**
```powershell
git add .
git commit -m "feat: add and configure Tailwind CSS"
```

### Step 1.3: Install React Router
**Task:** Add routing capabilities to the application.
**Commands:**
```bash
npm install react-router-dom
```
**File Operations:**
- Create `src/router.tsx` with basic routes
- Update `src/App.tsx` to use the router
- Create placeholder pages for routing testing
**Validation Criteria:**
[x] Router is configured with basic routes
[x] Navigation between routes works correctly
[x] TypeScript types for router components are properly set

**Git Commit:**
```powershell
git add .
git commit -m "feat: add React Router and create basic routes"
```

### Step 1.4: Create Basic Project Structure
**Task:** Set up the full directory structure according to project guidelines.
**File Operations:**
- Create all required directories:
  ```
  src/
  ├── components/
  │   ├── ui/
  │   ├── layout/
  │   ├── vendor/
  │   ├── contract/
  │   ├── document/
  │   └── auth/
  ├── pages/
  │   ├── auth/
  │   ├── vendor/
  │   ├── contract/
  │   └── dashboard/
  ├── hooks/
  ├── lib/
  │   ├── api/
  │   └── supabase.ts
  ├── types/
  ├── utils/
  ├── schemas/
  ```
- Create empty index files in each directory to maintain structure (optional but good practice).
**Validation Criteria:**
[x] All directories exist in the correct locations
[x] Structure follows `general.mdc` project guidelines exactly
[x] TypeScript paths are configured correctly (if using path aliases)

**Git Commit:**
```powershell
git add .
git commit -m "feat: create complete project directory structure"
```

### Step 1.5: Setup Environment Variables
**Task:** Configure environment variables for the project.
**File Operations:**
- Create `.env.example` file:
```
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```
- Create `.env` (instruct user to add their actual values)
- Update `.gitignore` to exclude `.env`
**Validation Criteria:**
[x] `.env.example` exists with correct variable placeholders
[x] `.env` is listed in `.gitignore`
[x] Environment variables can be accessed using `import.meta.env.VITE_*`

**Git Commit:**
```powershell
git add .env.example .gitignore
git commit -m "chore: set up environment variables configuration"
```

## Phase 2: UI Infrastructure with shadcn/ui

**Git Phase Start:**
```powershell
git checkout -b feature/ui-infrastructure
```

### Step 2.1: Install shadcn/ui Core Dependencies
**Task:** Add required dependencies for shadcn/ui components.
**Commands:**
```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```
**Validation Criteria:**
[x] All dependencies install successfully
[x] No version conflicts exist
[x] TypeScript types are available for all dependencies

**Git Commit:**
```powershell
git add package.json package-lock.json
git commit -m "feat: install shadcn/ui core dependencies"
```

### Step 2.2: Install shadcn/ui CLI and Initialize Components
**Task:** Setup shadcn/ui and add base components.
**Commands:**
```bash
npm install -D @shadcn/ui
npx shadcn-ui init
```
**Configuration Inputs:** (During init process)
- TypeScript: `yes`
- Style: `default`
- Base color: `slate`
- Global CSS path: `src/index.css`
- CSS variables: `yes`
- React Server Components: `no`
- Components directory: `src/components/ui`
- Utils directory: `src/lib/utils`
**Validation Criteria:**
[x] shadcn/ui is initialized correctly
[x] Configuration file (`components.json`) exists
[x] Utility functions are created in the specified location (`src/lib/utils.ts`)
[x] Component installation commands work

**Git Commit:**
```powershell
git add .
git commit -m "feat: initialize shadcn/ui and create configuration"
```

### Step 2.3: Add Essential UI Components
**Task:** Install commonly used shadcn/ui components.
**Commands:**
```bash
npx shadcn-ui add button
npx shadcn-ui add input
npx shadcn-ui add form
npx shadcn-ui add select
npx shadcn-ui add card
npx shadcn-ui add table
npx shadcn-ui add avatar
npx shadcn-ui add dialog
npx shadcn-ui add dropdown-menu
npx shadcn-ui add toast
```
**Validation Criteria:**
[x] All components are installed in `src/components/ui/`
[x] Components can be imported and used
[x] Component TypeScript types are available
[x] Components render correctly with Tailwind styles

**Git Commit:**
```powershell
git add .
git commit -m "feat: add essential shadcn/ui components"
```

### Step 2.4: Create Layout Components
**Task:** Build reusable layout components for the application according to `frontend-rules.md` Rule 9.
**File Operations:**
- Create `src/components/layout/main-layout.tsx`:
  A layout component with header, navigation (sidebar), and main content area. Implement following `frontend-rules.md` Rule 9.
- Create `src/components/layout/page-header.tsx`:
  A reusable page header with title and optional actions. Implement following `frontend-rules.md` Rule 9.
- Create `src/components/layout/sidebar-nav.tsx`:
  A navigation sidebar with links to main sections (using `NavLink`). Implement following `frontend-rules.md` Rule 11.
**Validation Criteria:**
[x] Layout components use shadcn/ui elements appropriately
[x] Components are properly typed with TypeScript
[x] Layout is responsive and follows design guidelines in `frontend-rules.md` Rule 10.
[x] Components accept and correctly use props
[x] Implementation matches patterns in `frontend-rules.md`.

**Git Commit:**
```powershell
git add .
git commit -m "feat: create layout components for application structure"
```

**Git Phase Complete:**
```powershell
git push -u origin feature/ui-infrastructure
# Create PR to merge to develop (via UI)
# After PR is merged:
git checkout develop
git pull origin develop
git branch -d feature/ui-infrastructure
```

## Phase 3: Supabase Configuration and Core Types

**Git Phase Start:**
```powershell
git checkout develop
git checkout -b feature/supabase-config
```

### Step 3.1: Install Supabase Client
**Task:** Add Supabase client library to the project.
**Commands:**
```bash
npm install @supabase/supabase-js
```
**Validation Criteria:**
- [x] Supabase client can be imported
- [x] TypeScript types are available for Supabase client
- [x] No version conflicts exist

**Git Commit:**
```powershell
git add package.json package-lock.json
git commit -m "feat: install Supabase client library"
```

### Step 3.2: Create Supabase Client Configuration
**Task:** Set up a typed Supabase client instance *exactly* as specified in `backend-rules.md` Rule 3.
**File Operations:**
- Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
// Assuming types will be generated here based on backend-rules.md Rule 4
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Use the Database generic type for full type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```
**Validation Criteria:**
- [x] Supabase client is correctly initialized *with the `<Database>` generic type*
- [x] Environment variables are properly validated
- [x] Client is exported and can be imported elsewhere
- [x] TypeScript types are correctly applied
- [x] Implementation exactly matches `backend-rules.md` Rule 3.

**Git Commit:**
```powershell
git add src/lib/supabase.ts
git commit -m "feat: create Supabase client configuration"
```

### Step 3.2b: Generate Supabase TypeScript Types
**Task:** Generate TypeScript types for the Supabase database schema.
**Commands:**
```bash
# Install Supabase CLI if not already installed
npm install supabase --save-dev

# Generate types (replace project-id with actual Supabase project ID)
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

**Alternative Manual Type Definition (if CLI generation fails):**
```typescript
// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          status: string
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          vendor_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          value: number
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          value?: number
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          value?: number
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          description: string | null
          entity_type: string
          entity_id: string
          file_path: string
          file_type: string | null
          file_size: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          entity_type: string
          entity_id: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          entity_type?: string
          entity_id?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
    }
  }
}
```

**Validation Criteria:**
- [x] Types are generated successfully from Supabase schema
- [x] Generated/defined types match the database schema exactly
- [x] Types are properly exported and can be imported
- [x] All tables (profiles, vendors, contracts, documents) are represented in the types

**Git Commit:**
```powershell
git add src/types/supabase.ts package.json package-lock.json
git commit -m "feat: create Supabase database type definitions"
```

### Step 3.2c: Create Profiles Table and API Implementation
**Task:** Set up the profiles table in Supabase and implement its API functions *exactly* as defined in `backend-rules.md` Rule 1 & 5.

**SQL (to be executed in Supabase SQL Editor):**
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**File Operations:**
- Create `src/lib/api/profiles.ts`:
```typescript
import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { Database } from '@/types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Get the current user's profile
export async function getCurrentProfile() {
  return handleApiError(
    supabase
      .from('profiles')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Profile;
      })
  );
}

// Update the current user's profile
export async function updateProfile(updates: ProfileUpdate) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No authenticated user');
  
  return handleApiError(
    supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Profile;
      })
  );
}

// Create a profile for a new user (called after signup)
export async function createProfile(userId: string, email: string) {
  return handleApiError(
    supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
      })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Profile;
      })
  );
}
```

**Validation Criteria:**
- [x] Profiles table is created successfully in Supabase
- [x] RLS policies are properly applied
- [x] Trigger for `updated_at` works correctly
- [x] API functions are implemented following the patterns in `backend-rules.md` Rule 5
- [x] Error handling uses the `handleApiError` utility
- [x] TypeScript types from `Database` are properly applied
- [x] Profile creation is integrated with the signup process

**Git Commit:**
```powershell
git add src/lib/api/profiles.ts
git commit -m "feat: create profiles API implementation"
```

### Step 3.2d: Create Vendors Table and API Implementation
**Task:** Set up the vendors table in Supabase *exactly* as defined in `backend-rules.md` Rule 1.
**SQL (to be executed in Supabase SQL Editor):**
```sql
-- Create vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create or reuse updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON vendors
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Set up RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- RLS Policies from backend-rules.md Rule 1
CREATE POLICY "Authenticated users can read all vendors" ON vendors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert vendors" ON vendors FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL); -- Ensure created_by can be set
CREATE POLICY "Authenticated users can update vendors" ON vendors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete vendors" ON vendors FOR DELETE TO authenticated USING (true);
```
**Validation Criteria:**
- [x] Table is created successfully in Supabase matching `backend-rules.md` Rule 1 schema
- [x] Row-level security policies are applied correctly
- [x] Triggers work correctly (`updated_at`)
- [x] Data can be inserted and queried respecting RLS

**Git Commit:**
```powershell
git add src/lib/api/vendors.ts
git commit -m "feat: create vendors API implementation"
```

### Step 3.2e: Create Contracts Table and API Implementation
**Task:** Set up the contracts table in Supabase *exactly* as defined in `backend-rules.md` Rule 1.
**SQL (to be executed in Supabase SQL Editor):**
```sql
-- Create contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  value NUMERIC(15, 2) DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'active', 'completed', 'terminated')) DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT date_check CHECK (end_date >= start_date)
);

-- Create trigger using the existing update_modified_column function
CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Set up RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies from backend-rules.md Rule 1
CREATE POLICY "Authenticated users can read all contracts" ON contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert contracts" ON contracts FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update contracts" ON contracts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete contracts" ON contracts FOR DELETE TO authenticated USING (true);
```
**Validation Criteria:**
- [x] Table is created successfully in Supabase matching `backend-rules.md` Rule 1 schema
- [x] Foreign key relationship to vendors works correctly
- [x] Constraints (date check, status) work correctly
- [x] Row-level security policies are applied correctly
- [x] Triggers work correctly (`updated_at`)

**Git Commit:**
```powershell
git add src/lib/api/contracts.ts
git commit -m "feat: create contracts API implementation"
```

### Step 3.2f: Create Documents Table and API Implementation
**Task:** Set up the documents table in Supabase *exactly* as defined in `backend-rules.md` Rule 1.
**SQL (to be executed in Supabase SQL Editor):**
```sql
-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vendor', 'contract')),
  entity_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies for documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all documents
CREATE POLICY "Authenticated users can read all documents"
ON documents FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert documents
CREATE POLICY "Authenticated users can insert documents"
ON documents FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can delete documents
CREATE POLICY "Authenticated users can delete documents"
ON documents FOR DELETE
TO authenticated
USING (true);

-- Storage bucket RLS policies
-- Ensure bucket exists (or create via dashboard)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage.objects
CREATE POLICY "Authenticated users can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid());

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid());
```
**Validation Criteria:**
- [x] Storage bucket "documents" exists and is private
- [x] Documents table is created successfully
- [x] RLS policies for both `storage.objects` and `documents` table are applied correctly
- [x] Test upload/download/delete respects RLS policies

**Git Commit:**
```powershell
git add src/lib/api/documents.ts
git commit -m "feat: create documents API implementation"
```

## Phase 4: Authentication System (Previously Phase 5)

**Troubleshooting Note: "Database error saving new user" during Signup**

During the implementation of Phase 4, a persistent "500 Internal Server Error" with the message "Database error saving new user" occurred when attempting to sign up new users via the `supabase.auth.signUp` method.

**Root Cause Analysis:**
1.  Initial checks confirmed the `public.profiles` table existed and had `SELECT` and `UPDATE` RLS policies. An `INSERT` policy (`WITH CHECK (auth.uid() = id)`) was added, but the error persisted.
2.  Further analysis revealed the error originated *within* the `supabase.auth.signUp` transaction itself.
3.  The core issue was identified as a conflict between the RLS `INSERT` policy on `public.profiles` and an internal Supabase process attempting to interact with that table immediately after creating the `auth.users` record. This internal process likely runs under a context (e.g., `service_role` or `supabase_auth_admin`) that does not satisfy the `auth.uid() = id` check required by the user-centric `INSERT` policy.

**Resolution:**
1.  The conflicting user-centric `INSERT` policy (`Users can insert their own profile`) was removed from `public.profiles`.
2.  A database trigger function (`public.handle_new_user`) was created with `SECURITY DEFINER` privileges. This function inserts the necessary row into `public.profiles` using the `id` and `email` from the newly created `auth.users` record (`NEW.id`, `NEW.email`).
3.  A database trigger (`on_auth_user_created`) was attached to the `auth.users` table to execute the `handle_new_user` function `AFTER INSERT` for each new user.

This ensures the profile record is created automatically and atomically within the backend signup transaction, bypassing the RLS conflict and successfully resolving the 500 error. The frontend code in `AuthProvider` remains unchanged regarding profile creation.

---

### Step 4.1: Create Auth Types and Contexts
**Task:** Setup authentication types and React context *exactly* as defined in `auth-rules.md` Rule 3 & 4.
**File Operations:**
- Create `src/types/auth.ts`:
```typescript
// Copy types EXACTLY from auth-rules.md Rule 3
import type { User, Session } from '@supabase/supabase-js';

export type AuthUser = User; // Use Supabase User type directly

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{
    success: boolean; // Use success/error pattern
    error: string | null
  }>;
  signUp: (email: string, password: string) => Promise<{
    success: boolean; // Use success/error pattern
    error: string | null
  }>;
  signOut: () => Promise<void>;
}
```
- Create `src/context/auth-context.tsx`:
  Implement the `AuthProvider` component *exactly* as specified in `auth-rules.md` Rule 4. Ensure it uses `supabase.auth.onAuthStateChange` and provides the context value matching `AuthContextType`.
**Validation Criteria:**
- [x] Types (`AuthUser`, `AuthState`, `AuthContextType`) exactly match `auth-rules.md` Rule 3.
- [x] `AuthProvider` implementation exactly matches `auth-rules.md` Rule 4.
- [x] Context is properly typed and exported.
- [x] Provider correctly manages auth state using Supabase listeners.

**Git Commit:**
```powershell
git add src/types/auth.ts src/context/auth-context.tsx
git commit -m "feat: create auth types and context"
```

### Step 4.1b: Integrate AuthProvider
**Task:** Integrate the `AuthProvider` with the application *exactly* as specified in `auth-rules.md` Rule 6.
**File Operations:**
- Update `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**Validation Criteria:**
- [x] `AuthProvider` wraps the entire application
- [x] Provider is placed correctly in the component hierarchy (inside `BrowserRouter`)
- [x] Implementation exactly matches `auth-rules.md` Rule 6
- [x] Auth context is available throughout the application

**Git Commit:**
```powershell
git add src/main.tsx
git commit -m "feat: integrate AuthProvider"
```

### Step 4.2: Create Auth Hook
**Task:** Implement a custom hook for authentication *exactly* as specified in `auth-rules.md` Rule 5.
**File Operations:**
- Create `src/hooks/use-auth.ts`:
  Implement the `useAuth` hook exactly as shown in `auth-rules.md` Rule 5.
**Validation Criteria:**
- [x] Hook provides access to auth context defined in Step 4.1
- [x] TypeScript return type is correctly defined (`AuthContextType`)
- [x] Hook includes check for provider existence.
- [x] Implementation exactly matches `auth-rules.md` Rule 5.

**Git Commit:**
```powershell
git add src/hooks/use-auth.ts
git commit -m "feat: create useAuth hook"
```

### Step 4.3: Create Login Page
**Task:** Build a login page with email/password authentication using `auth-rules.md` Rule 8 as a structural guide.
**File Operations:**
- Create `src/pages/auth/login-page.tsx`:
  A page with login form using `shadcn/ui` components (`Input`, `Button`, `Label`). Use the `useAuth` hook (Step 4.2) to call the `signIn` method. Handle form state, submission, loading state, and display errors based on the `{ success, error }` response. Redirect on success.
**Validation Criteria:**
- [x] Form uses shadcn/ui components.
- [x] Validation is implemented (e.g., required fields).
- [x] `signIn` function from `useAuth` hook is called on submit.
- [x] Error messages from the `signIn` response are displayed to the user.
- [x] Success redirects to the dashboard or intended page.
- [x] Loading state disables the submit button.

**Git Commit:**
```powershell
git add src/pages/auth/login-page.tsx
git commit -m "feat: create login page"
```

### Step 4.4: Create Signup Page
**Task:** Build a signup page for new user registration using `auth-rules.md` Rule 9 as a structural guide.
**File Operations:**
- Create `src/pages/auth/signup-page.tsx`:
  A page with signup form using `shadcn/ui` components. Use the `useAuth` hook (Step 4.2) to call the `signUp` method. Handle form state, submission, loading state, password confirmation (optional but recommended), and display errors based on the `{ success, error }` response. Show confirmation message or redirect on success.
**Validation Criteria:**
- [x] Form uses shadcn/ui components.
- [x] Validation is implemented (e.g., required fields, password rules).
- [x] `signUp` function from `useAuth` hook is called on submit.
- [x] Error messages from the `signUp` response are displayed to the user.
- [x] Success shows a confirmation message (e.g., "Check your email") or redirects to login.
- [x] Loading state disables the submit button.

**Git Commit:**
```powershell
git add src/pages/auth/signup-page.tsx
git commit -m "feat: create signup page"
```

### Step 4.5: Create Protected Route Component
**Task:** Implement route protection based on authentication status *exactly* as specified in `auth-rules.md` Rule 7.
**File Operations:**
- Create `src/components/auth/protected-route.tsx`:
  Implement the `ProtectedRoute` component exactly as shown in `auth-rules.md` Rule 7, using the `useAuth` hook.
**Validation Criteria:**
- [x] Component correctly checks `isAuthenticated` and `isLoading` from `useAuth`.
- [x] Redirects unauthenticated users to `/login`.
- [x] Shows a loading indicator while `isLoading` is true.
- [x] Renders children when authenticated.
- [x] Implementation exactly matches `auth-rules.md` Rule 7.

**Git Commit:**
```powershell
git add src/components/auth/protected-route.tsx
git commit -m "feat: create ProtectedRoute component"
```

### Step 4.6: Update Router with Protected Routes
**Task:** Apply route protection to appropriate routes using the pattern in `auth-rules.md` Rule 11.
**File Operations:**
- Update `src/router.tsx` (or wherever `AppRouter` is defined):
  Wrap routes requiring authentication with the `ProtectedRoute` component (Step 4.5). Ensure public routes like `/login` and `/signup` remain outside the protected wrapper. Use layout nesting as shown in `frontend-rules.md` Rule 11.
**Validation Criteria:**
- [x] Protected routes use the `ProtectedRoute` component.
- [x] Public routes remain accessible without authentication.
- [x] Redirects work correctly for unauthenticated access attempts.
- [x] Router structure integrates layout and protection as per rules.

**Git Commit:**
```powershell
git add src/router.tsx
git commit -m "feat: apply route protection"
```

### Step 4.7: Create Logout Component
**Task:** Implement the logout button component *exactly* as specified in `auth-rules.md` Rule 10.
**File Operations:**
- Create `src/components/auth/logout-button.tsx`:
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
    >
      Logout
    </Button>
  );
}
```

- Update `src/components/layout/main-layout.tsx` to include the `LogoutButton` in the header/navigation area.

**Validation Criteria:**
- [x] Component implementation matches `auth-rules.md` Rule 10 exactly
- [x] Logout functionality works correctly using `useAuth` hook
- [x] Navigation to login page occurs after successful logout
- [x] Button styling is consistent with the application theme
- [x] Component is properly integrated into the main layout

**Git Commit:**
```powershell
git add src/components/auth/logout-button.tsx
git commit -m "feat: create LogoutButton component"
```

## Phase 5: Vendor Management Implementation (Previously Phase 4)

### Step 5.1: Create Vendor List Page
**Task:** Create a page to display and manage vendors, following `frontend-rules.md` (Rules 6, 13, 14).
**File Operations:**
- Create `src/pages/vendor/vendor-list.tsx`:
  A page showing vendors in a `shadcn/ui` Table with search, filter (optional), and actions (view, edit, delete buttons/links). Fetch data using `getVendors` from Step 5.2. Implement loading, error, and empty states.
**Validation Criteria:**
- [ ] Page fetches and displays vendors correctly using API function
- [ ] Loading, error, and empty states are handled appropriately per `frontend-rules.md`
- [ ] Table uses shadcn/ui components
- [ ] Actions (view, edit, delete) link to appropriate routes or trigger API calls (delete).

**Git Commit:**
```powershell
git add src/pages/vendor/vendor-list.tsx
git commit -m "feat: create vendor list page"
```

### Step 5.2: Create Vendor Form Component
**Task:** Create a reusable form for adding and editing vendors, following `frontend-rules.md` Rule 7 (or 8 if using Zod).
**File Operations:**
- Create `src/components/vendor/vendor-form.tsx`:
  A form component using `shadcn/ui` Form components (`Input`, `Select` for status, `Textarea` for notes/address). Handle form state, submission (calling `createVendor` or `updateVendor`), loading state, and error display.
**Validation Criteria:**
- [ ] Form uses shadcn/ui components
- [ ] Validation is implemented (HTML5 basic or Zod later)
- [ ] Form handles both create and edit modes (e.g., via props)
- [ ] TypeScript props are properly defined
- [ ] Submission calls correct API functions and handles response/errors
- [ ] **Accessibility Requirements:**
  - [ ] All form inputs have associated labels with proper `htmlFor` attributes
  - [ ] Error messages are announced to screen readers using `aria-invalid` and `aria-describedby`
  - [ ] Form can be navigated and submitted using keyboard only
  - [ ] Color contrast meets WCAG standards (4.5:1 minimum)
  - [ ] Loading state is announced to screen readers
  - [ ] Success/error messages are announced via ARIA live regions

**Git Commit:**
```powershell
git add src/components/vendor/vendor-form.tsx
git commit -m "feat: create vendor form component"
```

### Step 5.3: Create Vendor Detail Page
**Task:** Create a page to view vendor details, following `frontend-rules.md`.
**File Operations:**
- Create `src/pages/vendor/vendor-detail.tsx`:
  A page fetching vendor details using `getVendorById`. Display information using `shadcn/ui` Card or definition list style. Include placeholders/sections for related documents and contracts. Add Edit/Delete actions. Handle loading/error states.
**Validation Criteria:**
- [ ] Page fetches and displays vendor details correctly using API function
- [ ] Loading and error states are handled
- [ ] Related data (documents, contracts) placeholders exist
- [ ] Actions (edit, delete) are implemented (linking to edit form, triggering delete API).

**Git Commit:**
```powershell
git add src/pages/vendor/vendor-detail.tsx
git commit -m "feat: create vendor detail page"
```

## Phase 6: Contract Management Implementation

### Step 6.1: Create Contract List Page
**Task:** Create a page to display and manage contracts, following `frontend-rules.md`.
**File Operations:**
- Create `src/pages/contract/contract-list.tsx`:
  A page showing contracts in a `shadcn/ui` Table. Fetch data using `getContracts` (Step 6.2). Include columns like Title, Vendor Name (from join), Status, Dates. Add search/filter (optional). Add actions (View, Edit, Delete). Implement loading, error, empty states.
**Validation Criteria:**
- [ ] Page fetches and displays contracts correctly using API function.
- [ ] Loading, error, and empty states are handled appropriately per `frontend-rules.md`.
- [ ] Table uses shadcn/ui components.
- [ ] Data from related tables (e.g., Vendor Name) is displayed correctly.
- [ ] Actions (view, edit, delete) link to appropriate routes or trigger API calls.

**Git Commit:**
```powershell
git add src/pages/contract/contract-list.tsx
git commit -m "feat: create contract list page"
```

### Step 6.2: Create Contract Form Component
**Task:** Create a reusable form for adding and editing contracts, following `frontend-rules.md`.
**File Operations:**
- Create `src/components/contract/contract-form.tsx`:
  A form using `shadcn/ui` components (`Input` for title/value, `Textarea` for description, `Select` for vendor/status, Date pickers). Populate Vendor select by fetching vendors. Handle form state, submission (calling `createContract` or `updateContract`), loading state, error display. Validate dates (`end_date >= start_date`).
**Validation Criteria:**
- [ ] Form uses shadcn/ui components, including date pickers
- [ ] Vendor selection dropdown is populated and works
- [ ] Date validation and other field validations are implemented
- [ ] Form handles both create and edit modes
- [ ] Submission calls correct API functions and handles response/errors
- [ ] **Accessibility Requirements:**
  - [ ] All form controls have descriptive labels with proper `htmlFor` attributes
  - [ ] Date pickers are keyboard accessible and announce selected dates
  - [ ] Error messages are announced to screen readers using `aria-invalid` and `aria-describedby`
  - [ ] Form can be navigated and submitted using keyboard only
  - [ ] Color contrast meets WCAG standards (4.5:1 minimum)
  - [ ] Loading state is announced to screen readers
  - [ ] Success/error messages are announced via ARIA live regions

**Git Commit:**
```powershell
git add src/components/contract/contract-form.tsx
git commit -m "feat: create contract form component"
```

### Step 6.3: Create Contract Detail Page
**Task:** Create a page to view contract details, following `frontend-rules.md`.
**File Operations:**
- Create `src/pages/contract/contract-detail.tsx`:
  A page fetching contract details using `getContractById`. Display information (including vendor name) using `shadcn/ui` Card or definition list. Include placeholders/sections for related documents. Add Edit/Delete actions. Handle loading/error states.
**Validation Criteria:**
- [ ] Page fetches and displays contract details correctly using API function.
- [ ] Related vendor information is displayed.
- [ ] Status is visually indicated (e.g., using badges).
- [ ] Loading and error states are handled.
- [ ] Related data (documents) placeholders exist.
- [ ] Actions (edit, delete) are implemented.

**Git Commit:**
```powershell
git add src/pages/contract/contract-detail.tsx
git commit -m "feat: create contract detail page"
```

## Phase 7: Document Management Implementation

### Step 7.1: Create Document List Component
**Task:** Create a component to display documents, following `frontend-rules.md`.
**File Operations:**
- Create `src/components/document/document-list.tsx`:
  A component that fetches documents using `getDocumentsByEntity` (Step 7.2) based on props (`entityType`, `entityId`). Display documents in a list or table (`shadcn/ui`). Include actions for each document: Download (fetches signed URL via `getDocumentUrl` and creates a link) and Delete (calls `deleteDocument`). Handle loading/error/empty states.
**Validation Criteria:**
- [ ] Documents are fetched and displayed correctly for the given entity.
- [ ] Download action generates a signed URL and initiates download.
- [ ] Delete action calls the `deleteDocument` API and updates the list on success.
- [ ] Empty and loading/error states are handled appropriately.

**Git Commit:**
```powershell
git add src/components/document/document-list.tsx
git commit -m "feat: create document list component"
```

### Step 7.2: Integrate Documents with Vendor and Contract Pages
**Task:** Add document management sections to vendor and contract detail pages.
**File Operations:**
- Update `src/pages/vendor/vendor-detail.tsx`: Add the `DocumentUpload` (Step 7.3) and `DocumentList` (Step 7.4) components, passing the correct `entityType` ('vendor') and `entityId`.
- Update `src/pages/contract/contract-detail.tsx`: Add the `DocumentUpload` (Step 7.3) and `DocumentList` (Step 7.4) components, passing the correct `entityType` ('contract') and `entityId`.
**Validation Criteria:**
- [ ] Document upload component is present and functional on detail pages.
- [ ] Document list component is present and functional, displaying relevant documents.
- [ ] Uploads/deletions correctly reflect in the list component after refresh/real-time update.
- [ ] UI integration is clean and consistent.

**Git Commit:**
```powershell
git add src/pages/vendor/vendor-detail.tsx src/pages/contract/contract-detail.tsx
git commit -m "feat: integrate documents with vendor and contract detail pages"
```

## Phase 8: Dashboard and Final Polish

### Step 8.1: Create Dashboard Page
**Task:** Build a dashboard with summary information, following `frontend-rules.md`.
**File Operations:**
- Create `src/pages/dashboard/dashboard-page.tsx`:
  A page displaying summary information, potentially using `shadcn/ui` Cards. Examples: Total Vendors, Active Contracts count, Recently Added Vendors/Contracts. Fetch necessary data using existing or new lightweight API calls.
**Validation Criteria:**
- [ ] Dashboard fetches and displays summary statistics correctly.
- [ ] Recent items list is populated (if implemented).
- [ ] Layout uses `shadcn/ui` components effectively.
- [ ] Loading/error states are handled for data fetching.

**Git Commit:**
```powershell
git add src/pages/dashboard/dashboard-page.tsx
git commit -m "feat: create dashboard page"
```

### Step 8.2: Add Form Validation with Zod
**Task:** Add schema validation to all forms using Zod and react-hook-form, following `frontend-rules.md` Rule 8.
**Commands:**
```bash
npm install zod react-hook-form @hookform/resolvers
```
**File Operations:**
- Create `src/schemas/vendor.schema.ts`: Define Zod schema matching `VendorFormValues`.
- Create `src/schemas/contract.schema.ts`: Define Zod schema matching `ContractFormValues`.
- Update `src/components/vendor/vendor-form.tsx` to use `useForm`, `zodResolver`, and `shadcn/ui` `Form` components.
- Update `src/components/contract/contract-form.tsx` to use `useForm`, `zodResolver`, and `shadcn/ui` `Form` components.
- Update `src/pages/auth/login-page.tsx` and `src/pages/auth/signup-page.tsx` with Zod validation if desired.
**Validation Criteria:**
- [ ] Zod schemas are properly typed and match form data structures.
- [ ] `react-hook-form` and `zodResolver` are integrated into forms.
- [ ] `shadcn/ui` Form components (`FormField`, `FormItem`, `FormMessage`, etc.) are used.
- [ ] Validation errors are displayed correctly next to form fields.
- [ ] Form submission is blocked on validation failure.

**Git Commit:**
```powershell
git add src/schemas/vendor.schema.ts src/schemas/contract.schema.ts
git commit -m "feat: create Zod schema for vendor and contract forms"
```

### Step 8.3: Add Toast Notifications
**Task:** Implement toast notifications for user feedback using `shadcn/ui` Toast.
**File Operations:**
- Ensure `Toast` and `Toaster` components from `shadcn/ui` are installed and available.
- Add `<Toaster />` component to the main layout (`src/components/layout/main-layout.tsx` or `src/App.tsx`).
- Create a hook or utility for showing toasts (e.g., `src/hooks/use-toast.ts` leveraging `shadcn/ui`'s `useToast`).
- Update API call sites (form submissions, delete actions) to show success or error toasts using the hook/utility.
**Validation Criteria:**
- [ ] `<Toaster />` is added to the main application layout.
- [ ] A hook/utility (`useToast`) is available for triggering toasts.
- [ ] Success messages (e.g., "Vendor created successfully") are shown after successful operations.
- [ ] Error messages (e.g., "Failed to delete contract") are shown when API calls fail.
- [ ] Toast styling is consistent with the theme.

**Git Commit:**
```powershell
git add src/components/layout/main-layout.tsx
git commit -m "feat: add Toaster component"
```

### Step 8.4: Implement Error Boundaries
**Task:** Add React Error Boundaries to handle unexpected rendering errors gracefully, following `frontend-rules.md`.
**File Operations:**
- Create `src/components/error-boundary.tsx`:
  A class component implementing `getDerivedStateFromError` and `componentDidCatch`. Render a fallback UI when an error is caught.
- Update `src/App.tsx` or main layout to wrap the primary content or router with the `ErrorBoundary`.
**Validation Criteria:**
- [ ] Error boundary component is created correctly.
- [ ] Error boundary catches JavaScript errors during rendering in its child component tree.
- [ ] A user-friendly fallback UI is displayed instead of a blank screen or broken app.
- [ ] Errors are logged via `componentDidCatch` for debugging.

**Git Commit:**
```powershell
git add src/components/error-boundary.tsx
git commit -m "feat: create ErrorBoundary component"
```

### Step 8.5: Create Documentation
**Task:** Create project documentation.
**File Operations:**
- Create/Update `README.md`:
  Include project overview, tech stack, setup instructions (cloning, `npm install`), environment variable setup (`.env` from `.env.example`), running the development server (`npm run dev`), build command (`npm run build`), and a brief explanation of the project structure and key features.
**Validation Criteria:**
- [ ] `README.md` exists in the project root.
- [ ] Installation and setup instructions are clear and accurate.
- [ ] Environment variable requirements are documented.
- [ ] Basic usage instructions are provided.

**Git Commit:**
```powershell
git add README.md
git commit -m "feat: create README.md"
```

### Step 8.6: Final Testing and Deployment Preparation
**Task:** Perform final testing and prepare for deployment.
**Steps:**
1. Thoroughly test all CRUD operations for Vendors, Contracts, and Documents.
2. Test authentication flow (signup, login, logout, protected routes).
3. Test form validations and error handling.
4. Test responsiveness across different screen sizes (mobile, tablet, desktop).
5. Check browser console for any errors or warnings.
6. Run the build command: `npm run build`.
7. (Optional) Configure project on Vercel (or chosen platform), setting up environment variables.
**Validation Criteria:**
- [ ] All application features work as expected across different scenarios.
- [ ] No critical errors or warnings in the browser console.
- [ ] The application builds successfully using `npm run build`.
- [ ] The application is responsive and usable on major screen sizes.
- [ ] Deployment environment variables are identified and ready.

**Git Commit:**
```powershell
git add .
git commit -m "feat: perform final testing and prepare for deployment"
```

## End of Implementation Plan