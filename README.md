# Bank Data App (Next.js + Supabase + Tailwind)

A ready-to-deploy web app with **Admin** and **Client** roles.

- Admin: add/edit/delete records, upload photos (PAN/Aadhaar/Card), assign to clients, search/filter/sort.
- Client: view only assigned records with a **virtual debit card** UI.
- Tech: Next.js, Tailwind, Supabase (Auth + Postgres + Storage).

## 1) Setup Supabase

1. Create a project → get `SUPABASE_URL` & `ANON_KEY`.
2. Run this SQL in the Supabase SQL editor:

```sql
-- Profiles table for roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('admin','client')) default 'client',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by users" on public.profiles
for select using (auth.uid() is not null);

create policy "user can update own profile" on public.profiles
for update using (auth.uid() = id);

-- Records table
create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  name text,
  account_no text,
  ifsc text,
  pan text,
  aadhaar text,
  mobile text,
  date text,
  card_number text,
  expiry_date text,
  cvv text,
  pan_image_url text,
  aadhaar_image_url text,
  debit_card_image_url text,
  created_at timestamp with time zone default now()
);

alter table public.records enable row level security;

-- Helper: is admin
create or replace function public.is_admin() returns boolean as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$ language sql stable;

-- RLS: admins full access
create policy "admin can do anything on records" on public.records
for all using (public.is_admin()) with check (public.is_admin());

-- RLS: clients can read only their assigned records
create policy "client can read assigned" on public.records
for select using (client_id = auth.uid());

-- Storage bucket (create from Storage UI): kyc
-- Set it to public, or keep private and use signed URLs (advanced).
```

3. **Auth: Sign-up flow**  
   - Create accounts from the Supabase Auth UI.
   - Insert a row into `public.profiles` for each user (same `id` as `auth.users.id`), set `role` to `'admin'` for your admin account, `'client'` for clients:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin' from auth.users where email = 'YOUR_ADMIN_EMAIL';

-- For clients:
insert into public.profiles (id, email, role)
select id, email, 'client' from auth.users where email = 'client@example.com';
```

4. **Storage**  
   - Create a bucket named `kyc` in Supabase Storage.
   - Optional: keep it public for simplicity (the app uses public URLs). For stricter security, switch to signed URLs and replace `getPublicUrl` with `createSignedUrl` in `RecordForm.jsx` and client display.

## 2) Local dev

```bash
npm i
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## 3) Deploy to Vercel

- Push this repo to GitHub, then Import to Vercel.
- Add the same env vars in Vercel → Project Settings → Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy. Done ✅

## Notes

- Admin Dashboard: `/admin/dashboard`
- Client Dashboard: `/client/dashboard`
- Separate login pages: `/admin-login` and `/client-login`
- Styling mimics cred.club aesthetics (dark, glass, gradients).
- You can further harden security with signed URLs and stricter RLS.
