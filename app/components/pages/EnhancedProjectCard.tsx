"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    slug: string;
    tagline: string;
    projectUrl?: string;
    repository?: string;
    logo?: string;
    coverImage?: {
      image: string;
      alt: string | null;
      lqip: string;
    };
    description?: any[];
  };
}

interface GitHubStats {
  stars: number;
  forks: number;
  language: string;
  lastCommit: string;
}

interface PerformanceMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

// Mock tech stack data (in real implementation, this would come from your CMS)
const getTechStack = (projectName: string) => {
  const techStacks: Record<string, string[]> = {
    "Geothermal Resource Calculator": ["React", "TypeScript", "Recharts", "Tailwind CSS"],
    "Data Visualization Dashboard": ["Next.js", "TypeScript", "Recharts", "Framer Motion"],
    "Portfolio Website": ["Next.js", "Sanity CMS", "TypeScript", "Tailwind CSS"],
    "E-commerce Platform": ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    "Weather App": ["React Native", "TypeScript", "Expo", "OpenWeather API"],
    "Task Manager": ["Vue.js", "Firebase", "Vuetify", "PWA"]
  };
  return techStacks[projectName] || ["React", "TypeScript", "CSS"];
};

// Mock complexity calculation
const getComplexity = (techStack: string[]) => {
  const complexityMap: Record<string, number> = {
    "React": 2, "Vue.js": 2, "Angular": 3,
    "Next.js": 3, "Nuxt.js": 3, "Gatsby": 3,
    "Node.js": 3, "Express": 2, "Django": 3,
    "MongoDB": 2, "PostgreSQL": 3, "Redis": 2,
    "TypeScript": 2, "GraphQL": 3, "Docker": 3,
    "AWS": 4, "Azure": 4, "GCP": 4,
    "Kubernetes": 4, "Microservices": 4
  };
  
  const totalComplexity = techStack.reduce((sum, tech) => sum + (complexityMap[tech] || 1), 0);
  const avgComplexity = totalComplexity / techStack.length;
  
  if (avgComplexity >= 3.5) return "Expert";
  if (avgComplexity >= 2.5) return "Advanced";
  if (avgComplexity >= 1.5) return "Intermediate";
  return "Beginner";
};

// Mock GitHub stats fetcher
const fetchGitHubStats = async (repository: string): Promise<GitHubStats | null> => {
  // In real implementation, this would make an API call to GitHub
  const mockStats: Record<string, GitHubStats> = {
    "anudeepadi/portfolio": {
      stars: 42,
      forks: 12,
      language: "TypeScript",
      lastCommit: "2 days ago"
    },
    "anudeepadi/geothermal-calc": {
      stars: 28,
      forks: 8,
      language: "JavaScript",
      lastCommit: "1 week ago"
    }
  };
  
  return mockStats[repository] || {
    stars: Math.floor(Math.random() * 50) + 5,
    forks: Math.floor(Math.random() * 20) + 1,
    language: "TypeScript",
    lastCommit: `${Math.floor(Math.random() * 30) + 1} days ago`
  };
};

// Mock performance metrics
const getPerformanceMetrics = (): PerformanceMetrics => ({
  performance: Math.floor(Math.random() * 20) + 80,
  accessibility: Math.floor(Math.random() * 15) + 85,
  bestPractices: Math.floor(Math.random() * 10) + 90,
  seo: Math.floor(Math.random() * 25) + 75
});

const complexityColors = {
  "Beginner": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Intermediate": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Advanced": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Expert": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

const techStackColors = [
  "bg-primary-color text-white",
  "bg-secondary-color text-white", 
  "bg-tertiary-color text-white",
  "bg-blue-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-indigo-500 text-white",
  "bg-yellow-500 text-black"
];

export default function EnhancedProjectCard({ project }: ProjectCardProps) {
  const [gitHubStats, setGitHubStats] = useState<GitHubStats | null>(null);
  const [performanceMetrics] = useState<PerformanceMetrics>(getPerformanceMetrics());
  const [isLoading, setIsLoading] = useState(true);
  
  const techStack = getTechStack(project.name);
  const complexity = getComplexity(techStack);
  const repositoryName = project.repository?.replace('https://github.com/', '') || '';

  useEffect(() => {
    const loadGitHubStats = async () => {
      if (repositoryName) {
        try {
          const stats = await fetchGitHubStats(repositoryName);
          setGitHubStats(stats);
        } catch (error) {
          console.error('Failed to load GitHub stats:', error);
        }
      }
      setIsLoading(false);
    };

    loadGitHubStats();
  }, [repositoryName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300"
    >
      {/* Project Preview/Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-color to-secondary-color overflow-hidden">
        {project.coverImage?.image ? (
          <Image
            src={project.coverImage.image}
            alt={project.coverImage.alt || project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={project.coverImage.lqip}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-80">
              {project.logo ? (
                <Image
                  src={project.logo}
                  width={80}
                  height={80}
                  alt={project.name}
                  className="rounded-lg"
                />
              ) : (
                "🚀"
              )}
            </div>
          </div>
        )}
        
        {/* Complexity Indicator */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${complexityColors[complexity]}`}>
            {complexity}
          </span>
        </div>

        {/* GitHub Stats Overlay */}
        {gitHubStats && (
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
              <span>⭐</span>
              <span>{gitHubStats.stars}</span>
            </div>
            <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
              <span>🍴</span>
              <span>{gitHubStats.forks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Project Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-primary-color transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech, index) => (
              <span
                key={tech}
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  techStackColors[index % techStackColors.length]
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Performance</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Speed</span>
              <span className={`font-medium ${performanceMetrics.performance >= 90 ? 'text-green-600' : performanceMetrics.performance >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceMetrics.performance}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">A11y</span>
              <span className={`font-medium ${performanceMetrics.accessibility >= 90 ? 'text-green-600' : performanceMetrics.accessibility >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceMetrics.accessibility}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Practices</span>
              <span className={`font-medium ${performanceMetrics.bestPractices >= 90 ? 'text-green-600' : performanceMetrics.bestPractices >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceMetrics.bestPractices}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">SEO</span>
              <span className={`font-medium ${performanceMetrics.seo >= 90 ? 'text-green-600' : performanceMetrics.seo >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceMetrics.seo}
              </span>
            </div>
          </div>
        </div>

        {/* GitHub Language and Last Commit */}
        {gitHubStats && (
          <div className="mb-4 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
            <span>📝 {gitHubStats.language}</span>
            <span>🕒 {gitHubStats.lastCommit}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="flex-1 bg-primary-color text-white text-center py-2 px-4 rounded-md hover:bg-secondary-color transition-colors text-sm font-medium"
          >
            View Details
          </Link>
          
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-center py-2 px-4 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
            >
              Live Demo
            </a>
          )}
          
          {project.repository && (
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-center py-2 px-4 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              View Code
            </a>
          )}
        </div>

        {/* Loading Skeleton for GitHub Stats */}
        {isLoading && repositoryName && (
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-3/4"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}