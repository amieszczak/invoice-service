import { z } from 'zod';
import { createInvoiceDTOSchema, updateInvoiceDTOSchema } from '../../schemas/invoice.schema';

export const createInvoiceSchema = createInvoiceDTOSchema;

export const updateInvoiceSchema = updateInvoiceDTOSchema.strict();

export const deleteInvoiceParamsSchema = z.object({
  id: z.string().uuid('Invoice ID must be a valid UUID').min(1, 'Invoice ID is required'),
});

export const getAllQuerySchema = z.object({
  sortBy: z.enum(['id', 'client_name', 'amount', 'status', 'due_date', 'created_at']).optional(),
  ascending: z.enum(['true', 'false']).optional(),
});
