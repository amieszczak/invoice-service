import { Invoice } from '@/types/invoice';

interface InvoiceListProps {
  invoices: Invoice[];
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return <p>No invoices found</p>;
  }

  return (
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
  );
}
