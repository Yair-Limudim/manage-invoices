import { useInvoiceStore, InvoiceStatus } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, AlertCircle, CheckCircle } from "lucide-react";

export function InvoiceStats() {
  const invoices = useInvoiceStore((state) => state.invoices);

  const getInvoicesByStatus = (status: InvoiceStatus) => {
    return invoices.filter((invoice) => invoice.status === status);
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = getInvoicesByStatus("paid");
  const paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingInvoices = getInvoicesByStatus("pending");
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const overdueInvoices = getInvoicesByStatus("overdue");
  const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {invoices.length} total invoices
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${paidAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {paidInvoices.length} paid invoices
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {pendingInvoices.length} pending invoices
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${overdueAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {overdueInvoices.length} overdue invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
}