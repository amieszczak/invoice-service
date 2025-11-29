import { getInvoices } from '@/integrations/supabase/getInvoices';
import InvoiceList from './components/InvoiceList';
import InvoiceHeader from './components/InvoiceHeader';
import { Invoice } from '@/types/invoice';
import styles from './page.module.css';

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
    <div className={styles.container}>
      <InvoiceHeader />
      {error ? (
        <p className={styles.error}>Error: {error}</p>
      ) : (
        <InvoiceList invoices={invoices} />
      )}
    </div>
  );
}

