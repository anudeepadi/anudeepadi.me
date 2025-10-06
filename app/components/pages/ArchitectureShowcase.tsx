"use client";

import { useState, useCallback, useMemo } from "react";
import { Slide } from "../../animation/Slide";

interface ArchitectureNode {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'service' | 'external' | 'infrastructure';
  description: string;
  technologies: string[];
  connections: string[];
  position: { x: number; y: number };
  details?: {
    responsibilities?: string[];
    apis?: string[];
    scaling?: string;
    monitoring?: string;
  };
}

interface ArchitectureProject {
  id: string;
  name: string;
  description: string;
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Enterprise';
  nodes: ArchitectureNode[];
  deploymentPipeline: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    monitoring: string[];
  };
}

type ViewMode = 'architecture' | 'tech-stack' | 'deployment' | 'database';

const ARCHITECTURE_PROJECTS: ArchitectureProject[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with microservices architecture',
    complexity: 'Enterprise',
    nodes: [
      {
        id: 'react-app',
        name: 'React Frontend',
        type: 'frontend',
        description: 'User interface built with React and TypeScript',
        technologies: ['React', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS'],
        connections: ['api-gateway', 'cdn'],
        position: { x: 100, y: 50 },
        details: {
          responsibilities: ['User authentication', 'Product catalog', 'Shopping cart', 'Checkout process'],
          apis: ['/api/products', '/api/cart', '/api/orders', '/api/auth']
        }
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'service',
        description: 'Central entry point for all API requests',
        technologies: ['Kong', 'Nginx', 'JWT'],
        connections: ['user-service', 'product-service', 'order-service', 'payment-service'],
        position: { x: 350, y: 150 },
        details: {
          responsibilities: ['Request routing', 'Authentication', 'Rate limiting', 'Load balancing'],
          scaling: 'Horizontal scaling with multiple instances'
        }
      },
      {
        id: 'user-service',
        name: 'User Service',
        type: 'backend',
        description: 'Handles user management and authentication',
        technologies: ['Node.js', 'Express', 'JWT', 'bcrypt'],
        connections: ['user-db', 'redis-cache'],
        position: { x: 200, y: 250 },
        details: {
          responsibilities: ['User registration', 'Authentication', 'Profile management', 'Permissions'],
          apis: ['/users', '/auth/login', '/auth/register', '/profile']
        }
      },
      {
        id: 'product-service',
        name: 'Product Service',
        type: 'backend',
        description: 'Manages product catalog and inventory',
        technologies: ['Python', 'FastAPI', 'Elasticsearch'],
        connections: ['product-db', 'search-engine'],
        position: { x: 350, y: 250 },
        details: {
          responsibilities: ['Product management', 'Inventory tracking', 'Search optimization', 'Categories'],
          apis: ['/products', '/categories', '/search', '/inventory']
        }
      },
      {
        id: 'order-service',
        name: 'Order Service',
        type: 'backend',
        description: 'Processes orders and manages order lifecycle',
        technologies: ['Java', 'Spring Boot', 'RabbitMQ'],
        connections: ['order-db', 'message-queue', 'payment-service'],
        position: { x: 500, y: 250 },
        details: {
          responsibilities: ['Order processing', 'Order tracking', 'Inventory updates', 'Notifications'],
          apis: ['/orders', '/orders/{id}/status', '/orders/history']
        }
      },
      {
        id: 'payment-service',
        name: 'Payment Service',
        type: 'service',
        description: 'Handles payment processing and transactions',
        technologies: ['Node.js', 'Stripe API', 'PayPal SDK'],
        connections: ['payment-db', 'stripe-api', 'paypal-api'],
        position: { x: 650, y: 250 },
        details: {
          responsibilities: ['Payment processing', 'Transaction history', 'Refunds', 'Security compliance'],
          apis: ['/payments', '/payments/process', '/payments/refund']
        }
      },
      {
        id: 'user-db',
        name: 'User Database',
        type: 'database',
        description: 'PostgreSQL database for user data',
        technologies: ['PostgreSQL', 'Connection Pooling'],
        connections: [],
        position: { x: 200, y: 350 }
      },
      {
        id: 'product-db',
        name: 'Product Database',
        type: 'database',
        description: 'MongoDB for product catalog',
        technologies: ['MongoDB', 'GridFS'],
        connections: [],
        position: { x: 350, y: 350 }
      },
      {
        id: 'order-db',
        name: 'Order Database',
        type: 'database',
        description: 'PostgreSQL for order management',
        technologies: ['PostgreSQL', 'Read Replicas'],
        connections: [],
        position: { x: 500, y: 350 }
      },
      {
        id: 'redis-cache',
        name: 'Redis Cache',
        type: 'infrastructure',
        description: 'In-memory caching for performance',
        technologies: ['Redis', 'Redis Cluster'],
        connections: [],
        position: { x: 100, y: 350 }
      },
      {
        id: 'cdn',
        name: 'CDN',
        type: 'infrastructure',
        description: 'Content delivery network for static assets',
        technologies: ['CloudFlare', 'AWS CloudFront'],
        connections: [],
        position: { x: 100, y: 150 }
      }
    ],
    deploymentPipeline: [
      'Code Commit (Git)',
      'Automated Tests (Jest, Pytest)',
      'Code Quality Check (ESLint, SonarQube)',
      'Build Docker Images',
      'Security Scan (Snyk)',
      'Deploy to Staging',
      'Integration Tests',
      'Performance Tests',
      'Deploy to Production',
      'Health Checks',
      'Monitoring & Alerts'
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'Webpack'],
      backend: ['Node.js', 'Python', 'Java', 'Express', 'FastAPI', 'Spring Boot'],
      database: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS', 'CloudFlare', 'Nginx'],
      monitoring: ['Prometheus', 'Grafana', 'ELK Stack', 'Sentry', 'DataDog']
    }
  },
  {
    id: 'saas-platform',
    name: 'SaaS Analytics Platform',
    description: 'Real-time analytics platform with multi-tenancy',
    complexity: 'Complex',
    nodes: [
      {
        id: 'dashboard-app',
        name: 'Dashboard App',
        type: 'frontend',
        description: 'Real-time analytics dashboard',
        technologies: ['Vue.js', 'TypeScript', 'Chart.js', 'WebSocket'],
        connections: ['auth-service', 'analytics-api'],
        position: { x: 150, y: 50 },
        details: {
          responsibilities: ['Data visualization', 'Real-time updates', 'User management', 'Report generation']
        }
      },
      {
        id: 'auth-service',
        name: 'Auth Service',
        type: 'backend',
        description: 'Multi-tenant authentication service',
        technologies: ['Go', 'OAuth2', 'Auth0'],
        connections: ['tenant-db'],
        position: { x: 300, y: 150 }
      },
      {
        id: 'analytics-api',
        name: 'Analytics API',
        type: 'backend',
        description: 'Core analytics processing service',
        technologies: ['Python', 'FastAPI', 'Pandas', 'NumPy'],
        connections: ['time-series-db', 'message-queue'],
        position: { x: 450, y: 150 }
      },
      {
        id: 'data-ingestion',
        name: 'Data Ingestion',
        type: 'service',
        description: 'High-throughput data processing pipeline',
        technologies: ['Apache Kafka', 'Apache Spark', 'Python'],
        connections: ['message-queue', 'time-series-db'],
        position: { x: 600, y: 150 }
      },
      {
        id: 'tenant-db',
        name: 'Tenant Database',
        type: 'database',
        description: 'Multi-tenant user and configuration data',
        technologies: ['PostgreSQL', 'Row Level Security'],
        connections: [],
        position: { x: 300, y: 250 }
      },
      {
        id: 'time-series-db',
        name: 'Time Series DB',
        type: 'database',
        description: 'High-performance analytics data storage',
        technologies: ['InfluxDB', 'TimescaleDB'],
        connections: [],
        position: { x: 450, y: 250 }
      }
    ],
    deploymentPipeline: [
      'Git Push',
      'Unit Tests',
      'Integration Tests',
      'Docker Build',
      'Security Scan',
      'Deploy to Staging',
      'E2E Tests',
      'Performance Tests',
      'Blue-Green Deployment',
      'Health Monitoring'
    ],
    techStack: {
      frontend: ['Vue.js', 'TypeScript', 'Vuex', 'Chart.js', 'WebSocket'],
      backend: ['Go', 'Python', 'FastAPI', 'Apache Kafka', 'Apache Spark'],
      database: ['PostgreSQL', 'InfluxDB', 'Redis'],
      infrastructure: ['Kubernetes', 'AWS EKS', 'Terraform', 'Helm'],
      monitoring: ['Prometheus', 'Grafana', 'Jaeger', 'ELK Stack']
    }
  },
  {
    id: 'mobile-app',
    name: 'Mobile Social Platform',
    description: 'Cross-platform mobile app with real-time features',
    complexity: 'Moderate',
    nodes: [
      {
        id: 'mobile-app',
        name: 'Mobile App',
        type: 'frontend',
        description: 'Cross-platform mobile application',
        technologies: ['React Native', 'TypeScript', 'Expo'],
        connections: ['api-server', 'push-service'],
        position: { x: 200, y: 50 }
      },
      {
        id: 'api-server',
        name: 'API Server',
        type: 'backend',
        description: 'RESTful API with real-time capabilities',
        technologies: ['Node.js', 'Socket.IO', 'Express'],
        connections: ['mongodb', 'redis'],
        position: { x: 350, y: 150 }
      },
      {
        id: 'push-service',
        name: 'Push Notifications',
        type: 'service',
        description: 'Push notification service',
        technologies: ['Firebase FCM', 'APNs'],
        connections: [],
        position: { x: 500, y: 150 }
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        type: 'database',
        description: 'Document database for app data',
        technologies: ['MongoDB', 'Mongoose'],
        connections: [],
        position: { x: 350, y: 250 }
      },
      {
        id: 'redis',
        name: 'Redis',
        type: 'infrastructure',
        description: 'Session store and real-time data',
        technologies: ['Redis', 'Socket.IO Adapter'],
        connections: [],
        position: { x: 200, y: 250 }
      }
    ],
    deploymentPipeline: [
      'Git Commit',
      'Unit Tests',
      'Build Mobile App',
      'Deploy API to Staging',
      'Mobile App Testing',
      'Deploy to Production',
      'App Store Deployment'
    ],
    techStack: {
      frontend: ['React Native', 'TypeScript', 'Expo', 'Redux'],
      backend: ['Node.js', 'Express', 'Socket.IO'],
      database: ['MongoDB', 'Redis'],
      infrastructure: ['AWS', 'Docker', 'Firebase'],
      monitoring: ['Sentry', 'Firebase Analytics', 'New Relic']
    }
  }
];

