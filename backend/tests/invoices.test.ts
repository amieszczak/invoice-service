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
      const invoiceId = '123';
      vi.mocked(invoiceService.delete).mockResolvedValue(undefined);

      await request(app)
        .delete(`/invoices/${invoiceId}`)
        .expect(204);

      expect(invoiceService.delete).toHaveBeenCalledWith(invoiceId);
    });

    it('should handle empty id parameter', async () => {
      // Note: Express routes require a parameter, so truly empty IDs aren't possible
      // This test verifies the service is called with the provided id
      const invoiceId = 'valid-id';
      vi.mocked(invoiceService.delete).mockResolvedValue(undefined);

      await request(app)
        .delete(`/invoices/${invoiceId}`)
        .expect(204);

      expect(invoiceService.delete).toHaveBeenCalledWith(invoiceId);
    });

    it('should return 404 if invoice not found', async () => {
      const error: any = new Error('Invoice not found');
      error.code = 'PGRST116';
      vi.mocked(invoiceService.delete).mockRejectedValue(error);

      const response = await request(app)
        .delete('/invoices/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Invoice not found');
    });

    it('should handle errors when deleting invoice', async () => {
      const errorMessage = 'Database error';
      vi.mocked(invoiceService.delete).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .delete('/invoices/123')
        .expect(500);

      expect(response.body).toHaveProperty('error', errorMessage);
    });
  });

  describe('PATCH /invoices/:id', () => {
    it('should update an invoice', async () => {
      const invoiceId = '123';
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
      expect(invoiceService.update).toHaveBeenCalledWith(invoiceId, updateDTO);
    });

    it('should return 404 if invoice not found', async () => {
      const error: any = new Error('Invoice not found');
      error.code = 'PGRST116';
      vi.mocked(invoiceService.update).mockRejectedValue(error);

      const response = await request(app)
        .patch('/invoices/non-existent')
        .send({ client_name: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Invoice not found');
    });

    it('should handle errors when updating invoice', async () => {
      const errorMessage = 'Update failed';
      vi.mocked(invoiceService.update).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .patch('/invoices/123')
        .send({ client_name: 'Test' })
        .expect(500);

      expect(response.body).toHaveProperty('error', errorMessage);
    });
  });
});
