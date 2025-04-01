# Cursor-AI-Optimized Implementation Plan for VMP PLUS

> **Reference Documents**:
> - `general.mdc`: General project guidelines and rules
> - `backend.mdc`: Backend implementation guidelines for Supabase
> - `frontend.mdc`: Frontend UI development guidelines

## Project Setup

### Step 1a: Initialize Vite + React + TypeScript
- **Task**: Create new Vite React + TypeScript project
- **Reference**: See `general.mdc#tech-stack` for technology choices
- **User Instructions**: 
  1. Run: `npm create vite@latest vmp-plus -- --template react-ts`
  2. Change to project directory: `cd vmp-plus`
  3. Install core dependencies: `npm install`
- **Validation**:
  - [ ] Project structure matches `general.mdc#project-structure`
  - [ ] TypeScript and React dependencies are installed
  - [ ] Project builds without errors

### Step 1b: Add React Router
- **Task**: Add React Router for page navigation
- **Reference**: See `frontend.mdc#router-configuration` for final implementation
- **User Instructions**: Run: `npm install react-router-dom`
- **File Operations**:
  - **src/main.tsx**: Update to include BrowserRouter
- **Validation**:
  - [ ] Router is properly configured
  - [ ] Basic navigation works
  - [ ] TypeScript types are properly set up

### Step 2a: Configure Tailwind CSS
- **Task**: Install and configure Tailwind CSS
- **Reference**: See `frontend.mdc#ui-design-guidelines` for styling conventions
- **User Instructions**: 
  1. Run: `npm install -D tailwindcss postcss autoprefixer`
  2. Initialize config: `npx tailwindcss init -p`
- **File Operations**:
  - **tailwind.config.js**: Configure content paths
  - **src/index.css**: Add Tailwind directives
- **Validation**:
  - [ ] Tailwind classes are working
  - [ ] Color scheme matches guidelines
  - [ ] Build process includes CSS

### Step 2b: Add Common UI Dependencies
- **Task**: Add UI component libraries
- **Reference**: See `frontend.mdc#components` for component guidelines
- **User Instructions**: Run: `npm install lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-separator`
- **Validation**:
  - [ ] All dependencies install correctly
  - [ ] Components can be imported
  - [ ] TypeScript types are available

### Step 3a: Create Base Layout Component
- **Task**: Create minimal layout with header and main content area
- **Reference**: See `frontend.mdc#layout` for layout guidelines
- **File Operations**:
  - **src/components/layout/main-layout.tsx**: Create new file with simple layout
- **Validation**:
  - [ ] Layout follows naming conventions (kebab-case)
  - [ ] Component uses TypeScript properly
  - [ ] Layout is responsive

### Step 3b: Create Navigation Component
- **Task**: Create basic navigation bar
- **Reference**: See `frontend.mdc#components` for navigation examples
- **File Operations**:
  - **src/components/ui/navigation-bar.tsx**: Create with basic navigation items
- **Validation**:
  - [ ] Navigation follows naming conventions
  - [ ] Links are properly typed
  - [ ] Component is responsive

### Step 3c: Set Up Router Configuration
- **Task**: Create router configuration with placeholder routes
- **Reference**: See `frontend.mdc#router-configuration` for complete setup
- **File Operations**:
  - **src/router.tsx**: Create with base routes (home, login, etc)
  - **src/app.tsx**: Update to use router
- **Validation**:
  - [ ] Routes match application structure
  - [ ] Navigation works correctly
  - [ ] 404 handling is implemented

## Supabase Integration

### Step 4a: Install Supabase Client
- **Task**: Add Supabase client library
- **Reference**: See `backend.mdc#supabase-configuration` for setup details
- **User Instructions**: Run: `npm install @supabase/supabase-js`
- **Validation**:
  - [ ] Supabase client can be imported
  - [ ] TypeScript types are available
  - [ ] Version matches project requirements

### Step 4b: Set Up Environment Variables
- **Task**: Create environment files for Supabase credentials
- **Reference**: See `backend.mdc#client-setup` for required variables
- **File Operations**:
  - **.env**: Create with empty variables
  - **.env.example**: Create example file
