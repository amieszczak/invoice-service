import { z } from 'zod';

export const invoiceStatusEnum = z.enum(['draft', 'sent', 'paid', 'overdue']).default('draft');

export const invoiceSchema = z.object({
  id: z.string(),
  client_name: z.string().min(1, 'Client name is required'),
  amount: z.number().positive('Amount must be a positive number'),
  status: invoiceStatusEnum,
  due_date: z.string().min(1, 'Due date is required'),
  created_at: z.string(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export const createInvoiceDTOSchema = invoiceSchema.omit({ id: true, created_at: true });

export const updateInvoiceDTOSchema = invoiceSchema
  .omit({ id: true, created_at: true })
  .partial();

export type CreateInvoiceDTO = z.infer<typeof createInvoiceDTOSchema>;

export type UpdateInvoiceDTO = z.infer<typeof updateInvoiceDTOSchema>;
