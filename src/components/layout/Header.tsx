import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold">
            InvoiceManager
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/invoices/new">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}