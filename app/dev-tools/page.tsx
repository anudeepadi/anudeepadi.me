"use client";

import PageHeading from "../components/shared/PageHeading";
import dynamic from "next/dynamic";

// Dynamically import heavy components with no SSR
const CodePlayground = dynamic(() => import("../components/pages/CodePlayground"), {
  ssr: false,
  loading: () => <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
});

const AlgorithmVisualizer = dynamic(() => import("../components/pages/AlgorithmVisualizer"), {
  ssr: false,
  loading: () => <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
});

const DataAnalysisTool = dynamic(() => import("../components/pages/DataAnalysisTool"), {
  ssr: false,
  loading: () => <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
});

const ArchitectureShowcase = dynamic(() => import("../components/pages/ArchitectureShowcase"), {
  ssr: false,
  loading: () => <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
});

const SimulationDemo = dynamic(() => import("../components/pages/SimulationDemo"), {
  ssr: false,
  loading: () => <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
});

const DataDashboard = dynamic(() => import("../components/pages/DataDashboard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
});

export default function DevTools() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Active Dev Tools"
        description="Interactive tools and simulations for developers. Explore code playgrounds, algorithm visualizations, data analysis, architecture showcase, geothermal energy calculations, and more."
      />

      <CodePlayground />
      <AlgorithmVisualizer />
      <DataAnalysisTool />
      <ArchitectureShowcase />
      <SimulationDemo />
      <DataDashboard />
    </main>
  );
}
