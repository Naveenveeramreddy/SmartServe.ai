-- ServeSmart AI Full Database Schema

create extension if not exists vector;

-- Drop existing to allow clean rebuild
drop table if exists alerts cascade;
drop table if exists loyalty_points cascade;
drop table if exists payments cascade;
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists inventory cascade;
drop table if exists products cascade;
drop table if exists staff cascade;
drop table if exists customers cascade;

-- CUSTOMERS
create table customers (
    customer_id uuid default uuid_generate_v4() primary key,
    name text not null,
    face_encoding vector(128),
    wallet_balance numeric default 0.0,
    loyalty_points integer default 0,
    visit_history integer default 0,
    favorite_items text[],
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- STAFF
create table staff (
    worker_id uuid default uuid_generate_v4() primary key,
    name text not null,
    role text not null check (role in ('admin', 'waiter', 'kitchen', 'manager')),
    shift_start timestamp with time zone,
    shift_end timestamp with time zone,
    status text default 'offline',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- PRODUCTS
create table products (
    product_id uuid default uuid_generate_v4() primary key,
    product_name text not null,
    category text not null,
    price numeric not null,
    image text,
    availability boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- INVENTORY
create table inventory (
    ingredient_name text primary key,
    quantity numeric not null default 0.0,
    minimum_level numeric not null default 10.0,
    expiry_date date,
    last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- ORDERS
create table orders (
    order_id uuid default uuid_generate_v4() primary key,
    customer_id uuid references customers(customer_id),
    table_number text,
    total_amount numeric not null,
    status text check (status in ('Pending', 'Cooking', 'Ready', 'Completed', 'Cancelled')) default 'Pending',
    priority integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDER ITEMS
create table order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references orders(order_id) on delete cascade,
    product_id uuid references products(product_id),
    quantity integer not null default 1,
    price_at_time numeric not null
);

-- PAYMENTS
create table payments (
    payment_id uuid default uuid_generate_v4() primary key,
    order_id uuid references orders(order_id),
    amount numeric not null,
    payment_method text check (payment_method in ('wallet', 'cash', 'card')),
    status text default 'completed',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- LOYALTY POINTS HISTORY
create table loyalty_points (
    id uuid default uuid_generate_v4() primary key,
    customer_id uuid references customers(customer_id),
    points_added integer,
    points_redeemed integer,
    reason text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ALERTS
create table alerts (
    id uuid default uuid_generate_v4() primary key,
    type text check (type in ('low_stock', 'worker_idle', 'customer_waiting', 'security')),
    message text not null,
    is_resolved boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TRIGGERS & RLS (To be added via Supabase Dashboard or later migrations)