- **User Instructions**: Add your Supabase URL and anon key to .env:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
- **Validation**:
  - [ ] Environment variables are properly typed
  - [ ] .env is in .gitignore
  - [ ] .env.example exists with placeholders

### Step 4c: Create Supabase Client
- **Task**: Create a typed Supabase client
- **Reference**: See `backend.mdc#client-setup` for implementation example
- **File Operations**:
  - **src/lib/supabase.ts**: Create client initialization file
- **Validation**:
  - [ ] Client is properly typed
  - [ ] Error handling is implemented
  - [ ] Environment variables are validated

## Authentication

### Step 5a: Create Auth Types
- **Task**: Create TypeScript types for auth
- **Reference**: See `backend.mdc#authentication-implementation` for type definitions
- **File Operations**:
  - **src/types/auth.ts**: Create types for user, session, etc.
- **Validation**:
  - [ ] Types match Supabase auth schema
  - [ ] Custom types are properly defined
  - [ ] Types are properly exported

### Step 5b: Create Auth Hook (Part 1)
- **Task**: Create useAuth hook for authentication state
- **Reference**: See `backend.mdc#authentication-hooks` for implementation
- **File Operations**:
  - **src/hooks/use-auth.ts**: Create with basic structure
- **Validation**:
  - [ ] Hook follows naming conventions
  - [ ] State management is implemented
  - [ ] TypeScript types are correct

### Step 5c: Create Auth Hook (Part 2)
- **Task**: Add sign-in and sign-up functions to hook
- **Reference**: See `backend.mdc#authentication-hooks` for complete implementation
- **File Operations**:
  - **src/hooks/use-auth.ts**: Extend with signIn and signUp functions
- **Validation**:
  - [ ] Sign-in function works correctly
  - [ ] Sign-up function works correctly
  - [ ] Error handling is implemented
  - [ ] Session management works

### Step 5d: Create Login Page 
- **Task**: Create simple login page with email/password
- **Reference**: See `frontend.mdc#form-implementation` for form examples
- **File Operations**:
  - **src/pages/auth/login-page.tsx**: Create with form
- **Validation**:
  - [ ] Form validation works
  - [ ] Error messages are displayed
  - [ ] Successful login redirects correctly
  - [ ] Loading states are handled

### Step 5e: Create Signup Page
- **Task**: Create simple signup page
- **Reference**: See `frontend.mdc#form-implementation` for form examples
- **File Operations**:
  - **src/pages/auth/signup-page.tsx**: Create with form
- **Validation**:
  - [ ] Form validation works
  - [ ] Error messages are displayed
  - [ ] Successful signup creates profile
  - [ ] Loading states are handled

### Step 5f: Create Logout Button
- **Task**: Create logout functionality
- **Reference**: See `frontend.mdc#components` for button implementation
- **File Operations**:
  - **src/components/ui/logout-button.tsx**: Create component
- **Validation**:
  - [ ] Logout function works
  - [ ] User is redirected after logout
  - [ ] Session is properly cleared

### Step 6a: Set Up Profiles Table in Supabase
- **Task**: Create SQL for profiles table
- **Reference**: See `backend.mdc#profiles-table` for schema and policies
- **File Operations**:
  - **db/create_profiles_table.sql**: Create SQL file
- **User Instructions**: 
  1. Create the profiles table in Supabase using the schema defined in backend.mdc
  2. Execute the SQL in Supabase SQL Editor
- **Validation**:
  - [ ] Table structure matches schema
  - [ ] RLS policies are implemented
  - [ ] Foreign key constraints work
  - [ ] Triggers are properly set up

### Step 6b: Extend Auth Hook for Roles
- **Task**: Add role fetching to auth hook
- **Reference**: See `backend.mdc#authentication-hooks` for role implementation
- **File Operations**:
  - **src/hooks/use-auth.ts**: Add getUserRole function
- **Validation**:
  - [ ] Role is fetched on login
  - [ ] Role updates are reflected
  - [ ] Error handling works
  - [ ] TypeScript types are correct

