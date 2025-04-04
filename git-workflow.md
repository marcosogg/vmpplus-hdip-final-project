# VMP PLUS Git Workflow

## Branch Structure
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release preparation branches

## Branch Naming Convention
- Feature branches: `feature/step-{number}-{brief-description}`
  Example: `feature/step-1a-vite-setup`
- Bug fix branches: `bugfix/{issue-number}-{brief-description}`
- Release branches: `release/v{version-number}`

## When to Create Branches

### Feature Branches
Create a new feature branch for each implementation step from implementation-steps.md:
1. Major setup steps (Step 1a, 1b, etc.)
2. New feature implementations (Step 7a-7f for Vendor Management, etc.)
3. Significant changes to existing features

### Commit Guidelines
- Make atomic commits (one logical change per commit)
- Use descriptive commit messages following this format:
  ```
  feat(scope): brief description

  - Detailed bullet points of changes
  - Additional context if needed
  ```

Example commit messages:
- `feat(setup): initialize Vite with React and TypeScript`
- `feat(auth): implement user authentication components`
- `fix(vendor): resolve form validation issues`

## Implementation Steps and Git Integration

### For Each Implementation Step:
1. Create feature branch:
   ```bash
   git checkout -b feature/step-{number}-{description}
   ```

2. Make changes and commit regularly:
   - After each subtask is completed
   - When reaching a stable point
   - Before switching tasks

3. Push changes:
   ```bash
   git push origin feature/step-{number}-{description}
   ```

4. Create Pull Request when feature is complete

### Merging Process
1. Ensure all tests pass
2. Code review (if applicable)
3. Merge into develop branch
4. Delete feature branch after successful merge

## Quick Reference Commands

### Starting New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/step-X-description
```

### Regular Commits
```bash
git add .
git commit -m "feat(scope): description"
```

### Finishing Feature
```bash
git push origin feature/step-X-description
# Create PR through GitHub interface
```

### Emergency Bug Fix
```bash
git checkout -b bugfix/issue-description
# Fix the issue
git commit -m "fix: description"
git push origin bugfix/issue-description
```

## Implementation Steps - Git Checkpoints

Based on implementation-steps.md, here are the key points where new feature branches should be created:

1. Project Setup (Steps 1a-3c)
   - Branch: `feature/step-1-project-setup`

2. Supabase Integration (Steps 4a-4c)
   - Branch: `feature/step-4-supabase-setup`

3. Authentication (Steps 5a-6c)
   - Branch: `feature/step-5-authentication`

4. Vendor Management (Steps 7a-8b)
   - Branch: `feature/step-7-vendor-management`

5. Document Management (Steps 9a-9e)
   - Branch: `feature/step-9-document-management`

6. Contract Management (Steps 10a-11b)
   - Branch: `feature/step-10-contract-management`

7. Dashboard and Polish (Steps 12a-12c)
   - Branch: `feature/step-12-dashboard`

8. Form Validation (Steps 13a-13d)
   - Branch: `feature/step-13-form-validation`

9. Testing (Steps 14a-14d)
   - Branch: `feature/step-14-testing`

10. Deployment (Steps 15a-15b)
    - Branch: `feature/step-15-deployment` 