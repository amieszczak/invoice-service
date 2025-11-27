'use client';

import { useEffect, useState } from 'react';

interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  status: string;
  due_date: string;
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Invoices</h1>
      {invoices.length === 0 ? (
        <p>No invoices found</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.client_name}</td>
                <td>${inv.amount}</td>
                <td>{inv.status}</td>
                <td>{inv.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
