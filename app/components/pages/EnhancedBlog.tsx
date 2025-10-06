"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Slide } from "../../animation/Slide";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  category: string;
  codeExamples?: CodeExample[];
  author: {
    name: string;
    avatar: string;
  };
  featured: boolean;
}

interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  runnable?: boolean;
  output?: string;
}

interface BlogFilters {
  search: string;
  category: string;
  tag: string;
  sortBy: 'newest' | 'oldest' | 'reading-time';
}

// Sample blog posts data
const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications with TypeScript',
    slug: 'scalable-react-typescript',
    excerpt: 'Learn advanced patterns for building maintainable React applications using TypeScript, including custom hooks, context patterns, and performance optimization.',
    content: `# Building Scalable React Applications with TypeScript

When building large-scale React applications, TypeScript provides invaluable type safety and developer experience improvements. In this post, we'll explore advanced patterns and best practices.

## Custom Hooks with Proper Typing

Custom hooks are a powerful way to encapsulate and reuse stateful logic. Here's how to create them with proper TypeScript typing:

\`\`\`typescript
// Custom hook for API data fetching
function useApiData<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
}
\`\`\`

## Context with TypeScript

Creating properly typed context providers is crucial for maintainable applications:

\`\`\`typescript
interface UserContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
\`\`\`

This approach ensures type safety and provides clear API contracts for your components.`,
    publishedAt: '2024-01-15',
    readingTime: 8,
    tags: ['React', 'TypeScript', 'Hooks', 'Architecture'],
    category: 'Frontend Development',
    featured: true,
    author: {
      name: 'Anudeep Adi',
      avatar: '/api/placeholder/40/40'
    },
    codeExamples: [
      {
        id: 'custom-hook',
        title: 'Custom API Hook',
        language: 'typescript',
        description: 'A reusable custom hook for API data fetching with proper TypeScript typing',
        code: `function useApiData<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`,
        runnable: false
      },
      {
        id: 'context-pattern',
        title: 'Typed Context Pattern',
        language: 'typescript',
        description: 'Creating a properly typed React context with custom hook',
        code: `interface UserContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}`,
        runnable: false
      }
    ]
  },
  {
    id: '2',
    title: 'Performance Optimization Techniques for Modern Web Apps',
    slug: 'web-performance-optimization',
    excerpt: 'Comprehensive guide to optimizing web application performance, covering Core Web Vitals, lazy loading, code splitting, and advanced caching strategies.',
    content: `# Performance Optimization Techniques for Modern Web Apps

Performance is crucial for user experience and SEO. Let's explore key optimization techniques for modern web applications.

## Core Web Vitals

Understanding and optimizing Core Web Vitals is essential:

- **Largest Contentful Paint (LCP)**: Measures loading performance
- **First Input Delay (FID)**: Measures interactivity
- **Cumulative Layout Shift (CLS)**: Measures visual stability

## Code Splitting and Lazy Loading

Implement dynamic imports for better performance:

\`\`\`javascript
// Route-level code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const Profile = lazy(() => import('./components/Profile'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
\`\`\`

## Image Optimization

Modern image optimization techniques:

\`\`\`javascript
// Next.js Image component with optimization
import Image from 'next/image';

function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      {...props}
    />
  );
}
\`\`\``,
    publishedAt: '2024-01-10',
    readingTime: 12,
    tags: ['Performance', 'Web Vitals', 'Optimization', 'JavaScript'],
    category: 'Performance',
    featured: true,
    author: {
      name: 'Anudeep Adi',
      avatar: '/api/placeholder/40/40'
    },
    codeExamples: [
      {
        id: 'code-splitting',
        title: 'Route-level Code Splitting',
        language: 'javascript',
        description: 'Implementing code splitting with React.lazy for better performance',
        code: `const Dashboard = lazy(() => import('./components/Dashboard'));
const Profile = lazy(() => import('./components/Profile'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}`,
        runnable: false
      },
      {
        id: 'intersection-observer',
        title: 'Lazy Loading with Intersection Observer',
        language: 'javascript',
        description: 'Custom hook for lazy loading using Intersection Observer API',
        code: `function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}`,
        runnable: true,
        output: 'Hook returns [ref, isVisible] - use ref on element to observe, isVisible becomes true when element enters viewport'
      }
    ]
  },
  {
    id: '3',
    title: 'Advanced Node.js Patterns and Best Practices',
    slug: 'nodejs-advanced-patterns',
    excerpt: 'Explore advanced Node.js patterns including error handling, middleware design, event-driven architecture, and microservices patterns.',
    content: `# Advanced Node.js Patterns and Best Practices

Node.js offers powerful patterns for building scalable backend applications. Let's explore advanced techniques and best practices.

## Error Handling Patterns

Proper error handling is crucial for robust applications:

\`\`\`javascript
// Centralized error handling middleware
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
\`\`\`

## Event-Driven Architecture

Implementing event-driven patterns:

\`\`\`javascript
const EventEmitter = require('events');

class OrderService extends EventEmitter {
  async createOrder(orderData) {
    try {
      const order = await Order.create(orderData);
      
      // Emit events for other services
      this.emit('order:created', order);
      this.emit('inventory:update', { 
        productId: order.productId, 
        quantity: order.quantity 
      });
      
      return order;
    } catch (error) {
      this.emit('order:failed', { orderData, error });
      throw error;
    }
  }
}

// Event listeners
orderService.on('order:created', async (order) => {
  await emailService.sendOrderConfirmation(order);
  await analyticsService.trackOrderCreated(order);
});

orderService.on('inventory:update', async (data) => {
  await inventoryService.updateStock(data);
});
\`\`\``,
    publishedAt: '2024-01-05',
    readingTime: 15,
    tags: ['Node.js', 'Backend', 'Architecture', 'Error Handling'],
    category: 'Backend Development',
    featured: false,
    author: {
      name: 'Anudeep Adi',
      avatar: '/api/placeholder/40/40'
    },
    codeExamples: [
      {
        id: 'error-handling',
        title: 'Centralized Error Handling',
        language: 'javascript',
        description: 'Custom error class and middleware for centralized error handling',
        code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};`,
        runnable: false
      },
      {
        id: 'event-driven',
        title: 'Event-Driven Service Pattern',
        language: 'javascript',
        description: 'Implementing event-driven architecture with EventEmitter',
        code: `const EventEmitter = require('events');

class OrderService extends EventEmitter {
  async createOrder(orderData) {
    try {
      const order = await Order.create(orderData);
      
      this.emit('order:created', order);
      this.emit('inventory:update', { 
        productId: order.productId, 
        quantity: order.quantity 
      });
      
      return order;
    } catch (error) {
      this.emit('order:failed', { orderData, error });
      throw error;
    }
  }
}

orderService.on('order:created', async (order) => {
  await emailService.sendOrderConfirmation(order);
  await analyticsService.trackOrderCreated(order);
});`,
        runnable: false
      }
    ]
  },
  {
    id: '4',
    title: 'Database Design Patterns and Optimization',
    slug: 'database-design-optimization',
    excerpt: 'Deep dive into database design patterns, indexing strategies, query optimization, and scaling techniques for modern applications.',
    content: `# Database Design Patterns and Optimization

Effective database design is fundamental to application performance and scalability. Let's explore key patterns and optimization techniques.

## Indexing Strategies

Proper indexing can dramatically improve query performance:

\`\`\`sql
-- Composite index for common query patterns
CREATE INDEX idx_user_activity ON user_activities(user_id, activity_date, activity_type);

-- Partial index for specific conditions
CREATE INDEX idx_active_users ON users(created_at) WHERE status = 'active';

-- Covering index to avoid table lookups
CREATE INDEX idx_order_summary ON orders(customer_id) INCLUDE (order_date, total_amount);
\`\`\`

## Query Optimization Techniques

Optimizing queries for better performance:

\`\`\`sql
-- Before: N+1 query problem
SELECT * FROM orders WHERE customer_id = ?;
-- For each order:
SELECT * FROM order_items WHERE order_id = ?;

-- After: Join query
SELECT o.*, oi.product_id, oi.quantity, oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.customer_id = ?;

-- Using CTEs for complex queries
WITH monthly_sales AS (
  SELECT 
    DATE_TRUNC('month', order_date) as month,
    SUM(total_amount) as total_sales
  FROM orders
  WHERE order_date >= '2024-01-01'
  GROUP BY DATE_TRUNC('month', order_date)
),
growth_calculation AS (
  SELECT 
    month,
    total_sales,
    LAG(total_sales) OVER (ORDER BY month) as prev_month_sales,
    (total_sales - LAG(total_sales) OVER (ORDER BY month)) / 
    LAG(total_sales) OVER (ORDER BY month) * 100 as growth_rate
  FROM monthly_sales
)
SELECT * FROM growth_calculation ORDER BY month;
\`\`\``,
    publishedAt: '2023-12-28',
    readingTime: 10,
    tags: ['Database', 'SQL', 'Optimization', 'Indexing'],
    category: 'Database',
    featured: false,
    author: {
      name: 'Anudeep Adi',
      avatar: '/api/placeholder/40/40'
    },
    codeExamples: [
      {
        id: 'indexing-strategies',
        title: 'Advanced Indexing Strategies',
        language: 'sql',
        description: 'Different types of indexes for various query patterns',
        code: `-- Composite index for common query patterns
CREATE INDEX idx_user_activity 
ON user_activities(user_id, activity_date, activity_type);

-- Partial index for specific conditions
CREATE INDEX idx_active_users 
ON users(created_at) 
WHERE status = 'active';

-- Covering index to avoid table lookups
CREATE INDEX idx_order_summary 
ON orders(customer_id) 
INCLUDE (order_date, total_amount);`,
        runnable: false
      },
      {
        id: 'cte-optimization',
        title: 'CTE for Complex Queries',
        language: 'sql',
        description: 'Using Common Table Expressions for readable and efficient queries',
        code: `WITH monthly_sales AS (
  SELECT 
    DATE_TRUNC('month', order_date) as month,
    SUM(total_amount) as total_sales
  FROM orders
  WHERE order_date >= '2024-01-01'
  GROUP BY DATE_TRUNC('month', order_date)
),
growth_calculation AS (
  SELECT 
    month,
    total_sales,
    LAG(total_sales) OVER (ORDER BY month) as prev_month_sales,
    (total_sales - LAG(total_sales) OVER (ORDER BY month)) / 
    LAG(total_sales) OVER (ORDER BY month) * 100 as growth_rate
  FROM monthly_sales
)
SELECT * FROM growth_calculation ORDER BY month;`,
        runnable: false
      }
    ]
  }
];

