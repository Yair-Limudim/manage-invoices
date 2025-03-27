import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface EmptyStateProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

export function EmptyState({ title, description, link, linkText }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      <Link to={link}>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {linkText}
        </Button>
      </Link>
    </div>
  );
}