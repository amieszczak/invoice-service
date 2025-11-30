import { Invoice } from '@/types/invoice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch invoices: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
