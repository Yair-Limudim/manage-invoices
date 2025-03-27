import { useInvoiceStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/invoices/StatusBadge";
import { Link } from "react-router";

export function RecentInvoices() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const clients = useInvoiceStore((state) => state.clients);

  // Sort invoices by date (newest first) and take the first 5
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInvoices.length > 0 ? (
            recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div className="space-y-1">
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="font-medium hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {getClientName(invoice.clientId)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${invoice.total.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No invoices found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}