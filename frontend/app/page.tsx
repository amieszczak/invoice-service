import { getInvoices } from '@/integrations/supabase/getInvoices';
import InvoiceList from './components/InvoiceList';
import InvoiceHeader from './components/InvoiceHeader';
import { Invoice } from '@/types/invoice';

export default async function Home() {
  let invoices: Invoice[] = [];
  let error = null;

  try {
    invoices = await getInvoices();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load invoices';
    console.error('Error loading invoices:', err);
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <InvoiceHeader />
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <InvoiceList invoices={invoices} />
      )}
    </div>
  );
}

