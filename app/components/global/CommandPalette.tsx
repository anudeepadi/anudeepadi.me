"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Slide } from "../../animation/Slide";

interface Command {
  id: string;
  title: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'Theme' | 'Contact' | 'Search';
  icon: string;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for projects and blog posts (in real app, this would come from your CMS)
const mockProjects = [
  { title: "Geothermal Resource Calculator", slug: "geothermal-calc", description: "Interactive energy simulation" },
  { title: "Data Visualization Dashboard", slug: "data-dashboard", description: "Real-time monitoring system" },
  { title: "Portfolio Website", slug: "portfolio", description: "Personal showcase platform" },
  { title: "E-commerce Platform", slug: "ecommerce", description: "Full-stack shopping solution" },
];

const mockBlogPosts = [
  { title: "Building Interactive Data Visualizations", slug: "data-viz-guide", description: "Complete guide to charts and dashboards" },
  { title: "Next.js 14 Performance Optimization", slug: "nextjs-performance", description: "Advanced techniques for faster apps" },
  { title: "TypeScript Best Practices", slug: "typescript-guide", description: "Professional development patterns" },
  { title: "Responsive Design Patterns", slug: "responsive-design", description: "Modern CSS layout techniques" },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Load recent commands from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('commandPalette-recent');
    if (saved) {
      setRecentCommands(JSON.parse(saved));
    }
  }, []);

  // Save recent commands to localStorage
  const saveRecentCommand = useCallback((commandId: string) => {
    const updated = [commandId, ...recentCommands.filter(id => id !== commandId)].slice(0, 5);
    setRecentCommands(updated);
    localStorage.setItem('commandPalette-recent', JSON.stringify(updated));
  }, [recentCommands]);

  // Navigate and close palette
  const navigateTo = useCallback((path: string) => {
    router.push(path);
    onClose();
  }, [router, onClose]);

  // Copy to clipboard helper
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    onClose();
  }, [onClose]);

  // Open external link
  const openLink = useCallback((url: string) => {
    window.open(url, '_blank');
    onClose();
  }, [onClose]);

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  }, [onClose]);

  // Define all available commands
  const allCommands: Command[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-home',
      title: 'Go to Home',
      description: 'Navigate to the homepage',
      category: 'Navigation',
      icon: '🏠',
      action: () => navigateTo('/'),
      keywords: ['home', 'index', 'main', 'landing']
    },
    {
      id: 'nav-about',
      title: 'Go to About',
      description: 'Learn more about me',
      category: 'Navigation',
      icon: '👤',
      action: () => navigateTo('/about'),
      keywords: ['about', 'bio', 'profile', 'info']
    },
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      description: 'View my portfolio projects',
      category: 'Navigation',
      icon: '💼',
      action: () => navigateTo('/projects'),
      keywords: ['projects', 'portfolio', 'work', 'showcase']
    },
    {
      id: 'nav-blog',
      title: 'Go to Blog',
      description: 'Read my latest posts',
      category: 'Navigation',
      icon: '📝',
      action: () => navigateTo('/blog'),
      keywords: ['blog', 'posts', 'articles', 'writing']
    },
    {
      id: 'nav-photos',
      title: 'Go to Photos',
      description: 'Browse photo gallery',
      category: 'Navigation',
      icon: '📸',
      action: () => navigateTo('/photos'),
      keywords: ['photos', 'gallery', 'images', 'pictures']
    },

    // Section Navigation
    {
      id: 'scroll-simulation',
      title: 'Jump to Simulation',
      description: 'Scroll to geothermal simulation section',
      category: 'Navigation',
      icon: '⚡',
      action: () => scrollToSection('simulation-section'),
      keywords: ['simulation', 'geothermal', 'calculator', 'demo']
    },
    {
      id: 'scroll-playground',
      title: 'Jump to Code Playground',
      description: 'Scroll to interactive code playground',
      category: 'Navigation',
      icon: '💻',
      action: () => scrollToSection('playground-section'),
      keywords: ['playground', 'code', 'editor', 'monaco']
    },
    {
      id: 'scroll-algorithms',
      title: 'Jump to Algorithm Visualizer',
      description: 'Scroll to algorithm visualization section',
      category: 'Navigation',
      icon: '🧮',
      action: () => scrollToSection('algorithm-section'),
      keywords: ['algorithms', 'sorting', 'visualization', 'computer science']
    },
    {
      id: 'scroll-analysis',
      title: 'Jump to Data Analysis Tool',
      description: 'Scroll to data analysis and visualization section',
      category: 'Navigation',
      icon: '📊',
      action: () => scrollToSection('analysis-section'),
      keywords: ['analysis', 'data', 'csv', 'statistics', 'insights']
    },
    {
      id: 'scroll-architecture',
      title: 'Jump to Architecture Showcase',
      description: 'Scroll to project architecture and system design section',
      category: 'Navigation',
      icon: '🏗️',
      action: () => scrollToSection('architecture-section'),
      keywords: ['architecture', 'system', 'design', 'infrastructure', 'microservices']
    },
    {
      id: 'scroll-blog',
      title: 'Jump to Enhanced Blog',
      description: 'Scroll to interactive developer blog section',
      category: 'Navigation',
      icon: '📝',
      action: () => scrollToSection('blog-section'),
      keywords: ['blog', 'articles', 'tutorials', 'code examples', 'writing']
    },
    {
      id: 'scroll-dashboard',
      title: 'Jump to Dashboard',
      description: 'Scroll to data visualization dashboard',
      category: 'Navigation',
      icon: '📊',
      action: () => scrollToSection('dashboard-section'),
      keywords: ['dashboard', 'charts', 'data', 'visualization']
    },
    {
      id: 'scroll-experience',
      title: 'Jump to Experience',
      description: 'Scroll to work experience section',
      category: 'Navigation',
      icon: '💼',
      action: () => scrollToSection('experience-section'),
      keywords: ['experience', 'work', 'jobs', 'career']
    },

    // Theme Commands
    {
      id: 'theme-light',
      title: 'Switch to Light Theme',
      description: 'Change to light mode',
      category: 'Theme',
      icon: '☀️',
      action: () => { setTheme('light'); onClose(); },
      keywords: ['light', 'theme', 'bright', 'day']
    },
    {
      id: 'theme-dark',
      title: 'Switch to Dark Theme',
      description: 'Change to dark mode',
      category: 'Theme',
      icon: '🌙',
      action: () => { setTheme('dark'); onClose(); },
      keywords: ['dark', 'theme', 'night', 'black']
    },
    {
      id: 'theme-system',
      title: 'Use System Theme',
      description: 'Follow system preference',
      category: 'Theme',
      icon: '💻',
      action: () => { setTheme('system'); onClose(); },
      keywords: ['system', 'auto', 'default', 'preference']
    },

    // Contact Commands
    {
      id: 'contact-email',
      title: 'Copy Email Address',
      description: 'Copy email to clipboard',
      category: 'Contact',
      icon: '📧',
      action: () => copyToClipboard('your.email@example.com'),
      keywords: ['email', 'contact', 'mail', 'copy']
    },
    {
      id: 'contact-github',
      title: 'Open GitHub Profile',
      description: 'Visit my GitHub profile',
      category: 'Contact',
      icon: '🐙',
      action: () => openLink('https://github.com/anudeepadi'),
      keywords: ['github', 'code', 'repositories', 'profile']
    },
    {
      id: 'contact-linkedin',
      title: 'Open LinkedIn Profile',
      description: 'Connect on LinkedIn',
      category: 'Contact',
      icon: '💼',
      action: () => openLink('https://linkedin.com/in/adirajuadi'),
      keywords: ['linkedin', 'professional', 'network', 'connect']
    },
    {
      id: 'contact-twitter',
      title: 'Open Twitter Profile',
      description: 'Follow me on Twitter',
      category: 'Contact',
      icon: '🐦',
      action: () => openLink('https://twitter.com/anudeepadi'),
      keywords: ['twitter', 'social', 'follow', 'updates']
    },

    // Actions
    {
      id: 'action-reload',
      title: 'Reload Page',
      description: 'Refresh the current page',
      category: 'Actions',
      icon: '🔄',
      action: () => { window.location.reload(); },
      keywords: ['reload', 'refresh', 'restart', 'update']
    },
    {
      id: 'action-print',
      title: 'Print Page',
      description: 'Print the current page',
      category: 'Actions',
      icon: '🖨️',
      action: () => { window.print(); onClose(); },
      keywords: ['print', 'pdf', 'save', 'document']
    },
    {
      id: 'action-fullscreen',
      title: 'Toggle Fullscreen',
      description: 'Enter or exit fullscreen mode',
      category: 'Actions',
      icon: '⛶',
      action: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        onClose();
      },
      keywords: ['fullscreen', 'full', 'screen', 'expand']
    },

    // Project Search
    ...mockProjects.map(project => ({
      id: `project-${project.slug}`,
      title: `Project: ${project.title}`,
      description: project.description,
      category: 'Search' as const,
      icon: '🚀',
      action: () => navigateTo(`/projects/${project.slug}`),
      keywords: [project.title.toLowerCase(), project.description.toLowerCase(), 'project']
    })),

    // Blog Search
    ...mockBlogPosts.map(post => ({
      id: `blog-${post.slug}`,
      title: `Blog: ${post.title}`,
      description: post.description,
      category: 'Search' as const,
      icon: '📖',
      action: () => navigateTo(`/blog/${post.slug}`),
      keywords: [post.title.toLowerCase(), post.description.toLowerCase(), 'blog', 'article']
    }))
  ], [navigateTo, setTheme, onClose, copyToClipboard, openLink, scrollToSection]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Show recent commands first, then popular commands
      const recentCommandObjects = recentCommands
        .map(id => allCommands.find(cmd => cmd.id === id))
        .filter(Boolean) as Command[];
      
      const popularCommands = allCommands
        .filter(cmd => !recentCommands.includes(cmd.id))
        .filter(cmd => ['nav-home', 'nav-projects', 'nav-blog', 'theme-dark', 'theme-light'].includes(cmd.id));

      return [...recentCommandObjects, ...popularCommands].slice(0, 8);
    }

    const queryLower = query.toLowerCase();
    return allCommands
      .filter(command => 
        command.title.toLowerCase().includes(queryLower) ||
        command.description.toLowerCase().includes(queryLower) ||
        command.keywords.some(keyword => keyword.includes(queryLower))
      )
      .sort((a, b) => {
        // Prioritize title matches over description matches
        const aTitle = a.title.toLowerCase().includes(queryLower);
        const bTitle = b.title.toLowerCase().includes(queryLower);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      })
      .slice(0, 10);
  }, [query, allCommands, recentCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          const selectedCommand = filteredCommands[selectedIndex];
          if (selectedCommand) {
            saveRecentCommand(selectedCommand.id);
            selectedCommand.action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose, saveRecentCommand]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset query when opening
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black bg-opacity-50 backdrop-blur-sm">
      <Slide delay={0}>
        <div className="w-full max-w-2xl mx-4 bg-white dark:bg-zinc-900 border dark:border-zinc-700 border-zinc-200 rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b dark:border-zinc-700 border-zinc-200">
            <span className="text-zinc-500 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded border">
              Esc
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <span className="text-2xl mb-2 block">🤷‍♂️</span>
                No commands found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="py-2">
                {!query && recentCommands.length > 0 && (
                  <div className="px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Recent
                  </div>
                )}
                
                {filteredCommands.map((command, index) => {
                  const isRecent = !query && recentCommands.includes(command.id);
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        saveRecentCommand(command.id);
                        command.action();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected 
                          ? 'bg-primary-color bg-opacity-10 border-r-2 border-primary-color' 
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-lg">{command.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {command.title}
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                          {command.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRecent && (
                          <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded">
                            Recent
                          </span>
                        )}
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded">
                          {command.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-t dark:border-zinc-700 border-zinc-200 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">↓</kbd>
                <span>navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">Enter</kbd>
                <span>select</span>
              </div>
            </div>
            <div className="text-zinc-400">
              {filteredCommands.length} {filteredCommands.length === 1 ? 'command' : 'commands'}
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
}