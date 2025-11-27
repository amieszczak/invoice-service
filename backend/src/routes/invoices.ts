import { Router } from 'express';
import { invoiceService } from '../services/invoiceService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const invoices = await invoiceService.getAll();
    res.json(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invoices';
    const errorDetails = error?.details || error?.hint || error?.code || '';
    console.error('Full error details:', { message: errorMessage, details: errorDetails });
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails || undefined
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const invoice = await invoiceService.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create invoice';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
