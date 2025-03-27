import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { useInvoiceStore, InvoiceStatus } from "@/lib/store";
import { StatusBadge } from "@/components/invoices/StatusBadge";
import { ClientInfo } from "@/components/invoices/ClientInfo";
import { DeleteInvoiceDialog } from "@/components/invoices/DeleteInvoiceDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoices = useInvoiceStore((state) => state.invoices);
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  
  const [invoice, setInvoice] = useState(invoices.find((inv) => inv.id === id));

  useEffect(() => {
    const foundInvoice = invoices.find((inv) => inv.id === id);
    setInvoice(foundInvoice);
    
    if (!foundInvoice) {
      toast.error("Invoice not found");
      navigate("/invoices");
    }
  }, [id, invoices, navigate]);

  if (!invoice) {
    return null;
  }

  const handleStatusChange = (status: string) => {
    updateInvoice(invoice.id, { status: status as InvoiceStatus });
    toast.success(`Invoice status updated to ${status}`);
  };

  const handleDeleteInvoice = () => {
    deleteInvoice(invoice.id);
    toast.success("Invoice deleted successfully");
    navigate("/invoices");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Invoice {invoice.invoiceNumber}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={invoice.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handlePrintInvoice}>
              <Download className="mr-2 h-4 w-4" />
              Print/Download
            </Button>
            
            <Link to={`/invoices/${invoice.id}/edit`}>
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            
            <DeleteInvoiceDialog 
              onDelete={handleDeleteInvoice} 
              invoiceNumber={invoice.invoiceNumber}
            />
          </div>
        </div>
        
        <div className="print:shadow-none print:border-none shadow-lg border rounded-lg p-6 bg-white dark:bg-card">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Invoice</h2>
              <div className="text-muted-foreground mb-4">{invoice.invoiceNumber}</div>
              <div className="space-y-1">
                <div><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</div>
                <div><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
                <div className="mt-2">
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0">
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <ClientInfo clientId={invoice.clientId} />
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-full">Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}