### Step 6c: Create Protected Routes
- **Task**: Add route protection based on auth state
- **Reference**: See `frontend.mdc#router-configuration` for protection examples
- **File Operations**:
  - **src/components/auth/protected-route.tsx**: Create component
  - **src/router.tsx**: Update to use protected routes
- **Validation**:
  - [ ] Unauthenticated users are redirected
  - [ ] Loading states are handled
  - [ ] Role-based access works
  - [ ] Navigation guards work correctly

## Vendor Management

### Step 7a: Set Up Vendors Table in Supabase
- **Task**: Create SQL for vendors table
- **Reference**: See `backend.mdc#vendors-table` for schema and policies
- **File Operations**:
  - **db/create_vendors_table.sql**: Create SQL file
- **User Instructions**: 
  1. Create the vendors table in Supabase using the schema defined in backend.mdc
  2. Execute the SQL in Supabase SQL Editor
- **Validation**:
  - [ ] Table structure matches schema
  - [ ] RLS policies are implemented
  - [ ] Indexes are created
  - [ ] Constraints are properly set

### Step 7b: Create Vendor Types
- **Task**: Create TypeScript types for vendors
- **Reference**: See `general.mdc#typescript-rules` for type guidelines
- **File Operations**:
  - **src/types/vendor.ts**: Create with Vendor interface
- **Validation**:
  - [ ] Types match database schema
  - [ ] Form types are defined
  - [ ] Types are properly exported
  - [ ] TypeScript validation passes

### Step 7c: Create Vendor API Functions (Part 1)
- **Task**: Create functions for fetching vendors
- **Reference**: See `backend.mdc#api-implementation-rules` for function structure
- **File Operations**:
  - **src/lib/api/vendors.ts**: Create with getVendors and getVendorById
- **Validation**:
  - [ ] Functions are properly typed
  - [ ] Error handling is implemented
  - [ ] Response format is consistent
  - [ ] Query optimization is applied

### Step 7d: Create Vendor API Functions (Part 2)
- **Task**: Create functions for creating and updating vendors
- **Reference**: See `backend.mdc#api-implementation-rules` for function structure
- **File Operations**:
  - **src/lib/api/vendors.ts**: Add createVendor and updateVendor
- **Validation**:
  - [ ] Functions are properly typed
  - [ ] Validation is implemented
  - [ ] Error handling works
  - [ ] Response format is consistent

### Step 7e: Create Vendor List Page
- **Task**: Create page to display vendors
- **Reference**: See `frontend.mdc#page-structure` for implementation example
- **File Operations**:
  - **src/pages/vendor/vendor-list.tsx**: Create with table layout
- **Validation**:
  - [ ] Data fetching works
  - [ ] Loading states are handled
  - [ ] Error states are handled
  - [ ] Table is properly styled

### Step 7f: Create Vendor Form Component
- **Task**: Create form for adding/editing vendors
- **Reference**: See `frontend.mdc#form-implementation` for form examples
- **File Operations**:
  - **src/pages/vendor/vendor-form.tsx**: Create with form fields
- **Validation**:
  - [ ] Form validation works
  - [ ] Error messages are displayed
  - [ ] Submit handling works
  - [ ] Loading states are handled

### Step 8a: Add Search Component to Vendor List
- **Task**: Add search input to filter vendors by name
- **Reference**: See `frontend.mdc#components` for search implementation
- **File Operations**:
  - **src/components/vendor/vendor-search.tsx**: Create component
  - **src/pages/vendor/vendor-list.tsx**: Update to include search
- **Validation**:
  - [ ] Search updates in real-time
  - [ ] Results are filtered correctly
  - [ ] UI is responsive
  - [ ] Accessibility is implemented

### Step 8b: Add Status Filter to Vendor List
- **Task**: Add dropdown to filter vendors by status
- **Reference**: See `frontend.mdc#components` for filter implementation
- **File Operations**:
  - **src/components/vendor/status-filter.tsx**: Create component
  - **src/pages/vendor/vendor-list.tsx**: Update to include filter
- **Validation**:
  - [ ] Filter updates correctly
  - [ ] Combined filtering works
  - [ ] UI is responsive
  - [ ] State management works

## Document Management

