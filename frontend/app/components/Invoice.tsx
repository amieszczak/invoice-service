'use client';
import type { Invoice } from '@/types/invoice';
import IconButton from './IconButton';

interface InvoiceProps {
  invoice: Invoice;
  onEdit?: (invoiceId: string) => void;
  onDelete?: (invoiceId: string) => void;
  isDeleting?: boolean;
}

export default function Invoice({ invoice, onEdit, onDelete, isDeleting }: InvoiceProps) {
  return (
    <tr>
      <td>{invoice.client_name}</td>
      <td>${invoice.amount}</td>
      <td>{invoice.status}</td>
      <td>{invoice.due_date}</td>
      <td style={{ textAlign: 'right', opacity: isDeleting ? 0.5 : 1 }}>
        <IconButton 
          icon="✎" 
          onClick={() => !isDeleting && onEdit?.(invoice.id)}
          ariaLabel="Edit invoice"
        />
        <IconButton 
          icon={isDeleting ? "..." : "-"}
          onClick={() => !isDeleting && onDelete?.(invoice.id)}
          ariaLabel="Delete invoice"
        />
      </td>
    </tr>
  );
}
