create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text default 'free' check (plan in ('free','pro','enterprise')),
  primary_currency text default 'USD',
  created_at timestamptz default now()
);

create table family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member' check (role in ('owner','admin','member','viewer')),
  display_name text,
  avatar_url text,
  joined_at timestamptz default now(),
  unique(family_id, user_id)
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  name text not null,
  type text check (type in ('income','expense','savings','investment')),
  icon text,
  color text,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  member_id uuid references family_members(id),
  category_id uuid references categories(id),
  type text not null check (type in ('income','expense','savings','investment','transfer')),
  amount decimal(15,2) not null,
  currency text not null default 'USD',
  amount_usd decimal(15,2),
  description text,
  date date not null default current_date,
  tags text[],
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  category_id uuid references categories(id),
  amount decimal(15,2) not null,
  currency text default 'USD',
  period_month int check (period_month between 1 and 12),
  period_year int,
  created_at timestamptz default now(),
  unique(family_id, category_id, period_month, period_year)
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  name text not null,
  description text,
  target_amount decimal(15,2) not null,
  current_amount decimal(15,2) default 0,
  currency text default 'USD',
  target_date date,
  icon text,
  color text,
  status text default 'active' check (status in ('active','completed','paused','cancelled')),
  created_at timestamptz default now()
);

create table goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references goals(id) on delete cascade,
  amount decimal(15,2) not null,
  note text,
  date date default current_date,
  created_at timestamptz default now()
);

alter table families enable row level security;
alter table family_members enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table goals enable row level security;
alter table goal_contributions enable row level security;

create policy "solo miembros" on families for all using (id in (select family_id from family_members where user_id = auth.uid()));
create policy "solo miembros" on family_members for all using (family_id in (select family_id from family_members where user_id = auth.uid()));
create policy "solo miembros" on categories for all using (family_id in (select family_id from family_members where user_id = auth.uid()));
create policy "solo miembros" on transactions for all using (family_id in (select family_id from family_members where user_id = auth.uid()));
create policy "solo miembros" on budgets for all using (family_id in (select family_id from family_members where user_id = auth.uid()));
create policy "solo miembros" on goals for all using (family_id in (select family_id from family_members where user_id = auth.uid()));
create policy "solo miembros" on goal_contributions for all using (goal_id in (select id from goals where family_id in (select family_id from family_members where user_id = auth.uid())));
