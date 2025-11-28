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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id.trim() === '') {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }
    
    await invoiceService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete invoice';
    const errorDetails = error?.details || error?.hint || error?.code || '';
    console.error('Full error details:', { message: errorMessage, details: errorDetails });
    
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
    const { id } = req.params;

    if (!id || id.trim() === '') {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    const invoice = await invoiceService.update(id, req.body);
    res.json(invoice);
  } catch(error: any) {
    console.error('Error editing invoice:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to edit invoice';
    const errorDetails = error?.details || error?.hint || error?.code || '';
    console.error('Full error details:', { message: errorMessage, details: errorDetails });
    
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
