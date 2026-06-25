import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

interface LineItem {
  name: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  lineItems: LineItem[];
}

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  usageLimit: number;
  usageCurrent: number;
  usageUnit: string;
}

// Initial mock data
let invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Acme Corp',
    amount: 1200.00,
    issueDate: '2026-06-01',
    dueDate: '2026-07-01',
    status: 'paid',
    description: 'Enterprise Cloud Infrastructure Hosting & SLA Support',
    lineItems: [
      { name: 'AWS Cloud Hosting (EC2/RDS)', quantity: 1, price: 900.00 },
      { name: 'Priority Support SLA', quantity: 1, price: 300.00 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-002',
    clientName: 'Stark Industries',
    amount: 3450.00,
    issueDate: '2026-06-10',
    dueDate: '2026-07-10',
    status: 'pending',
    description: 'Advanced Security Audit & Penetration Testing Report',
    lineItems: [
      { name: 'Security Audit & Advisory Services', quantity: 1, price: 2500.00 },
      { name: 'Automated Vulnerability Scanning Package', quantity: 1, price: 950.00 }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-003',
    clientName: 'Wayne Enterprises',
    amount: 850.00,
    issueDate: '2026-05-20',
    dueDate: '2026-06-20',
    status: 'overdue',
    description: 'Workspace SaaS Licenses and Setup Fees',
    lineItems: [
      { name: 'Slack Enterprise Grid Seat Licenses', quantity: 17, price: 40.00 },
      { name: 'Initial Workspace Configuration Fee', quantity: 1, price: 170.00 }
    ]
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-004',
    clientName: 'Cyberdyne Systems',
    amount: 499.00,
    issueDate: '2026-06-15',
    dueDate: '2026-07-15',
    status: 'pending',
    description: 'OpenAI API Token Usage & Fine-Tuning Support',
    lineItems: [
      { name: 'OpenAI API Usage Credit', quantity: 1, price: 400.00 },
      { name: 'Fine-tuning consultation support', quantity: 1, price: 99.00 }
    ]
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-005',
    clientName: 'Oscorp Industries',
    amount: 2200.00,
    issueDate: '2026-05-05',
    dueDate: '2026-06-05',
    status: 'overdue',
    description: 'Consulting services for Custom Dashboard Integration',
    lineItems: [
      { name: 'Frontend Engineer Consulting (Hours)', quantity: 22, price: 100.00 }
    ]
  }
];

let subscriptions: Subscription[] = [
  {
    id: 'sub_1',
    name: 'AWS Cloud Infrastructure',
    cost: 950.00,
    billingCycle: 'monthly',
    usageLimit: 5000,
    usageCurrent: 3820,
    usageUnit: 'GB Transfer'
  },
  {
    id: 'sub_2',
    name: 'GitHub Enterprise Grid',
    cost: 320.00,
    billingCycle: 'monthly',
    usageLimit: 50,
    usageCurrent: 44,
    usageUnit: 'Seat Licenses'
  },
  {
    id: 'sub_3',
    name: 'Slack Communication Hub',
    cost: 150.00,
    billingCycle: 'monthly',
    usageLimit: 100,
    usageCurrent: 85,
    usageUnit: 'Active Users'
  },
  {
    id: 'sub_4',
    name: 'OpenAI API Usage',
    cost: 450.00,
    billingCycle: 'monthly',
    usageLimit: 1000,
    usageCurrent: 780,
    usageUnit: 'USD Credits'
  }
];

// Helper to calculate statistics
const getStats = () => {
  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const activeSubscriptionsCount = subscriptions.length;
  
  const monthlySpend = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12);
  }, 0);

  return {
    totalPaid,
    totalPending,
    totalOverdue,
    activeSubscriptionsCount,
    monthlySpend
  };
};

// Endpoints
app.get('/api/stats', (req: Request, res: Response) => {
  res.json(getStats());
});

app.get('/api/invoices', (req: Request, res: Response) => {
  res.json(invoices);
});

app.get('/api/subscriptions', (req: Request, res: Response) => {
  res.json(subscriptions);
});

app.post('/api/invoices', (req: Request, res: Response) => {
  const { clientName, amount, dueDate, description, lineItems } = req.body;

  if (!clientName || !amount || !dueDate) {
    return res.status(400).json({ error: 'Client name, amount, and due date are required.' });
  }

  const issueDate = new Date().toISOString().split('T')[0];
  const nextNum = invoices.length + 1;
  const invoiceNumber = `INV-2026-${String(nextNum).padStart(3, '0')}`;

  const newInvoice: Invoice = {
    id: String(Date.now()),
    invoiceNumber,
    clientName,
    amount: parseFloat(amount),
    dueDate,
    issueDate,
    status: 'pending',
    description: description || '',
    lineItems: lineItems || []
  };

  invoices.unshift(newInvoice); // Add to the top of list
  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id/pay', (req: Request, res: Response) => {
  const { id } = req.params;
  const invoiceIndex = invoices.findIndex(inv => inv.id === id);

  if (invoiceIndex === -1) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  invoices[invoiceIndex].status = 'paid';
  res.json(invoices[invoiceIndex]);
});

app.listen(PORT, () => {
  console.log(`[Server]: Billing Backend API is running on port ${PORT}`);
});