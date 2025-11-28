import { Invoice } from '@/types/invoice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function editInvoice(
  id: string,
  invoice: Partial<Omit<Invoice, 'id' | 'created_at'>>
): Promise<Invoice> {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to edit invoice: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error editing invoice:', error);
    throw error;
  }
}
