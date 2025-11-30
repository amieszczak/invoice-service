import { supabase } from '../supabase/client';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../schemas/invoice.schema';
import { logger } from '../utils/logger';

export interface GetAllOptions {
  sortBy?: keyof Invoice;
  ascending?: boolean;
}

export const invoiceService = {
  async getAll(options: GetAllOptions = {}): Promise<Invoice[]> {
    const { sortBy = 'created_at', ascending = false } = options;
    
    if (!supabase) {
      logger.warn('Supabase not configured. Returning empty array.');
      return [];
    }
    
    logger.info({ msg: 'Fetching invoices from Supabase', sortBy, ascending });
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order(sortBy, { ascending });
    
    if (error) {
      logger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    logger.info(`Successfully fetched ${data?.length || 0} invoices`);
    return data || [];
  },

  async create(dto: CreateInvoiceDTO): Promise<Invoice> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        ...dto,
        status: dto.status || 'draft'
      })
      .select()
      .single();
    
    if (error) {
      logger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    logger.info({ msg: 'Invoice created successfully', invoice: data });
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    logger.info({ msg: 'Deleting invoice', invoiceId: id });
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      logger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    logger.info({ msg: 'Invoice deleted successfully', invoiceId: id });
  },

  async update(id: string, dto: UpdateInvoiceDTO): Promise<Invoice> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    logger.info({ msg: 'Updating invoice', invoiceId: id, data: dto });
    const { data, error } = await supabase
      .from('invoices')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      logger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    if (!data) {
      throw new Error('Invoice not found');
    }
    
    logger.info({ msg: 'Invoice updated successfully', invoice: data });
    return data;
  }
};
