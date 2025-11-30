import { Router } from 'express';
import { z } from 'zod';
import { invoiceService } from '../services/invoiceService';
import { createInvoiceSchema, updateInvoiceSchema, deleteInvoiceParamsSchema, getAllQuerySchema } from './validation/invoiceRequestValidation';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const validatedQuery = getAllQuerySchema.parse(req.query);
    
    const invoices = await invoiceService.getAll({ 
      sortBy: validatedQuery.sortBy, 
      ascending: validatedQuery.ascending === 'true' ? true : false
    });
    res.json(invoices);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn({
        msg: 'Validation failed for query parameters',
        issues: error.issues
      });
      
      return res.status(400).json({ 
        error: 'Invalid query parameters',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invoices';
    const errorDetails = error?.details || error?.hint || error?.code || '';
    
    logger.error({
      msg: 'Error fetching invoices',
      error: errorMessage,
      details: errorDetails,
      stack: error?.stack
    });
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails || undefined
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const validatedData = createInvoiceSchema.parse(req.body);
    
    const invoice = await invoiceService.create(validatedData);
    res.status(201).json(invoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({
        msg: 'Validation failed for invoice creation',
        issues: error.issues
      });
      
      return res.status(400).json({ 
        error: 'Invalid invoice data',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create invoice';
    logger.error({
      msg: 'Error creating invoice',
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    res.status(500).json({ error: errorMessage });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = deleteInvoiceParamsSchema.parse(req.params);
    
    await invoiceService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn({
        msg: 'Validation failed for invoice deletion',
        issues: error.issues
      });
      
      return res.status(400).json({ 
        error: 'Invalid invoice ID',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete invoice';
    const errorDetails = error?.details || error?.hint || error?.code || '';
    
    logger.error({
      msg: 'Error deleting invoice',
      invoiceId: req.params.id,
      error: errorMessage,
      details: errorDetails,
      code: error?.code,
      stack: error?.stack
    });
    
    if (error?.code === 'PGRST116' || errorMessage.includes('not found')) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        details: errorDetails || undefined
      });
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails || undefined
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = deleteInvoiceParamsSchema.parse(req.params);
    const validatedData = updateInvoiceSchema.parse(req.body);

    const invoice = await invoiceService.update(id, validatedData);
    res.json(invoice);
  } catch(error: any) {
    if (error instanceof z.ZodError) {
      logger.warn({
        msg: 'Validation failed for invoice update',
        issues: error.issues
      });
      
      return res.status(400).json({ 
        error: 'Invalid invoice data',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to edit invoice';
    const errorDetails = error?.details || error?.hint || error?.code || '';
    
    logger.error({
      msg: 'Error editing invoice',
      invoiceId: req.params.id,
      error: errorMessage,
      details: errorDetails,
      code: error?.code,
      stack: error?.stack
    });
    
    if (error?.code === 'PGRST116' || errorMessage.includes('not found')) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        details: errorDetails || undefined
      });
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails || undefined
    });
  }  
})

export default router;
