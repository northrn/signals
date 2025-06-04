# Agents Development Guide

## Project Overview

This is a **Next.js 15.1.8** application built with:
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **App Router** (Next.js 13+ routing system)
- **React 19** for the frontend framework
- **ESLint** for code quality
- **Turbopack** for fast development builds

## Tech Stack Details

### Core Dependencies
- `next@15.1.8` - React framework
- `react@^19.0.0` - React library
- `typescript@^5` - Type checking
- `tailwindcss@^3.4.1` - Utility-first CSS framework

### Development Tools
- ESLint with Next.js configuration
- PostCSS for CSS processing
- Turbopack for fast development builds

## Project Structure

```
signals/
├── src/
│   └── app/                 # App Router directory (Next.js 13+)
│       ├── layout.tsx       # Root layout component
│       ├── page.tsx         # Homepage component
│       ├── globals.css      # Global styles with Tailwind directives
│       └── favicon.ico      # Site favicon
├── public/                  # Static assets
│   ├── *.svg               # SVG icons and images
│   └── ...
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── eslint.config.mjs       # ESLint configuration
└── postcss.config.mjs      # PostCSS configuration
```

## Development Workflow

### Starting Development Server
```bash
npm run dev
```
- Runs on `http://localhost:3000`
- Uses Turbopack for fast hot reloading
- TypeScript compilation happens automatically

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Coding Standards

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)

### Directory Structure Rules
- Use `src/app/` for all application code (App Router)
- Create route segments using folders (e.g., `src/app/about/page.tsx`)
- Place shared components in `src/components/`
- Place utilities in `src/utils/`
- Place types in `src/types/`

### TypeScript Guidelines
1. **Always use TypeScript** - No `.js` or `.jsx` files
2. **Define interfaces** for props and data structures
3. **Use `type` for unions and primitives**, `interface` for objects
4. **Export types** from dedicated type files when shared
5. **Use strict mode** (already configured)

```typescript
// Good: Component with proper typing
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onSelect?: (userId: string) => void;
}

export default function UserCard({ user, onSelect }: UserCardProps) {
  // Component logic
}
```

### Component Structure
```typescript
import type { ComponentNameProps } from '@/types/component-types';
import { useState, useEffect } from 'react';

interface ComponentNameProps {
  // Define props here
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // State and hooks
  const [state, setState] = useState<string>('');
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="flex items-center justify-between">
      {/* Component JSX */}
    </div>
  );
}
```

## Styling with Tailwind CSS

### Tailwind Configuration
- Custom colors defined in `tailwind.config.ts`
- CSS variables for dynamic theming: `--background`, `--foreground`
- Responsive design with mobile-first approach

### Styling Best Practices
1. **Use Tailwind utility classes** instead of custom CSS
2. **Apply responsive design** with `sm:`, `md:`, `lg:`, `xl:` prefixes
3. **Use semantic color variables** (`bg-background`, `text-foreground`)
4. **Group related classes** logically in className strings
5. **Use CSS variables** for theme consistency

```typescript
// Good: Semantic classes with responsive design
<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
  <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    {/* Content */}
  </main>
</div>
```

### Dark Mode Support
- Use `dark:` prefix for dark mode styles
- Leverage CSS variables defined in `globals.css`
- Test both light and dark themes

## App Router Patterns

### Page Creation
- Create `page.tsx` in route folders: `src/app/about/page.tsx`
- Export default React component
- Use TypeScript with proper props typing

### Layout Components
- `layout.tsx` files apply to route segments
- Root layout in `src/app/layout.tsx` wraps entire app
- Nested layouts for route groups

### Route Organization
```
src/app/
├── page.tsx                 # Homepage (/)
├── layout.tsx              # Root layout
├── about/
│   └── page.tsx            # About page (/about)
├── dashboard/
│   ├── layout.tsx          # Dashboard layout
│   ├── page.tsx            # Dashboard home (/dashboard)
│   └── settings/
│       └── page.tsx        # Dashboard settings (/dashboard/settings)
```

