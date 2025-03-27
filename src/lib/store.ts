import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceStore {
  invoices: Invoice[];
  clients: Client[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

// Sample clients data
const sampleClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, CA 12345',
    company: 'Acme Inc.'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, NY 67890',
    company: 'XYZ Corp'
  }
];

// Sample invoices data
const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientId: '1',
    issueDate: '2023-05-01',
    dueDate: '2023-05-15',
    items: [
      {
        id: '1',
        description: 'Web Design',
        quantity: 1,
        unitPrice: 1000,
        amount: 1000
      }
    ],
    subtotal: 1000,
    tax: 100,
    total: 1100,
    status: 'paid',
    notes: 'Thank you for your business!',
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientId: '2',
    issueDate: '2023-05-05',
    dueDate: '2023-05-19',
    items: [
      {
        id: '1',
        description: 'Logo Design',
        quantity: 1,
        unitPrice: 500,
        amount: 500
      },
      {
        id: '2',
        description: 'Business Cards',
        quantity: 100,
        unitPrice: 2,
        amount: 200
      }
    ],
    subtotal: 700,
    tax: 70,
    total: 770,
    status: 'pending',
    notes: '',
    createdAt: '2023-05-05T14:30:00Z',
    updatedAt: '2023-05-05T14:30:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    clientId: '1',
    issueDate: '2023-04-15',
    dueDate: '2023-04-29',
    items: [
      {
        id: '1',
        description: 'Hosting (Monthly)',
        quantity: 1,
        unitPrice: 50,
        amount: 50
      }
    ],
    subtotal: 50,
    tax: 5,
    total: 55,
    status: 'overdue',
    notes: 'Second reminder',
    createdAt: '2023-04-15T09:15:00Z',
    updatedAt: '2023-04-15T09:15:00Z'
  }
];

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: sampleInvoices,
  clients: sampleClients,
  
  addInvoice: (invoice) => set((state) => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    return { invoices: [...state.invoices, newInvoice] };
  }),
  
  updateInvoice: (id, updatedInvoice) => set((state) => ({
    invoices: state.invoices.map((invoice) => 
      invoice.id === id 
        ? { ...invoice, ...updatedInvoice, updatedAt: new Date().toISOString() } 
        : invoice
    )
  })),
  
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter((invoice) => invoice.id !== id)
  })),
  
  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: uuidv4() }]
  })),
  
  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map((client) => 
      client.id === id ? { ...client, ...updatedClient } : client
    )
  })),
  
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((client) => client.id !== id)
  }))
}));