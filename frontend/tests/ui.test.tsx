import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Invoice from '@/app/components/Invoice';
import IconButton from '@/app/components/IconButton';
import { Invoice as InvoiceType } from '@/types/invoice';

describe('UI Components', () => {
  describe('Invoice Component', () => {
    const mockInvoice: InvoiceType = {
      id: '1',
      client_name: 'Test Client',
      amount: 1000,
      status: 'draft',
      due_date: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
    };

    it('renders invoice details correctly', () => {
      render(<Invoice invoice={mockInvoice} />);

      expect(screen.getByText('Test Client')).toBeInTheDocument();
      expect(screen.getByText('$1000')).toBeInTheDocument();
      expect(screen.getByText('draft')).toBeInTheDocument();
      expect(screen.getByText('2024-12-31')).toBeInTheDocument();
    });

    it('displays different statuses correctly', () => {
      const paidInvoice = { ...mockInvoice, status: 'paid' as const };
      const { rerender } = render(<Invoice invoice={paidInvoice} />);
      expect(screen.getByText('paid')).toBeInTheDocument();

      const sentInvoice = { ...mockInvoice, status: 'sent' as const };
      rerender(<Invoice invoice={sentInvoice} />);
      expect(screen.getByText('sent')).toBeInTheDocument();

      const overdueInvoice = { ...mockInvoice, status: 'overdue' as const };
      rerender(<Invoice invoice={overdueInvoice} />);
      expect(screen.getByText('overdue')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<Invoice invoice={mockInvoice} onEdit={onEdit} />);

      const editButton = screen.getByLabelText('Edit invoice');
      await user.click(editButton);

      expect(onEdit).toHaveBeenCalledWith('1');
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<Invoice invoice={mockInvoice} onDelete={onDelete} />);

      const deleteButton = screen.getByLabelText('Delete invoice');
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith('1');
    });

    it('disables buttons when isDeleting is true', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      render(
        <Invoice 
          invoice={mockInvoice} 
          onEdit={onEdit} 
          onDelete={onDelete}
          isDeleting={true}
        />
      );

      const editButton = screen.getByLabelText('Edit invoice');
      const deleteButton = screen.getByLabelText('Delete invoice');

      await user.click(editButton);
      await user.click(deleteButton);

      expect(onEdit).not.toHaveBeenCalled();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it('shows loading indicator when deleting', () => {
      render(<Invoice invoice={mockInvoice} isDeleting={true} />);
      
      const deleteButton = screen.getByLabelText('Delete invoice');
      expect(deleteButton).toHaveTextContent('...');
    });
  });

  describe('IconButton Component', () => {
    it('renders with correct icon', () => {
      render(<IconButton icon="✎" ariaLabel="Test button" onClick={() => {}} />);
      expect(screen.getByLabelText('Test button')).toHaveTextContent('✎');
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<IconButton icon="+" onClick={onClick} ariaLabel="Add button" />);

      const button = screen.getByLabelText('Add button');
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility attributes', () => {
      render(<IconButton icon="✎" ariaLabel="Edit" onClick={() => {}} />);
      const button = screen.getByLabelText('Edit');
      
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });
});
