import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useInvoiceStore, Invoice, InvoiceItem, InvoiceStatus } from "@/lib/store";
import { ClientSelect } from "./ClientSelect";
import { InvoiceItem as InvoiceItemComponent } from "./InvoiceItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface InvoiceFormProps {
  initialData?: Invoice;
  isEditing?: boolean;
}

export function InvoiceForm({ initialData, isEditing = false }: InvoiceFormProps) {
  const navigate = useNavigate();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);
  
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || `INV-${String(Date.now()).slice(-6)}`);
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [items, setItems] = useState<InvoiceItem[]>(initialData?.items || []);
  const [subtotal, setSubtotal] = useState(initialData?.subtotal || 0);
  const [tax, setTax] = useState(initialData?.tax || 0);
  const [total, setTotal] = useState(initialData?.total || 0);
  const [status, setStatus] = useState<InvoiceStatus>(initialData?.status || "draft");
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Set default due date to 14 days from issue date if not provided
  useEffect(() => {
    if (!dueDate && issueDate) {
      const date = new Date(issueDate);
      date.setDate(date.getDate() + 14);
      setDueDate(date.toISOString().split("T")[0]);
    }
  }, [dueDate, issueDate]);

  // Recalculate totals when items or tax changes
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.amount, 0);
    setSubtotal(newSubtotal);
    
    const newTotal = newSubtotal + tax;
    setTotal(newTotal);
  }, [items, tax]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (updatedItem: InvoiceItem) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleTaxChange = (value: string) => {
    const newTax = parseFloat(value) || 0;
    setTax(newTax);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      toast.error("Please select a client");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    
    const invoiceData = {
      invoiceNumber,
      clientId,
      issueDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      status,
      notes,
    };
    
    if (isEditing && initialData) {
      updateInvoice(initialData.id, invoiceData);
      toast.success("Invoice updated successfully");
      navigate(`/invoices/${initialData.id}`);
    } else {
      addInvoice(invoiceData);
      toast.success("Invoice created successfully");
      navigate("/invoices");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="client">Client</Label>
            <ClientSelect value={clientId} onChange={setClientId} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as InvoiceStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-[calc(100%-2rem)]"
            placeholder="Add any notes or payment instructions..."
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="font-medium">Invoice Items</div>
            
            <div className="grid grid-cols-12 gap-2 mb-2 font-medium text-sm">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
            </div>
            
            {items.map((item, index) => (
              <InvoiceItemComponent
                key={item.id}
                item={item}
                onChange={handleUpdateItem}
                onRemove={() => handleRemoveItem(item.id)}
                index={index}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            
            <Separator />
            
            <div className="flex flex-col items-end space-y-2">
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="text-right">Subtotal:</div>
                <div className="text-right font-medium">
                  ${subtotal.toFixed(2)}
                </div>
                
                <div className="text-right">Tax:</div>
                <div>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax}
                    onChange={(e) => handleTaxChange(e.target.value)}
                    className="w-full text-right"
                  />
                </div>
                
                <div className="text-right font-bold">Total:</div>
                <div className="text-right font-bold">
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEditing && initialData ? `/invoices/${initialData.id}` : "/invoices")}
        >
          Cancel
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}