# Frontend Installation Fix

## Problem
`ngx-charts@20.x` requires Angular 21/22, but the project uses Angular 19, causing a dependency conflict.

## Solution Options

### Option 1: Use --legacy-peer-deps (Recommended - Quick Fix)

Run this command instead:

```bash
npm install --legacy-peer-deps
```

This will install dependencies while ignoring peer dependency conflicts. The application should work fine even with the version mismatch warning.

### Option 2: Remove ngx-charts Temporarily

If you don't need charts right now, you can remove it:

1. Edit `package.json` and remove this line:
   ```json
   "@swimlane/ngx-charts": "^20.0.0",
   ```

2. Then run:
   ```bash
   npm install
   ```

3. You can add it back later when you implement analytics features.

### Option 3: Clean Install

If Option 1 doesn't work, try a clean install:

```bash
# Delete node_modules and lock file
rmdir /s /q node_modules
del package-lock.json

# Install with legacy peer deps
npm install --legacy-peer-deps
```

---

## Recommended: Use Option 1

Just run:
```bash
npm install --legacy-peer-deps
```

This is the quickest solution and won't affect functionality.
