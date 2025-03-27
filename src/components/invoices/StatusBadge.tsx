import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return { label: "Draft", className: "bg-muted text-muted-foreground" };
      case "pending":
        return { label: "Pending", className: "bg-amber-500 text-white" };
      case "paid":
        return { label: "Paid", className: "bg-green-500 text-white" };
      case "overdue":
        return { label: "Overdue", className: "bg-red-500 text-white" };
      default:
        return { label: status, className: "" };
    }
  };

  const { label, className } = getStatusConfig(status);

  return (
    <Badge className={cn("capitalize", className)}>
      {label}
    </Badge>
  );
}