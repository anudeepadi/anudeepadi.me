import { Metadata } from "next";
import PageHeading from "../components/shared/PageHeading";
import SimulationDemo from "../components/pages/SimulationDemo";
import DataDashboard from "../components/pages/DataDashboard";

export const metadata: Metadata = {
  title: "Dev Tools | Anudeep Adiraju",
  metadataBase: new URL("https://anudeepadi.me/dev-tools"),
  description: "Interactive development tools and simulations",
  openGraph: {
    title: "Dev Tools | Anudeep Adiraju",
    url: "https://anudeepadi.me/dev-tools",
    description: "Interactive development tools and simulations",
    images: "https://res.cloudinary.com/",
  },
};

export default function DevTools() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Active Dev Tools"
        description="Interactive tools and simulations for developers. Explore geothermal energy calculations, data visualizations, and more."
      />

      <SimulationDemo />
      <DataDashboard />
    </main>
  );
}
