const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function deleteInvoice(invoiceId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to delete invoice: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}
