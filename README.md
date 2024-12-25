# Personal Portfolio Website

## Overview
My personal portfolio website built with Next.js 14, Sanity CMS, and TypeScript. Features a modern, responsive design with dark mode support and dynamic content management.

## 🚀 Features

### Core Functionality
- Responsive design
- Dark/Light mode
- Blog with Sanity CMS integration
- Dynamic portfolio projects
- GitHub activity calendar
- Comments system with Giscus
- Performance optimized
- SEO friendly

### Technical Features
- Server-Side Rendering (SSR)
- Image optimization with Sharp
- Analytics integration
- TypeScript support
- Styled with TailwindCSS
- Animated transitions
- Code syntax highlighting

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- Framer Motion
- React Icons
- React GitHub Calendar

### Content Management
- Sanity.io
- Portable Text
- Sanity Image URL
- Code Input Support
- Table Support

### Development Tools
- ESLint
- Sharp for images
- Vercel Analytics
- Next Themes
- Styled Components

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Sanity account

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/anudeepadi/anudeepadi.me.git
cd anudeepadi.me
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your_sanity_token
NEXT_PUBLIC_WEBSITE_URL=your_website_url
```

4. Start development server:
```bash
npm run dev
# or
yarn dev
```

## 🔧 Configuration

### Sanity Studio Setup
```bash
# Navigate to Sanity studio directory
cd studio

# Install dependencies
npm install

# Start Sanity studio
npm run dev
```

### Blog Configuration
```typescript
// Configure blog settings in config/blog.ts
export const blogConfig = {
  postsPerPage: 6,
  featuredPosts: 3,
  categoriesShown: 5
};
```

## 📝 Content Management

### Blog Posts
- Create and edit posts in Sanity Studio
- Support for code blocks
- Image optimization
- Table support
- Custom components

### Portfolio Projects
- Manage projects through Sanity
- Add images and descriptions
- Link to live demos and repositories
- Tag with technologies used

## 🚀 Deployment

### Vercel Deployment
The site is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anudeepadi/anudeepadi.me)

### Build Commands
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Customization

### Theme Configuration
```typescript
// Customize theme in styles/theme.ts
const theme = {
  colors: {
    primary: '#...',
    secondary: '#...',
    // ...
  },
  // ...
};
```

### Component Styling
- TailwindCSS utility classes
- Styled Components support
- Custom CSS modules
- Framer Motion animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- Next.js team
- Sanity.io
- Vercel platform
- Open source community

## 📞 Contact
- Website: [anudeepadi.me](https://anudeepadi.me)
- GitHub: [@anudeepadi](https://github.com/anudeepadi)
- LinkedIn: [Anudeep Adiraju](https://linkedin.com/in/adirajuadi)

## 📊 Analytics
Site analytics are handled by Vercel Analytics for privacy-focused tracking of user interactions and performance metrics.

---

Built with ❤️ by Anudeep Adiraju
