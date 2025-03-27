import { PageLayout } from "@/components/layout/PageLayout";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InvoiceCreate() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
        </div>
        
        <InvoiceForm />
      </div>
    </PageLayout>
  );
}