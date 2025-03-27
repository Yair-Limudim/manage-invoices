import { InvoiceItem as InvoiceItemType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

interface InvoiceItemProps {
  item: InvoiceItemType;
  onChange: (item: InvoiceItemType) => void;
  onRemove: () => void;
  index: number;
}

export function InvoiceItem({ item, onChange, onRemove, index }: InvoiceItemProps) {
  const updateField = (field: keyof InvoiceItemType, value: string | number) => {
    const updatedItem = { ...item, [field]: value };
    
    // Recalculate amount when quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : item.quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
      updatedItem.amount = quantity * unitPrice;
    }
    
    onChange(updatedItem);
  };

  // Ensure amount is always calculated correctly
  useEffect(() => {
    const calculatedAmount = item.quantity * item.unitPrice;
    if (calculatedAmount !== item.amount) {
      onChange({ ...item, amount: calculatedAmount });
    }
  }, [item.quantity, item.unitPrice]);

  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
      <div className="col-span-5">
        <Input
          placeholder="Description"
          value={item.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min="1"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => updateField('quantity', Number(e.target.value))}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={item.unitPrice}
          onChange={(e) => updateField('unitPrice', Number(e.target.value))}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          readOnly
          value={item.amount.toFixed(2)}
          className="bg-muted"
        />
      </div>
      <div className="col-span-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}