import { supabase } from '../supabase/client';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../schemas/invoice.schema';
import { pinoLogger } from '../middleware/logger';

export interface GetAllOptions {
  sortBy?: keyof Invoice;
  ascending?: boolean;
}

export const invoiceService = {
  async getAll(options: GetAllOptions = {}): Promise<Invoice[]> {
    const { sortBy = 'created_at', ascending = false } = options;
    
    if (!supabase) {
      pinoLogger.warn('Supabase not configured. Returning empty array.');
      return [];
    }
    
    pinoLogger.info({ msg: 'Fetching invoices from Supabase', sortBy, ascending });
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order(sortBy, { ascending });
    
    if (error) {
      pinoLogger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    pinoLogger.info(`Successfully fetched ${data?.length || 0} invoices`);
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
      pinoLogger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    pinoLogger.info({ msg: 'Invoice created successfully', invoice: data });
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    pinoLogger.info({ msg: 'Deleting invoice', invoiceId: id });
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      pinoLogger.error({
        msg: 'Supabase error',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    pinoLogger.info({ msg: 'Invoice deleted successfully', invoiceId: id });
  },

  async update(id: string, dto: UpdateInvoiceDTO): Promise<Invoice> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    pinoLogger.info({ msg: 'Updating invoice', invoiceId: id, data: dto });
    const { data, error } = await supabase
      .from('invoices')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      pinoLogger.error({
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
    
    pinoLogger.info({ msg: 'Invoice updated successfully', invoice: data });
    return data;
  }
};