### Step 9a: Set Up Storage Bucket in Supabase
- **Task**: Create SQL for storage permissions
- **Reference**: See `backend.mdc#document-storage` for bucket setup
- **File Operations**:
  - **db/create_storage_bucket.sql**: Create SQL file
- **User Instructions**: 
  1. Set up the storage bucket and policies as defined in backend.mdc
  2. Execute the SQL in Supabase SQL Editor
  3. Create the bucket in Supabase dashboard
- **Validation**:
  - [ ] Bucket is created successfully
  - [ ] RLS policies are implemented
  - [ ] Upload permissions work
  - [ ] Download permissions work

### Step 9b: Create Document Types
- **Task**: Create TypeScript types for documents
- **Reference**: See `general.mdc#typescript-rules` for type guidelines
- **File Operations**:
  - **src/types/document.ts**: Create with Document interface
- **Validation**:
  - [ ] Types match storage schema
  - [ ] Metadata types are defined
  - [ ] Types are properly exported
  - [ ] TypeScript validation passes

### Step 9c: Create Document API Functions
- **Task**: Create functions for document upload/download
- **Reference**: See `backend.mdc#document-storage` for implementation
- **File Operations**:
  - **src/lib/api/documents.ts**: Create with uploadDocument and downloadDocument
- **Validation**:
  - [ ] Upload function works
  - [ ] Download function works
  - [ ] Error handling is implemented
  - [ ] Progress tracking works

### Step 9d: Create Document Upload Component
- **Task**: Create UI for document upload
- **Reference**: See `frontend.mdc#form-implementation` for upload examples
- **File Operations**:
  - **src/components/document/document-upload.tsx**: Create component
- **Validation**:
  - [ ] File selection works
  - [ ] Upload progress is shown
  - [ ] Error handling works
  - [ ] Success feedback is shown

### Step 9e: Add Documents to Vendor Detail Page
- **Task**: Create vendor detail page with document section
- **Reference**: See `frontend.mdc#page-structure` for page layout
- **File Operations**:
  - **src/pages/vendor/vendor-detail.tsx**: Create with document area
- **Validation**:
  - [ ] Documents are listed
  - [ ] Upload works
  - [ ] Download works
  - [ ] Delete works

## Contract Management

### Step 10a: Set Up Contracts Table in Supabase
- **Task**: Create SQL for contracts table
- **Reference**: See `backend.mdc#contracts-table` for schema and policies
- **File Operations**:
  - **db/create_contracts_table.sql**: Create SQL file
- **User Instructions**: 
  1. Create the contracts table in Supabase using the schema defined in backend.mdc
  2. Execute the SQL in Supabase SQL Editor
- **Validation**:
  - [ ] Table structure matches schema
  - [ ] RLS policies are implemented
  - [ ] Foreign keys work
  - [ ] Indexes are created

### Step 10b: Create Contract Types
- **Task**: Create TypeScript types for contracts
- **Reference**: See `general.mdc#typescript-rules` for type guidelines
- **File Operations**:
  - **src/types/contract.ts**: Create with Contract interface
- **Validation**:
  - [ ] Types match database schema
  - [ ] Form types are defined
  - [ ] Types are properly exported
  - [ ] TypeScript validation passes

### Step 10c: Create Contract API Functions (Part 1)
- **Task**: Create functions for fetching contracts
- **Reference**: See `backend.mdc#api-implementation-rules` for function structure
- **File Operations**:
  - **src/lib/api/contracts.ts**: Create with getContracts and getContractById
- **Validation**:
  - [ ] Functions are properly typed
  - [ ] Error handling is implemented
  - [ ] Response format is consistent
  - [ ] Query optimization is applied

### Step 10d: Create Contract API Functions (Part 2)
- **Task**: Create functions for creating and updating contracts
- **Reference**: See `backend.mdc#api-implementation-rules` for function structure
- **File Operations**:
  - **src/lib/api/contracts.ts**: Add createContract and updateContract
- **Validation**:
  - [ ] Functions are properly typed
  - [ ] Validation is implemented
  - [ ] Error handling works
  - [ ] Response format is consistent

