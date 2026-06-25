import { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Plus, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  X, 
  FileText, 
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

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

interface Stats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  activeSubscriptionsCount: number;
  monthlySpend: number;
}

export default function App() {
  // Theme state
  const [isLightMode, setIsLightMode] = useState(false);

  // API Data
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    activeSubscriptionsCount: 0,
    monthlySpend: 0
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
  // Modals
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isPayInvoiceOpen, setIsPayInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [newClientName, setNewClientName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newLineItems, setNewLineItems] = useState<LineItem[]>([
    { name: '', quantity: 1, price: 0 }
  ]);

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Apply theme class
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetches
      const [statsRes, invoicesRes, subsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/invoices'),
        fetch('/api/subscriptions')
      ]);

      if (!statsRes.ok || !invoicesRes.ok || !subsRes.ok) {
        throw new Error('Failed to fetch from backend API.');
      }

      const statsData = await statsRes.json();
      const invoicesData = await invoicesRes.json();
      const subsData = await subsRes.json();

      setStats(statsData);
      setInvoices(invoicesData);
      setSubscriptions(subsData);
    } catch (err: any) {
      console.warn('Backend API connection failed, falling back to mock client-side state.', err);
      // Fallback local mock data so the app runs standalone
      loadMockFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMockFallback = () => {
    const mockInvoices: Invoice[] = [
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

    const mockSubs: Subscription[] = [
      { id: 'sub_1', name: 'AWS Cloud Infrastructure', cost: 950.00, billingCycle: 'monthly', usageLimit: 5000, usageCurrent: 3820, usageUnit: 'GB Transfer' },
      { id: 'sub_2', name: 'GitHub Enterprise Grid', cost: 320.00, billingCycle: 'monthly', usageLimit: 50, usageCurrent: 44, usageUnit: 'Seat Licenses' },
      { id: 'sub_3', name: 'Slack Communication Hub', cost: 150.00, billingCycle: 'monthly', usageLimit: 100, usageCurrent: 85, usageUnit: 'Active Users' },
      { id: 'sub_4', name: 'OpenAI API Usage', cost: 450.00, billingCycle: 'monthly', usageLimit: 1000, usageCurrent: 780, usageUnit: 'USD Credits' }
    ];

    setInvoices(mockInvoices);
    setSubscriptions(mockSubs);
    recalculateStats(mockInvoices, mockSubs);
  };

  const recalculateStats = (invs: Invoice[], subs: Subscription[]) => {
    const totalPaid = invs.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const totalPending = invs.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
    const totalOverdue = invs.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const monthlySpend = subs.reduce((sum, sub) => sum + sub.cost, 0);
    
    setStats({
      totalPaid,
      totalPending,
      totalOverdue,
      activeSubscriptionsCount: subs.length,
      monthlySpend
    });
  };

  // Payment Handler
  const handlePayInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setPaymentLoading(true);
    try {
      const response = await fetch(`/api/invoices/${selectedInvoice.id}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Payment request failed.');

      // Refresh from API
      await fetchData();
      setIsPayInvoiceOpen(false);
      setSelectedInvoice(null);
      resetPaymentForm();
    } catch (err) {
      console.warn('Backend payment failed, applying client-side state fallback.');
      
      // Fallback
      const updatedInvoices = invoices.map(inv => {
        if (inv.id === selectedInvoice.id) {
          return { ...inv, status: 'paid' as const };
        }
        return inv;
      });
      setInvoices(updatedInvoices);
      recalculateStats(updatedInvoices, subscriptions);
      setIsPayInvoiceOpen(false);
      setSelectedInvoice(null);
      resetPaymentForm();
    } finally {
      setPaymentLoading(false);
    }
  };

  const resetPaymentForm = () => {
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  // Invoice Form line items handlers
  const handleAddLineItem = () => {
    setNewLineItems([...newLineItems, { name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (newLineItems.length > 1) {
      setNewLineItems(newLineItems.filter((_, i) => i !== index));
    }
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = newLineItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setNewLineItems(updated);
  };

  // Calculate Invoice Form total
  const formTotalAmount = newLineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Submit Invoice Handler
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newDueDate) {
      alert('Please fill in required fields.');
      return;
    }

    const payload = {
      clientName: newClientName,
      amount: formTotalAmount,
      dueDate: newDueDate,
      description: newDescription,
      lineItems: newLineItems.filter(item => item.name.trim() !== '')
    };

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Create invoice failed.');

      await fetchData();
      setIsNewInvoiceOpen(false);
      resetInvoiceForm();
    } catch (err) {
      console.warn('Backend create invoice failed, applying client-side state fallback.');
      
      const newId = String(Date.now());
      const nextNum = invoices.length + 1;
      const invoiceNumber = `INV-2026-${String(nextNum).padStart(3, '0')}`;
      const fallbackInvoice: Invoice = {
        id: newId,
        invoiceNumber,
        clientName: newClientName,
        amount: formTotalAmount,
        dueDate: newDueDate,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: newDescription,
        lineItems: newLineItems.filter(item => item.name.trim() !== '')
      };

      const updatedInvoices = [fallbackInvoice, ...invoices];
      setInvoices(updatedInvoices);
      recalculateStats(updatedInvoices, subscriptions);
      setIsNewInvoiceOpen(false);
      resetInvoiceForm();
    }
  };

  const resetInvoiceForm = () => {
    setNewClientName('');
    setNewDescription('');
    setNewDueDate('');
    setNewLineItems([{ name: '', quantity: 1, price: 0 }]);
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-section">
          <span className="logo-icon"><CreditCard size={26} /></span>
          <span>AeroBill</span>
        </div>
        <div className="nav-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsNewInvoiceOpen(true)}
          >
            <Plus size={16} /> New Invoice
          </button>
          <button 
            className="btn-circle"
            onClick={() => setIsLightMode(!isLightMode)}
            aria-label="Toggle Theme"
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="main-content">
        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Monthly Spend</h3>
              <div className="stat-value">${stats.monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-icon-wrapper">
              <TrendingUp size={22} />
            </div>
          </div>
          
          <div className="stat-card paid">
            <div className="stat-info">
              <h3>Total Paid</h3>
              <div className="stat-value">${stats.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-icon-wrapper">
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-info">
              <h3>Outstanding</h3>
              <div className="stat-value">${stats.totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-icon-wrapper">
              <Clock size={22} />
            </div>
          </div>

          <div className="stat-card overdue">
            <div className="stat-info">
              <h3>Overdue</h3>
              <div className="stat-value">${stats.totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-icon-wrapper">
              <AlertTriangle size={22} />
            </div>
          </div>
        </section>

        {/* Dashboard Split Widgets */}
        <section className="dashboard-row">
          {/* Custom SVG Trend Chart */}
          <div className="widget-card">
            <div className="widget-header">
              <h2 className="widget-title"><TrendingUp size={18} className="text-primary" /> Billing Trend (First Half 2026)</h2>
              <span className="badge badge-paid"><Sparkles size={12} /> Projected Analytics</span>
            </div>
            
            {/* Custom Interactive SVG Chart */}
            <div style={{ position: 'relative', height: '220px', width: '100%', marginTop: '1rem' }}>
              <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="50%" stopColor="#8b5cf6"/>
                    <stop offset="100%" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="var(--border-color)" strokeWidth="1" />

                {/* Area path */}
                <path 
                  d="M 10 190 L 10 150 Q 100 130 110 110 Q 200 90 210 130 Q 300 170 310 90 Q 400 40 410 70 L 490 50 L 490 190 Z" 
                  fill="url(#chartGradient)" 
                />

                {/* Line path */}
                <path 
                  d="M 10 150 Q 100 130 110 110 Q 200 90 210 130 Q 300 170 310 90 Q 400 40 410 70 L 490 50" 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="10" cy="150" r="5" fill="#6366f1" stroke="var(--bg-secondary)" strokeWidth="2" />
                <circle cx="110" cy="110" r="5" fill="#6366f1" stroke="var(--bg-secondary)" strokeWidth="2" />
                <circle cx="210" cy="130" r="5" fill="#8b5cf6" stroke="var(--bg-secondary)" strokeWidth="2" />
                <circle cx="310" cy="90" r="5" fill="#8b5cf6" stroke="var(--bg-secondary)" strokeWidth="2" />
                <circle cx="410" cy="70" r="5" fill="#ec4899" stroke="var(--bg-secondary)" strokeWidth="2" />
                <circle cx="490" cy="50" r="5" fill="#ec4899" stroke="var(--bg-secondary)" strokeWidth="2" />

                {/* Month labels */}
                <text x="10" y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Jan</text>
                <text x="110" y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Feb</text>
                <text x="210" y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Mar</text>
                <text x="310" y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Apr</text>
                <text x="410" y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">May</text>
                <text x="490" y="215" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Jun</text>
              </svg>
            </div>
          </div>

          {/* Active SaaS Subscriptions Widget */}
          <div className="widget-card">
            <div className="widget-header">
              <h2 className="widget-title"><Layers size={18} className="text-primary" /> Quota &amp; Services</h2>
              <span className="badge badge-pending">Active Limits</span>
            </div>
            
            <div className="subscription-list">
              {subscriptions.length > 0 ? (
                subscriptions.map(sub => {
                  const percent = Math.min(100, Math.round((sub.usageCurrent / sub.usageLimit) * 100));
                  return (
                    <div key={sub.id} className="subscription-item">
                      <div className="sub-meta">
                        <span className="sub-title">{sub.name}</span>
                        <span className="sub-cost">${sub.cost.toFixed(2)} / mo</span>
                      </div>
                      <div className="sub-usage">
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="usage-text">
                          <span>Usage: {sub.usageCurrent} / {sub.usageLimit} {sub.usageUnit}</span>
                          <span>{percent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-muted">No subscriptions active</div>
              )}
            </div>
          </div>
        </section>

        {/* Invoice Management Area */}
        <section className="invoice-section">
          <div className="widget-header">
            <h2 className="widget-title"><FileText size={18} className="text-primary" /> Invoice Ledger</h2>
          </div>
          
          <div className="invoice-controls">
            {/* Search */}
            <div className="search-input-wrapper">
              <span className="search-icon"><Search size={16} /></span>
              <input 
                type="text" 
                placeholder="Search invoices by recipient, number, item..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="filter-group">
              <button 
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
                onClick={() => setStatusFilter('paid')}
              >
                Paid
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'overdue' ? 'active' : ''}`}
                onClick={() => setStatusFilter('overdue')}
              >
                Overdue
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            {loading ? (
              <div className="text-center py-4 text-primary">
                <span className="loading-spinner"></span>
                <div className="mt-2">Connecting to AeroBill API...</div>
              </div>
            ) : filteredInvoices.length > 0 ? (
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Client Name</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td><span className="invoice-number">{inv.invoiceNumber}</span></td>
                      <td>{inv.clientName}</td>
                      <td>{inv.issueDate}</td>
                      <td>{inv.dueDate}</td>
                      <td style={{ fontWeight: 700 }}>${inv.amount.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${inv.status}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="action-cell">
                        {inv.status !== 'paid' ? (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPayInvoiceOpen(true);
                            }}
                          >
                            <CreditCard size={12} /> Pay
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle2 size={12} /> Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4 text-muted">No invoices found matching query.</div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '2rem 1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        © 2026 AeroBill Global Inc. Running securely on Container-Isolated sandbox environments.
      </footer>

      {/* MODAL 1: Create Invoice */}
      {isNewInvoiceOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Draft New Invoice</h2>
              <button className="btn-circle" onClick={() => setIsNewInvoiceOpen(false)} style={{ width: '30px', height: '30px' }}>
                <X size={14} />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Client Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Stark Industries" 
                  className="form-input"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date *</label>
                  <input 
                    type="date" 
                    className="form-input"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Client Reference ID</label>
                  <input type="text" placeholder="e.g. REF-4482" className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Scope of Work</label>
                <input 
                  type="text" 
                  placeholder="Describe context of invoice" 
                  className="form-input"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              {/* Line Items builder */}
              <div className="form-group">
                <label>Line Items</label>
                <div className="line-items-builder">
                  {newLineItems.map((item, idx) => (
                    <div key={idx} className="line-item-row">
                      <input 
                        type="text" 
                        placeholder="Item Description" 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        value={item.name}
                        onChange={(e) => handleLineItemChange(idx, 'name', e.target.value)}
                      />
                      <input 
                        type="number" 
                        placeholder="Qty" 
                        min="1" 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                      />
                      <input 
                        type="number" 
                        placeholder="Price" 
                        step="0.01" 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        value={item.price}
                        onChange={(e) => handleLineItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem', borderRadius: '6px' }}
                        onClick={() => handleRemoveLineItem(idx)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ alignSelf: 'flex-start', padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '0.25rem' }}
                    onClick={handleAddLineItem}
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Total Dynamic Amount:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>${formTotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewInvoiceOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Pay Invoice */}
      {isPayInvoiceOpen && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>Secure Checkout</h2>
              <button className="btn-circle" onClick={() => { setIsPayInvoiceOpen(false); setSelectedInvoice(null); }} style={{ width: '30px', height: '30px' }}>
                <X size={14} />
              </button>
            </div>
            
            <div className="credit-card-preview">
              <div className="cc-header">
                <span>AeroBill Card</span>
                <CreditCard size={20} />
              </div>
              <div className="cc-number">
                {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
              </div>
              <div className="cc-footer">
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Card Holder</div>
                  <div style={{ fontWeight: 600 }}>Billing Admin</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Expires</div>
                  <div style={{ fontWeight: 600 }}>{cardExpiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.25rem' }}>
              <span className="text-secondary">Amount Due:</span>
              <strong style={{ fontSize: '1.15rem' }}>${selectedInvoice.amount.toFixed(2)}</strong>
            </div>

            <form onSubmit={handlePayInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  maxLength={16} 
                  placeholder="4111 2222 3333 4444" 
                  className="form-input"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    maxLength={5} 
                    placeholder="MM/YY" 
                    className="form-input"
                    required
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.length === 2 && !val.includes('/')) val += '/';
                      setCardExpiry(val);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    maxLength={3} 
                    placeholder="•••" 
                    className="form-input"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  disabled={paymentLoading}
                  onClick={() => { setIsPayInvoiceOpen(false); setSelectedInvoice(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <span className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span> 
                      Processing...
                    </>
                  ) : (
                    `Pay $${selectedInvoice.amount.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
