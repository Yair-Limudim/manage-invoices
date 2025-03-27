import { useInvoiceStore, Client } from "@/lib/store";

interface ClientInfoProps {
  clientId: string;
}

export function ClientInfo({ clientId }: ClientInfoProps) {
  const clients = useInvoiceStore((state) => state.clients);
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return <div className="text-muted-foreground">No client selected</div>;
  }

  return (
    <div className="space-y-1">
      <div className="font-medium">{client.name}</div>
      <div className="text-sm text-muted-foreground">{client.company}</div>
      <div className="text-sm">{client.email}</div>
      <div className="text-sm">{client.phone}</div>
      <div className="text-sm whitespace-pre-line">{client.address}</div>
    </div>
  );
}