### Step 10e: Create Contract List Page
- **Task**: Create page to display contracts
- **Reference**: See `frontend.mdc#page-structure` for implementation example
- **File Operations**:
  - **src/pages/contract/contract-list.tsx**: Create with table layout
- **Validation**:
  - [ ] Data fetching works
  - [ ] Loading states are handled
  - [ ] Error states are handled
  - [ ] Table is properly styled

### Step 10f: Create Contract Form Component
- **Task**: Create form for adding/editing contracts
- **Reference**: See `frontend.mdc#form-implementation` for form examples
- **File Operations**:
  - **src/pages/contract/contract-form.tsx**: Create with form fields
- **Validation**:
  - [ ] Form validation works
  - [ ] Error messages are displayed
  - [ ] Submit handling works
  - [ ] Loading states are handled

### Step 11a: Create Contract Status Util
- **Task**: Create utility to determine contract status
- **Reference**: See `frontend.mdc#components` for status implementation
- **File Operations**:
  - **src/utils/contract-status.ts**: Create utility function
- **Validation**:
  - [ ] Status calculation works
  - [ ] Edge cases are handled
  - [ ] Tests are written
  - [ ] Documentation is added

### Step 11b: Add Status Display to Contract List
- **Task**: Update contract list to show status
- **Reference**: See `frontend.mdc#components` for status badge examples
- **File Operations**:
  - **src/components/contract/status-badge.tsx**: Create status badge
  - **src/pages/contract/contract-list.tsx**: Update to show status
- **Validation**:
  - [ ] Status is displayed correctly
  - [ ] Colors match status
  - [ ] Updates are reflected
  - [ ] Accessibility is implemented

## Dashboard and Polish

### Step 12a: Create Dashboard Page Structure
- **Task**: Create dashboard page layout
- **Reference**: See `frontend.mdc#page-structure` for dashboard layout
- **File Operations**:
  - **src/pages/dashboard/dashboard-page.tsx**: Create with sections
- **Validation**:
  - [ ] Layout is responsive
  - [ ] Components are properly organized
  - [ ] Loading states work
  - [ ] Error states are handled

### Step 12b: Add Vendor Summary to Dashboard
- **Task**: Add vendor count component
- **Reference**: See `frontend.mdc#components` for summary cards
- **File Operations**:
  - **src/components/dashboard/vendor-summary.tsx**: Create component
  - **src/pages/dashboard/dashboard-page.tsx**: Update to include summary
- **Validation**:
  - [ ] Data is fetched correctly
  - [ ] Numbers are accurate
  - [ ] Updates are reflected
  - [ ] Loading states work

### Step 12c: Add Contract Summary to Dashboard
- **Task**: Add contract statistics component
- **Reference**: See `frontend.mdc#components` for summary cards
- **File Operations**:
  - **src/components/dashboard/contract-summary.tsx**: Create component
  - **src/pages/dashboard/dashboard-page.tsx**: Update to include summary
- **Validation**:
  - [ ] Statistics are accurate
  - [ ] Updates are reflected
  - [ ] Loading states work
  - [ ] Error states are handled

## Form Validation and Error Handling

### Step 13a: Add Form Validation - Install Dependencies
- **Task**: Add Zod for validation
- **Reference**: See `frontend.mdc#form-implementation` for validation setup
- **User Instructions**: Run: `npm install zod react-hook-form @hookform/resolvers`
- **Validation**:
  - [ ] Dependencies install correctly
  - [ ] Types are available
  - [ ] Integration works
  - [ ] Example validation works

### Step 13b: Add Validation to Vendor Form
- **Task**: Add schema validation to vendor form
- **Reference**: See `frontend.mdc#form-implementation` for validation examples
- **File Operations**:
  - **src/schemas/vendor.schema.ts**: Create validation schema
  - **src/pages/vendor/vendor-form.tsx**: Update to use validation
- **Validation**:
  - [ ] Schema validates correctly
  - [ ] Error messages show properly
  - [ ] Form submission blocked on error
  - [ ] Custom validations work

