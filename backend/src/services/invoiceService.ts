import { supabase } from '../supabase/client';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../types/invoice';

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty array.');
      return [];
    }
    
    console.log('🔍 Fetching invoices from Supabase...');
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} invoices`);
    return data || [];
  },

  async create(dto: CreateInvoiceDTO): Promise<Invoice> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    console.log('Creating invoice:', dto);
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        ...dto,
        status: dto.status || 'draft'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('Invoice created successfully:', data);
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    console.log('Deleting invoice:', id);
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('Invoice deleted successfully');
  },

  async update(id: string, dto: UpdateInvoiceDTO): Promise<Invoice> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
    }
    
    console.log('Updating invoice:', id, dto);
    const { data, error } = await supabase
      .from('invoices')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    if (!data) {
      throw new Error('Invoice not found');
    }
    
    console.log('Invoice updated successfully:', data);
    return data;
  }
};
