'use client';
import type { Invoice } from '@/types/invoice';
import IconButton from '../IconButton';
import styles from './Invoice.module.css';

interface InvoiceProps {
  invoice: Invoice;
  onEdit?: (invoiceId: string) => void;
  onDelete?: (invoiceId: string) => void;
  isDeleting?: boolean;
}

export default function Invoice({ invoice, onEdit, onDelete, isDeleting }: InvoiceProps) {
  const cellData = [
    { key: 'client_name', value: invoice.client_name },
    { key: 'amount', value: `$${invoice.amount}` },
    { key: 'status', value: invoice.status },
    { key: 'due_date', value: invoice.due_date },
  ];

  const getStatusClass = () => {
    switch (invoice.status) {
      case 'sent':
        return styles.statusSent;
      case 'paid':
        return styles.statusPaid;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return '';
    }
  };

  return (
    <tr className={getStatusClass()}>
      {cellData.map((cell) => (
        <td key={cell.key}>
          {cell.value}
        </td>
      ))}
      <td className={`${styles.actionsCell} ${isDeleting ? styles.actionsCellDeleting : ''}`}>
        <div className={styles.buttonContainer}>
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
        </div>
      </td>
    </tr>
  );
}