### Metadata Handling
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

## Import Patterns

### Path Aliases
- Use `@/*` for imports from `src/` directory
- Configured in `tsconfig.json` paths

```typescript
// Good: Use path aliases
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types/user';

// Avoid: Relative imports for shared code
import { Button } from '../../../components/ui/Button';
```

### Import Order
1. React and Next.js imports
2. Third-party libraries
3. Internal components and utilities
4. Type imports (use `import type`)

## Performance Considerations

### Image Optimization
- Use `next/image` component for all images
- Provide `width`, `height`, and `alt` attributes
- Use `priority` for above-the-fold images

```typescript
import Image from 'next/image';

<Image
  src="/logo.svg"
  alt="Company logo"
  width={180}
  height={38}
  priority
  className="dark:invert"
/>
```

### Font Optimization
- Use `next/font` for Google Fonts (already configured with Geist)
- Apply font variables via CSS classes

## Error Handling

### Error Boundaries
- Create `error.tsx` files for route-level error handling
- Use `not-found.tsx` for 404 pages
- Handle loading states with `loading.tsx`

### TypeScript Error Prevention
- Enable strict mode (already configured)
- Use proper typing for all function parameters
- Validate props with interfaces

## Code Quality

### ESLint Rules
- Follow Next.js ESLint configuration
- Run `npm run lint` before committing
- Address all ESLint warnings and errors

### Best Practices
1. **Keep components small** and focused on single responsibility
2. **Extract custom hooks** for reusable logic
3. **Use meaningful variable names** and comments
4. **Handle loading and error states** appropriately
5. **Optimize for accessibility** with proper ARIA attributes

## Environment Setup

### Development Requirements
- Node.js 18+ required
- Package manager: npm (lockfile: `package-lock.json`)

### Environment Variables
- Create `.env.local` for local development secrets
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Never commit secrets to version control

## Common Patterns

### Client Components
```typescript
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Server Components (Default)
```typescript
// No 'use client' directive needed
export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  
  return <div>{/* Render data */}</div>;
}
```

### API Routes
```typescript
// src/app/api/users/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET request
  return Response.json({ data: 'example' });
}

export async function POST(request: NextRequest) {
  // Handle POST request
  const body = await request.json();
  return Response.json({ success: true });
}
```

## Testing Strategy

### Recommended Testing Stack
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Playwright** or **Cypress** for E2E testing

### Testing Files
- Place test files adjacent to components: `Button.test.tsx`
- Use `__tests__` folders for grouped tests
- Mock API calls and external dependencies

## Deployment

### Build Process
```bash
npm run build
npm run start
```

### Static Export (if needed)
- Configure `next.config.ts` for static export
- Use `output: 'export'` for static hosting

### Vercel Deployment
- Optimized for Vercel deployment
- Automatic builds from Git commits
- Environment variables in Vercel dashboard

## Troubleshooting

### Common Issues
1. **TypeScript errors**: Check `tsconfig.json` and import paths
2. **Tailwind styles not applying**: Verify `tailwind.config.ts` content paths
3. **Hot reload issues**: Restart development server
4. **Build failures**: Check for TypeScript errors and unused imports

### Debug Commands
```bash
# Type checking
npx tsc --noEmit

# Lint checking
npm run lint

# Build verification
npm run build
```

## Contributing Guidelines

### Before Making Changes
1. Pull latest changes from main branch
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Make incremental, focused changes

### Code Review Checklist
- [ ] TypeScript compilation passes
- [ ] ESLint passes without warnings
- [ ] Components are properly typed
- [ ] Responsive design works on mobile and desktop
- [ ] Dark mode compatibility maintained
- [ ] Performance considerations addressed
- [ ] Accessibility standards followed

---

**Note**: This project uses the latest Next.js App Router pattern. Always refer to the [Next.js documentation](https://nextjs.org/docs) for the most up-to-date patterns and best practices.
