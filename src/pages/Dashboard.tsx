import { PageLayout } from "@/components/layout/PageLayout";
import { InvoiceStats } from "@/components/dashboard/InvoiceStats";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { PlusCircle, FileText } from "lucide-react";
import { useInvoiceStore } from "@/lib/store";

export default function Dashboard() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const hasInvoices = invoices.length > 0;

  return (
    <PageLayout title="Dashboard">
      <div className="space-y-6">
        {hasInvoices ? (
          <>
            <InvoiceStats />
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
              <Link to="/invoices">
                <Button variant="outline">View All Invoices</Button>
              </Link>
            </div>
            
            <RecentInvoices />
          </>
        ) : (
          <EmptyState
            title="No invoices yet"
            description="Create your first invoice to get started tracking your business finances."
            link="/invoices/new"
            linkText="Create New Invoice"
          />
        )}
        
        {hasInvoices && (
          <div className="flex justify-center mt-8">
            <Link to="/invoices/new">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Create New Invoice
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
}