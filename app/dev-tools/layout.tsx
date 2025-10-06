import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Tools | Anudeep Adiraju",
  description: "Interactive development tools and simulations",
};

export default function DevToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
