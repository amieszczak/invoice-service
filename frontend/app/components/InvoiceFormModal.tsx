'use client';

import React, { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoice: Omit<Invoice, 'id' | 'created_at'>) => void;
  isSubmitting?: boolean;
  error?: string | null;
  invoice?: Invoice | null;
}

export default function InvoiceFormModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting = false,
  error: externalError = null,
  invoice = null
}: InvoiceFormModalProps) {
  const isEditMode = !!invoice;

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    client_name: '',
    amount: '',
    status: 'draft' as 'draft' | 'sent' | 'paid' | 'overdue',
    due_date: getTodayDate(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (invoice) {
        setFormData({
          client_name: invoice.client_name,
          amount: String(invoice.amount),
          status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue',
          due_date: invoice.due_date,
        });
      } else {
        
        setFormData({
          client_name: '',
          amount: '',
          status: 'draft',
          due_date: getTodayDate(),
        });
      }
      setErrors({});
    }
  }, [isOpen, invoice]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.due_date.trim()) {
      newErrors.due_date = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    onSubmit({
      client_name: formData.client_name.trim(),
      amount: Number(formData.amount),
      status: formData.status,
      due_date: formData.due_date,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          {isEditMode ? 'Edit Invoice' : 'Add New Invoice'}
        </h2>

        {externalError && (
          <div
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
            }}
          >
            {externalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="client_name" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Client <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.client_name ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            {errors.client_name && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>
                {errors.client_name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="amount" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Amount <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.amount ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            {errors.amount && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>
                {errors.amount}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="status" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="due_date" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Due Date <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.due_date ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            {errors.due_date && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>
                {errors.due_date}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: isSubmitting ? '#ccc' : '#0070f3',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting 
                ? (isEditMode ? 'Updating...' : 'Adding...') 
                : (isEditMode ? 'Update Invoice' : 'Add Invoice')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