const NODE_COLORS = {
  frontend: 'bg-blue-500',
  backend: 'bg-green-500',
  database: 'bg-purple-500',
  service: 'bg-orange-500',
  external: 'bg-red-500',
  infrastructure: 'bg-gray-500'
};

const COMPLEXITY_COLORS = {
  Simple: 'text-green-600',
  Moderate: 'text-yellow-600',
  Complex: 'text-orange-600',
  Enterprise: 'text-red-600'
};

export default function ArchitectureShowcase() {
  const [selectedProject, setSelectedProject] = useState<ArchitectureProject>(ARCHITECTURE_PROJECTS[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('architecture');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate connections for visualization
  const connections = useMemo(() => {
    return selectedProject.nodes.flatMap(node =>
      node.connections.map(targetId => {
        const target = selectedProject.nodes.find(n => n.id === targetId);
        if (!target) return null;
        return {
          from: node,
          to: target,
          id: `${node.id}-${targetId}`
        };
      }).filter(Boolean)
    );
  }, [selectedProject]);

  const renderArchitectureDiagram = () => (
    <div className="relative bg-zinc-50 dark:bg-zinc-800 rounded-lg p-8 overflow-auto" style={{ minHeight: '500px' }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(conn => {
          if (!conn) return null;
          const fromX = conn.from.position.x + 60;
          const fromY = conn.from.position.y + 40;
          const toX = conn.to.position.x + 60;
          const toY = conn.to.position.y + 40;
          
          return (
            <line
              key={conn.id}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          );
        })}
      </svg>
      
      {selectedProject.nodes.map(node => (
        <div
          key={node.id}
          className={`absolute cursor-pointer transition-all duration-200 ${
            hoveredNode === node.id ? 'scale-110 z-10' : ''
          } ${selectedNode?.id === node.id ? 'ring-2 ring-primary-color' : ''}`}
          style={{
            left: node.position.x,
            top: node.position.y,
            width: '120px',
            height: '80px'
          }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => setSelectedNode(node)}
        >
          <div className={`w-full h-full rounded-lg text-white p-2 shadow-md ${NODE_COLORS[node.type]}`}>
            <div className="text-xs font-semibold mb-1 truncate">{node.name}</div>
            <div className="text-xs opacity-80 leading-tight">
              {node.technologies.slice(0, 2).join(', ')}
              {node.technologies.length > 2 && '...'}
            </div>
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md">
        <h4 className="text-sm font-semibold mb-2">Components</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${color}`}></div>
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTechStack = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(selectedProject.techStack).map(([category, technologies]) => (
        <div key={category} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 capitalize flex items-center gap-2">
            <span className="text-lg">
              {category === 'frontend' && '🎨'}
              {category === 'backend' && '⚙️'}
              {category === 'database' && '🗄️'}
              {category === 'infrastructure' && '☁️'}
              {category === 'monitoring' && '📊'}
            </span>
            {category.replace('-', ' ')}
          </h4>
          <div className="space-y-2">
            {technologies.map(tech => (
              <div key={tech} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary-color rounded-full"></div>
                <span className="text-zinc-700 dark:text-zinc-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeploymentPipeline = () => (
    <div className="space-y-4">
      {selectedProject.deploymentPipeline.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </div>
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">{step}</div>
          </div>
          {index < selectedProject.deploymentPipeline.length - 1 && (
            <div className="flex-shrink-0 text-zinc-400">→</div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDatabaseSchema = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {selectedProject.nodes.filter(node => node.type === 'database').map(db => (
        <div key={db.id} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <span className="text-lg">🗄️</span>
            {db.name}
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Technologies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {db.technologies.map(tech => (
                  <span key={tech} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Purpose:</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{db.description}</p>
            </div>
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Connected Services:</span>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                {selectedProject.nodes.filter(node => node.connections.includes(db.id)).map(node => node.name).join(', ') || 'None'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="architecture-section" className="mt-32 max-w-7xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Project Architecture Showcase
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-4xl">
            Explore system architectures, technology stacks, and deployment pipelines of various projects. 
            Interactive diagrams show how complex systems are designed and scaled.
          </p>
        </div>
      </Slide>

      {/* Project Selection */}
      <Slide delay={0.25}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Select Project
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {ARCHITECTURE_PROJECTS.map(project => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProject(project);
                  setSelectedNode(null);
                }}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  selectedProject.id === project.id
                    ? 'border-primary-color bg-primary-color bg-opacity-10'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-primary-color'
                }`}
              >
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{project.name}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${COMPLEXITY_COLORS[project.complexity]}`}>
                    {project.complexity}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {project.nodes.length} components
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Slide>

      {/* View Mode Tabs */}
      <Slide delay={0.35}>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            {[
              { id: 'architecture', label: 'Architecture', icon: '🏗️' },
              { id: 'tech-stack', label: 'Tech Stack', icon: '🛠️' },
              { id: 'deployment', label: 'Deployment', icon: '🚀' },
              { id: 'database', label: 'Database', icon: '🗄️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === tab.id
                    ? 'bg-primary-color text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Slide>

      {/* Content Area */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main View */}
        <div className="lg:col-span-3">
          <Slide delay={0.45}>
            <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                {viewMode === 'architecture' && '🏗️ System Architecture'}
                {viewMode === 'tech-stack' && '🛠️ Technology Stack'}
                {viewMode === 'deployment' && '🚀 Deployment Pipeline'}
                {viewMode === 'database' && '🗄️ Database Design'}
              </h3>
              
              {viewMode === 'architecture' && renderArchitectureDiagram()}
              {viewMode === 'tech-stack' && renderTechStack()}
              {viewMode === 'deployment' && renderDeploymentPipeline()}
              {viewMode === 'database' && renderDatabaseSchema()}
            </div>
          </Slide>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <Slide delay={0.55}>
            <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                Details
              </h3>
              
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                      {selectedNode.name}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {selectedNode.description}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Technologies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedNode.details?.responsibilities && (
                    <div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Responsibilities:</span>
                      <ul className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 list-disc list-inside space-y-1">
                        {selectedNode.details.responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedNode.details?.apis && (
                    <div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">API Endpoints:</span>
                      <ul className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 space-y-1">
                        {selectedNode.details.apis.map((api, index) => (
                          <li key={index} className="font-mono text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded">
                            {api}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Connections:</span>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {selectedNode.connections.length > 0 ? (
                        selectedNode.connections.map(connId => 
                          selectedProject.nodes.find(n => n.id === connId)?.name
                        ).join(', ')
                      ) : (
                        'No direct connections'
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">🏗️</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Click on a component in the architecture diagram to see detailed information.
                  </p>
                </div>
              )}
            </div>
          </Slide>
        </div>
      </div>
    </section>
  );
}