import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { useInvoiceStore } from "@/lib/store";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoices = useInvoiceStore((state) => state.invoices);
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

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/invoices/${invoice.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Invoice {invoice.invoiceNumber}
          </h1>
        </div>
        
        <InvoiceForm initialData={invoice} isEditing />
      </div>
    </PageLayout>
  );
}