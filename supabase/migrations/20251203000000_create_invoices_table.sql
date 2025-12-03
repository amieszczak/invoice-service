create extension if not exists "uuid-ossp";

create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  amount numeric not null,
  status text check (status in ('draft', 'sent', 'paid', 'overdue')) default 'draft',
  due_date date not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_invoices_created_at on invoices(created_at desc);

create index if not exists idx_invoices_status on invoices(status);

create index if not exists idx_invoices_due_date on invoices(due_date);
