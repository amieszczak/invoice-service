'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import IconButton from './IconButton';
import InvoiceFormModal from './InvoiceFormModal';
import { Invoice } from '@/types/invoice';
import { createInvoice } from '@/integrations/supabase/createInvoice';

export default function InvoiceHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createInvoice(invoice);
      router.refresh();
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMessage);
      console.error('Error creating invoice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Invoices</h1>
        <IconButton
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
          onClick={() => setIsModalOpen(true)}
          ariaLabel="Add new invoice"
        />
      </div>
      <InvoiceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        onSubmit={handleAddInvoice}
        isSubmitting={isSubmitting}
        error={error}
      />
    </>
  );
}
