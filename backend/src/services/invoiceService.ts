import { supabase } from '../supabase/client';
import { Invoice, CreateInvoiceDTO } from '../types/invoice';

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    if (!supabase) {
      console.warn('⚠️  Supabase not configured. Returning empty array.');
      return [];
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
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
    
    if (error) throw error;
    return data;
  }
};
