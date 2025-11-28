export interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
}

export interface CreateInvoiceDTO {
  client_name: string;
  amount: number;
  status?: Invoice['status'];
  due_date: string;
}

export interface UpdateInvoiceDTO {
  client_name?: string;
  amount?: number;
  status?: Invoice['status'];
  due_date?: string;
}
