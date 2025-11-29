'use client';

import { Invoice as InvoiceType } from '@/types/invoice';
import Invoice from '../Invoice';
import { deleteInvoice } from '@/integrations/supabase/deleteInvoice';
import { editInvoice } from '@/integrations/supabase/editInvoice';
import InvoiceFormModal from '../InvoiceFormModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './InvoiceList.module.css';

interface InvoiceListProps {
  invoices: InvoiceType[];
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedColumn, setExpandedColumn] = useState<string | null>(null);

  const tableHeaders = [
    { key: 'client', label: 'Client', className: '' },
    { key: 'amount', label: 'Amount', className: '' },
    { key: 'status', label: 'Status', className: '' },
    { key: 'due_date', label: 'Due Date', className: '' },
    { key: 'actions', label: 'Actions', className: styles.actionsHeader },
  ];

  const handleColumnClick = (columnKey: string) => {
    if (columnKey === 'actions') return;
    setExpandedColumn(expandedColumn === columnKey ? null : columnKey);
  };

  const handleDelete = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    setIsDeleting(invoiceId);
    try {
      await deleteInvoice(invoiceId);
      router.refresh();
    } catch (error) {
      alert('Failed to delete invoice. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setEditingInvoice(invoice);
      setIsEditModalOpen(true);
      setError(null);
    }
  };

  const handleEditSubmit = async (invoiceData: Omit<InvoiceType, 'id' | 'created_at'>) => {
    if (!editingInvoice) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await editInvoice(editingInvoice.id, invoiceData);
      router.refresh();
      setIsEditModalOpen(false);
      setEditingInvoice(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      setError(errorMessage);
      console.error('Error updating invoice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (invoices.length === 0) {
    return <p>No invoices found</p>;
  }

  return (
    <>
      <div className={styles.infoBadge}>
        {expandedColumn 
          ? 'Tap the column header to collapse' 
          : 'Tap the column header to expand'}
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th 
                key={header.key} 
                className={`${header.className} ${
                  header.key !== 'actions' ? styles.clickableHeader : ''
                } ${expandedColumn === header.key ? styles.expandedColumn : ''}`}
                onClick={() => handleColumnClick(header.key)}
                style={{ 
                  cursor: header.key !== 'actions' ? 'pointer' : 'default',
                  width: expandedColumn && expandedColumn !== header.key && header.key !== 'actions' ? '1%' : undefined
                }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <Invoice 
              key={inv.id} 
              invoice={inv}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting === inv.id}
              expandedColumn={expandedColumn}
            />
          ))}
        </tbody>
      </table>
      
      <InvoiceFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingInvoice(null);
          setError(null);
        }}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
        error={error}
        invoice={editingInvoice}
      />
    </>
  );
}
