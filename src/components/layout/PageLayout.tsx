import { ReactNode } from "react";
import { Header } from "./Header";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {title && (
          <h1 className="text-3xl font-bold tracking-tight mb-6">{title}</h1>
        )}
        {children}
      </main>
    </div>
  );
}