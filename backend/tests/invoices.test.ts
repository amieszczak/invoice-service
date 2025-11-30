import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import invoiceRoutes from '../src/routes/invoices';
import { invoiceService } from '../src/services/invoiceService';
import { Invoice, CreateInvoiceDTO } from '../src/types/invoice';

vi.mock('../src/services/invoiceService', () => ({
  invoiceService: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use('/invoices', invoiceRoutes);

describe('Invoice Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /invoices', () => {
    it('should return list of invoices', async () => {
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          client_name: 'Test Client',
          amount: 1000,
          status: 'draft',
          due_date: '2024-12-31',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      vi.mocked(invoiceService.getAll).mockResolvedValue(mockInvoices);

      const response = await request(app)
        .get('/invoices')
        .expect(200);

      expect(response.body).toEqual(mockInvoices);
      expect(invoiceService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching invoices', async () => {
      const errorMessage = 'Database connection failed';
      vi.mocked(invoiceService.getAll).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/invoices')
        .expect(500);

      expect(response.body).toHaveProperty('error', errorMessage);
    });
  });

  describe('POST /invoices', () => {
    it('should create a new invoice', async () => {
      const createDTO: CreateInvoiceDTO = {
        client_name: 'New Client',
        amount: 2000,
        due_date: '2024-12-31',
        status: 'draft',
      };

      const mockInvoice: Invoice = {
        id: '2',
        ...createDTO,
        status: createDTO.status || 'draft',
        created_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(invoiceService.create).mockResolvedValue(mockInvoice);

      const response = await request(app)
        .post('/invoices')
        .send(createDTO)
        .expect(201);

      expect(response.body).toEqual(mockInvoice);
      expect(invoiceService.create).toHaveBeenCalledWith(createDTO);
    });

    it('should handle errors when creating invoice', async () => {
      const createDTO: CreateInvoiceDTO = {
        client_name: 'New Client',
        amount: 2000,
        due_date: '2024-12-31',
      };

      const errorMessage = 'Validation failed';
      vi.mocked(invoiceService.create).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/invoices')
        .send(createDTO)
        .expect(500);

      expect(response.body).toHaveProperty('error', errorMessage);
    });
  });

  describe('DELETE /invoices/:id', () => {
    it('should delete an invoice', async () => {
      const invoiceId = '550e8400-e29b-41d4-a716-446655440000';
      vi.mocked(invoiceService.delete).mockResolvedValue(undefined);

      await request(app)
        .delete(`/invoices/${invoiceId}`)
        .expect(204);

      expect(invoiceService.delete).toHaveBeenCalledWith(invoiceId);
    });

    it('should validate UUID format', async () => {
      const response = await request(app)
        .delete('/invoices/invalid-uuid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid');
    });

    it('should return 404 if invoice not found', async () => {
      const error: any = new Error('Invoice not found');
      error.code = 'PGRST116';
      const validUuid = '550e8400-e29b-41d4-a716-446655440001';
      vi.mocked(invoiceService.delete).mockRejectedValue(error);

      const response = await request(app)
        .delete(`/invoices/${validUuid}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Invoice not found');
    });

    it('should handle errors when deleting invoice', async () => {
      const errorMessage = 'Database error';
      const validUuid = '550e8400-e29b-41d4-a716-446655440002';
      vi.mocked(invoiceService.delete).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .delete(`/invoices/${validUuid}`)
        .expect(500);

      expect(response.body).toHaveProperty('error', errorMessage);
    });
  });

  describe('PATCH /invoices/:id', () => {
    it('should update an invoice', async () => {
      const invoiceId = '550e8400-e29b-41d4-a716-446655440003';
      const updateDTO = {
        client_name: 'Updated Client',
        amount: 3000,
      };

      const mockUpdatedInvoice: Invoice = {
        id: invoiceId,
        client_name: 'Updated Client',
        amount: 3000,
        status: 'draft',
        due_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(invoiceService.update).mockResolvedValue(mockUpdatedInvoice);

      const response = await request(app)
        .patch(`/invoices/${invoiceId}`)
        .send(updateDTO)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedInvoice);
      // Validation adds default status 'draft' if not provided
      expect(invoiceService.update).toHaveBeenCalledWith(invoiceId, {
        ...updateDTO,
        status: 'draft'
      });
    });

    it('should return 404 if invoice not found', async () => {
      const error: any = new Error('Invoice not found');
      error.code = 'PGRST116';
      const validUuid = '550e8400-e29b-41d4-a716-446655440004';
      vi.mocked(invoiceService.update).mockRejectedValue(error);

      const response = await request(app)
        .patch(`/invoices/${validUuid}`)
        .send({ client_name: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Invoice not found');
    });

    it('should handle errors when updating invoice', async () => {
      const errorMessage = 'Update failed';
      const validUuid = '550e8400-e29b-41d4-a716-446655440005';
      vi.mocked(invoiceService.update).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .patch(`/invoices/${validUuid}`)
        .send({ client_name: 'Test' })
        .expect(500);

      expect(response.body).toHaveProperty('error', errorMessage);
    });
  });
});
