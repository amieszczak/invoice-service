'use client';
import type { Invoice } from '@/types/invoice';
import IconButton from '../IconButton';
import ActionDropdown, { DropdownAction } from '../ActionDropdown';
import styles from './Invoice.module.css';

interface InvoiceProps {
  invoice: Invoice;
  onEdit?: (invoiceId: string) => void;
  onDelete?: (invoiceId: string) => void;
  isDeleting?: boolean;
  expandedColumn?: string | null;
}

export default function Invoice({ invoice, onEdit, onDelete, isDeleting, expandedColumn }: InvoiceProps) {
  const cellData = [
    { key: 'client', value: invoice.client_name },
    { key: 'amount', value: `$${invoice.amount}` },
    { key: 'status', value: invoice.status },
    { key: 'due_date', value: invoice.due_date },
  ];

  const actionButtons = [
    {
      key: 'edit',
      icon: '✎',
      label: 'Edit',
      onClick: () => !isDeleting && onEdit?.(invoice.id),
      ariaLabel: 'Edit invoice'
    },
    {
      key: 'delete',
      icon: isDeleting ? '...' : '-',
      label: 'Delete',
      onClick: () => !isDeleting && onDelete?.(invoice.id),
      ariaLabel: 'Delete invoice'
    }
  ];

  const dropdownActions: DropdownAction[] = actionButtons.map(action => ({
    key: action.key,
    icon: action.icon,
    label: action.label,
    onClick: action.onClick
  }));

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
        <td 
          key={cell.key}
          className={expandedColumn === cell.key ? styles.expandedCell : ''}
          style={{
            width: expandedColumn && expandedColumn !== cell.key ? '1%' : undefined
          }}
        >
          {cell.value}
        </td>
      ))}
      <td className={`${styles.actionsCell} ${isDeleting ? styles.actionsCellDeleting : ''}`}>
        <div className={styles.buttonContainer}>
          {actionButtons.map((action) => (
            <IconButton 
              key={action.key}
              icon={action.icon}
              onClick={action.onClick}
              ariaLabel={action.ariaLabel}
              className={styles.individualButton}
            />
          ))}
        </div>
        
        <div className={styles.dropdownContainer}>
          <ActionDropdown actions={dropdownActions} disabled={isDeleting} />
        </div>
      </td>
    </tr>
  );
}
