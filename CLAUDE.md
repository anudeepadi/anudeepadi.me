# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio website built with Next.js 14 App Router, Sanity CMS, and TypeScript. Features a modern design with dark mode, blog, project showcase, interactive data visualizations, and command palette navigation.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production (includes linting before build)
npm run build

# Start production server
npm start
```

Note: The build command runs `next lint && next build`, so linting errors must be resolved before production builds complete successfully.

## Architecture

### App Structure

This is a Next.js 14 project using the App Router architecture:

- **`/app`**: App Router directory containing pages and layouts
  - **`/components`**: React components organized by scope
    - `/global`: Site-wide components (Navbar, Footer, CommandPalette)
    - `/pages`: Page-specific feature components (DataDashboard, CodePlayground, etc.)
    - `/shared`: Reusable UI components (CustomPortableText, CodeBlock, etc.)
    - `/widgets`: Small interactive widgets
  - **`/utils`**: Client-side utilities and helper functions
  - **`/styles`**: Global CSS and styling
  - **`/api`**: API routes
  - Page routes: `/about`, `/blog`, `/projects`, `/photos`, `/animation`, etc.

### Content Management with Sanity

The project uses Sanity CMS for content management with a custom studio embedded at `/studio`:

- **`/schemas`**: Sanity schema definitions (post.ts, project.ts, profile.ts, job.ts, etc.)
- **`/lib`**: Sanity client configuration and data fetching utilities
  - `sanity.client.ts`: Server-only Sanity client with custom `sanityFetch` wrapper
  - `sanity.query.ts`: GROQ query definitions for posts, projects, profile, jobs
  - `sanity.image.ts`: Image URL builder configuration
  - `env.api.ts`: Environment variable validation and configuration
- **`/sanity`**: Sanity studio configuration files

Access Sanity Studio at `/studio` route when running the dev server.

### Data Fetching Pattern

All Sanity data fetching uses the `sanityFetch` wrapper from `lib/sanity.client.ts`:

```typescript
import { sanityFetch } from "@/lib/sanity.client.ts";
import { profileQuery } from "@/lib/sanity.query.ts";

const profile = await sanityFetch<ProfileType[]>({
  query: profileQuery,
  tags: ["profile"],
});
```

- Uses server-side rendering by default
- Implements cache tags for revalidation
- Development mode: `cache: "no-store"` for fresh data
- Production mode: `cache: "force-cache"` for performance

### TypeScript Types

Core types are defined in `/types/index.ts`:
- `ProfileType`: User profile data from Sanity
- `JobType`: Work experience entries
- `ProjectType`: Portfolio projects
- `PostType`: Blog posts with author and metadata
- `HeroeType`: Personal heroes/inspirations

### Theming & Styling

- **TailwindCSS**: Primary styling framework
- **next-themes**: Dark/light mode switching
- **Framer Motion**: Animations and transitions
- Custom fonts loaded via `/app/assets/font/font.ts`
- Global styles in `/app/styles/globals.css`

### Key Features

1. **Command Palette** (`/app/components/global/CommandPalette.tsx`): Keyboard-driven navigation (Cmd+K / Ctrl+K)
2. **Interactive Components**: DataDashboard, CodePlayground, AlgorithmVisualizer, ArchitectureShowcase
3. **Blog System**: Full-featured blog with Portable Text rendering, code syntax highlighting, and Giscus comments
4. **Custom Portable Text**: Rich content rendering with custom components for code blocks, images, tables, YouTube embeds

### Environment Variables

Required variables (see `/lib/env.api.ts` for validation):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-11-26
NEXT_PUBLIC_SANITY_ACCESS_TOKEN=your_token (optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_id (optional)
```

Giscus configuration is hardcoded in `lib/env.api.ts` for the comments system.

### Image Handling

Next.js Image component is configured to allow images from:
- `cdn.sanity.io` (Sanity CDN)
- `icons.duckduckgo.com`
- `res.cloudinary.com`
- `www.google.com`
- `images.unsplash.com`

See `next.config.js` for the complete configuration.

### Important Notes

- **Server Components by Default**: Most components are React Server Components; use `'use client'` directive when needed for interactivity
- **Path Aliases**: Use `@/*` to import from the root directory (configured in `tsconfig.json`)
- **Build Configuration**: TypeScript and ESLint errors are ignored in production builds (`process.env.VERCEL_ENV === 'production'`)
- **Sanity Client**: Always use `sanityFetch` wrapper instead of direct Sanity client calls to ensure proper caching and tag management