### Step 13c: Add Validation to Contract Form
- **Task**: Add schema validation to contract form
- **Reference**: See `frontend.mdc#form-implementation` for validation examples
- **File Operations**:
  - **src/schemas/contract.schema.ts**: Create validation schema
  - **src/pages/contract/contract-form.tsx**: Update to use validation
- **Validation**:
  - [ ] Schema validates correctly
  - [ ] Error messages show properly
  - [ ] Form submission blocked on error
  - [ ] Date validations work

### Step 13d: Add Error Handling to API Calls
- **Task**: Add try/catch blocks to API functions
- **Reference**: See `backend.mdc#error-handling-guidelines` for implementation
- **File Operations**:
  - **src/lib/api/vendors.ts**: Update with error handling
  - **src/lib/api/contracts.ts**: Update with error handling
  - **src/lib/api/documents.ts**: Update with error handling
- **Validation**:
  - [ ] Errors are caught properly
  - [ ] Error messages are user-friendly
  - [ ] Error states are handled in UI
  - [ ] Console logging works

## Testing

### Step 14a: Setup Testing Framework
- **Task**: Add Vitest for testing
- **Reference**: See `general.mdc#testing` for testing guidelines
- **User Instructions**: Run: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom`
- **File Operations**:
  - **vitest.config.ts**: Create configuration file
  - **src/setup-tests.ts**: Create setup file
- **Validation**:
  - [ ] Test runner works
  - [ ] React Testing Library works
  - [ ] Jest DOM matchers work
  - [ ] Example test passes

### Step 14b: Write Auth Tests
- **Task**: Add tests for authentication
- **Reference**: See `general.mdc#testing` for test patterns
- **File Operations**:
  - **src/tests/auth/use-auth.test.tsx**: Create test file
- **Validation**:
  - [ ] Sign-in tests pass
  - [ ] Sign-up tests pass
  - [ ] Role tests pass
  - [ ] Error cases are tested

### Step 14c: Write Vendor Tests
- **Task**: Add tests for vendor functions
- **Reference**: See `general.mdc#testing` for test patterns
- **File Operations**:
  - **src/tests/vendor/vendors.test.tsx**: Create test file
- **Validation**:
  - [ ] CRUD operations are tested
  - [ ] List filtering works
  - [ ] Error cases are tested
  - [ ] UI components are tested

### Step 14d: Write Contract Tests
- **Task**: Add tests for contract functions
- **Reference**: See `general.mdc#testing` for test patterns
- **File Operations**:
  - **src/tests/contract/contracts.test.tsx**: Create test file
- **Validation**:
  - [ ] CRUD operations are tested
  - [ ] Status calculations work
  - [ ] Error cases are tested
  - [ ] UI components are tested

## Deployment

### Step 15a: Create Build Scripts
- **Task**: Configure build script
- **Reference**: See `general.mdc#deployment` for build configuration
- **File Operations**:
  - **package.json**: Update build scripts
- **Validation**:
  - [ ] Build completes successfully
  - [ ] Output is optimized
  - [ ] TypeScript checks pass
  - [ ] Assets are included

### Step 15b: Create README
- **Task**: Create documentation
- **Reference**: See `general.mdc` for project overview
- **File Operations**:
  - **README.md**: Create with setup instructions
- **Validation**:
  - [ ] Setup steps are clear
  - [ ] Environment setup is documented
  - [ ] Scripts are documented
  - [ ] Features are listed



## Important Notes for Using with Cursor AI

1. **Complete Implementation**
   - Each step must be fully implemented before moving to the next
   - All validation checks must pass
   - References to MDC files must be followed

2. **File Naming**
   - Use kebab-case for all file names
   - Follow the conventions in `general.mdc`
   - Maintain consistency across the project

3. **Testing and Validation**
   - Run tests after each step and fix any bugs
   - Verify all validation points
   - Check against MDC guidelines

4. **Documentation**
   - Keep inline documentation updated
   - Follow TypeScript documentation patterns
   - Maintain README with latest changes

5. **Error Handling**
   - Implement proper error boundaries
   - Add user-friendly error messages
   - Log errors appropriately

Remember: This is an academic project focused on demonstrating understanding of core concepts. Keep the implementation clean and focused on requirements.