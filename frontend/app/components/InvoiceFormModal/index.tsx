'use client';

import React, { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import styles from './InvoiceFormModal.module.css';

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
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>
          {isEditMode ? 'Edit Invoice' : 'Add New Invoice'}
        </h2>

        {externalError && (
          <div className={styles.errorMessage}>
            {externalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label 
              htmlFor="client_name" 
              className={styles.label}
            >
              Client <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              className={`${styles.input} ${errors.client_name ? styles.inputError : ''}`}
            />
            {errors.client_name && (
              <span className={styles.errorText}>
                {errors.client_name}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label 
              htmlFor="amount" 
              className={styles.label}
            >
              Amount <span className={styles.required}>*</span>
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
              className={`${styles.input} ${errors.amount ? styles.inputError : ''}`}
            />
            {errors.amount && (
              <span className={styles.errorText}>
                {errors.amount}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label 
              htmlFor="status" 
              className={styles.label}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className={styles.formGroupLast}>
            <label 
              htmlFor="due_date" 
              className={styles.label}
            >
              Due Date <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              className={`${styles.input} ${errors.due_date ? styles.inputError : ''}`}
            />
            {errors.due_date && (
              <span className={styles.errorText}>
                {errors.due_date}
              </span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
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