const CATEGORIES = ['All', 'Frontend Development', 'Backend Development', 'Performance', 'Database'];
const POPULAR_TAGS = ['React', 'TypeScript', 'Node.js', 'Performance', 'Database', 'JavaScript', 'SQL'];

export default function EnhancedBlog() {
  const [posts] = useState<BlogPost[]>(SAMPLE_BLOG_POSTS);
  const [filters, setFilters] = useState<BlogFilters>({
    search: '',
    category: 'All',
    tag: '',
    sortBy: 'newest'
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [expandedCodeExample, setExpandedCodeExample] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate reading progress
  useEffect(() => {
    if (!selectedPost || !contentRef.current) return;

    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      const scrollTop = window.scrollY;
      const docHeight = element.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const progress = Math.min(100, Math.max(0, scrollPercent * 100));

      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPost]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(filters.search.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = filters.category === 'All' || post.category === filters.category;
      const matchesTag = !filters.tag || post.tags.includes(filters.tag);

      return matchesSearch && matchesCategory && matchesTag;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'reading-time':
          return a.readingTime - b.readingTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, filters]);

  const featuredPosts = posts.filter(post => post.featured);

  // Syntax highlighting for code blocks (simplified)
  const highlightCode = (code: string, language: string) => {
    // In a real implementation, you'd use a library like Prism.js or highlight.js
    return code;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (selectedPost) {
    return (
      <section id="blog-section" className="mt-32 max-w-4xl mx-auto">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-200 dark:bg-zinc-700">
          <div 
            className="h-full bg-primary-color transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Back Button */}
        <Slide delay={0.1}>
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 flex items-center gap-2 text-primary-color hover:text-secondary-color transition-colors"
          >
            <span>←</span>
            <span>Back to Blog</span>
          </button>
        </Slide>

        {/* Article Content */}
        <div ref={contentRef}>
          <Slide delay={0.2}>
            <article className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-8">
              {/* Article Header */}
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
                  {selectedPost.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-color rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {selectedPost.author.name.charAt(0)}
                    </div>
                    <span>{selectedPost.author.name}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(selectedPost.publishedAt)}</span>
                  <span>•</span>
                  <span>{selectedPost.readingTime} min read</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-primary-color bg-opacity-10 text-primary-color rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* Article Body */}
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>

              {/* Interactive Code Examples */}
              {selectedPost.codeExamples && selectedPost.codeExamples.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
                    Interactive Code Examples
                  </h2>
                  
                  <div className="space-y-6">
                    {selectedPost.codeExamples.map(example => (
                      <div key={example.id} className="border dark:border-zinc-700 border-zinc-200 rounded-lg overflow-hidden">
                        <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border-b dark:border-zinc-700 border-zinc-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {example.title}
                              </h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                {example.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded">
                                {example.language}
                              </span>
                              {example.runnable && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                                  Runnable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <pre className="bg-zinc-900 text-zinc-100 p-4 overflow-x-auto text-sm">
                            <code>{highlightCode(example.code, example.language)}</code>
                          </pre>
                          
                          <button
                            onClick={() => navigator.clipboard.writeText(example.code)}
                            className="absolute top-2 right-2 p-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded text-xs transition-colors"
                          >
                            Copy
                          </button>
                        </div>

                        {example.output && (
                          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border-t dark:border-zinc-700 border-zinc-200">
                            <div className="text-sm">
                              <span className="font-medium text-zinc-700 dark:text-zinc-300">Output:</span>
                              <pre className="mt-2 text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                                {example.output}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </Slide>
        </div>
      </section>
    );
  }

  return (
    <section id="blog-section" className="mt-32 max-w-7xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Developer Blog
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-4xl">
            In-depth articles about software development, featuring interactive code examples, 
            advanced patterns, and real-world solutions with live demonstrations.
          </p>
        </div>
      </Slide>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Slide delay={0.25}>
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Featured Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map(post => (
                <article 
                  key={post.id}
                  className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                      Featured
                    </span>
                    <span className="text-xs text-zinc-500">{post.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100 hover:text-primary-color transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {post.readingTime} min read
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Slide>
      )}

      {/* Filters */}
      <Slide delay={0.35}>
        <div className="mb-8">
          <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Search & Filter
            </h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <select
                  value={filters.tag}
                  onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">All Tags</option>
                  {POPULAR_TAGS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as BlogFilters['sortBy'] }))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="reading-time">Reading Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Blog Posts Grid */}
      <Slide delay={0.45}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              All Articles ({filteredPosts.length})
            </h3>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                No articles found
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map(post => (
                <article 
                  key={post.id}
                  className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-zinc-500">{post.category}</span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500">{formatDate(post.publishedAt)}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100 hover:text-primary-color transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span>{post.readingTime} min read</span>
                          {post.codeExamples && post.codeExamples.length > 0 && (
                            <span className="flex items-center gap-1">
                              <span>💻</span>
                              <span>{post.codeExamples.length} examples</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Slide>
    </section>
  );
}