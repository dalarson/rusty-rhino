create table public.inventory (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text not null,
    price double precision not null,
    img_url text,
    before_img_urls text[] not null default '{}',
    after_img_urls text[] not null default '{}',
    sold boolean not null default false,
    type text not null
);

create table public.interest (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    phone text,
    message text,
    inventory_item_id text,
    created_at bigint not null
);

-- The API connects directly as a privileged role; enabling RLS with no policies
-- blocks all access through Supabase's public anon/authenticated REST API.
alter table public.inventory enable row level security;
alter table public.interest enable row level security;

insert into storage.buckets (id, name, public)
values ('img', 'img', true)
on conflict (id) do nothing;
