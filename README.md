# dead.croco — Workforce Management Platform

> **Official Tagline:** BE DEAD LIKE CROCO  
> **Mission & Theme:** Decent work, employee empowerment, workplace safety, and salary transparency (Aligned with UN Sustainable Development Goal 8).

---

## 🐊 Overview

**dead.croco** is a modern, responsive, non-exploitative workforce management platform designed specifically for frontline workers in high-risk, vulnerable sectors—including construction sites, college and campus facilities, factories, and healthcare environments.

### Core Pillars
1. **Smart Shift Tracking:** Touch-friendly mobile check-in/out with location verification, transparent time tracking, and automatic 1.5× overtime calculation.
2. **Transparent Payslips:** Step-by-step mathematical wage breakdown showing base pay, overtime bonuses, and itemized statutory deductions. Downloadable/printable official slips.
3. **Safety Hazard Reporting:** Instant hazard escalation with photo attachments, permanent ticket IDs (`DC-SAF-XXXX`), zero-retaliation protection, and live progress tracking from Submission to Resolution.
4. **Anonymous Feedback:** Cryptographically segregated feedback channel protecting workers from foreman retaliation.
5. **Digital Skill Passport:** Portable, accredited competency passports displaying verified skills, OSHA safety certifications, and audited field hours.
6. **Rule-Based Fatigue Monitoring:** Proactive administrator alerts identifying excessive single shifts (>10h), insufficient rest intervals (<11h between shifts), and heavy weekly cumulative workload (>50h).

---

## 🛠️ Technology Stack

- **Frontend:** React 19 with TypeScript
- **Styling:** Tailwind CSS v4 & custom SaaS theme (Pale green `#d8f3dc`, Forest green `#1b4332`, White, and Deep Black `#0f291e`)
- **Visualizations:** Recharts
- **Icons:** Lucide React
- **Persistence & Backend:** Supabase / PostgreSQL schema with seamless local demo persistence (`localStorage`) and state synchronization.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- npm or bun

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment configurations:
```env
# Optional Supabase Connection (Platform runs in fully hydrated Offline Demo mode if not provided)
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI Studio App Hosting URL
APP_URL="http://localhost:3000"
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Run development server (on port 3000)
npm run dev

# Run automated logic and rule unit tests
npx --yes tsx --test src/utils/rules.test.ts

# Production build
npm run build
```

---

## 🗄️ Database Schema & Security (Supabase / PostgreSQL)

When connecting a production Supabase instance, execute the following schema in the Supabase SQL editor:

```sql
-- 1. Profiles & Roles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  role text check (role in ('worker', 'admin', 'supervisor')),
  role_title text not null,
  avatar_url text,
  industry text check (industry in ('construction', 'college', 'factory', 'hospital')),
  department text not null,
  workplace text not null,
  hourly_rate numeric not null,
  overtime_rate numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Attendance & Shifts
create table attendance (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references profiles(id) on delete cascade not null,
  check_in timestamp with time zone not null,
  check_out timestamp with time zone,
  regular_hours numeric default 0,
  overtime_hours numeric default 0,
  total_hours numeric default 0,
  status text check (status in ('checked_in', 'completed', 'flagged')) not null,
  workplace text not null,
  industry text not null,
  date date not null
);

-- 3. Safety Complaints
create table safety_complaints (
  id text primary key,
  worker_id uuid references profiles(id),
  worker_name text not null,
  is_anonymous boolean default false,
  title text not null,
  description text not null,
  category text not null,
  severity text check (severity in ('low', 'medium', 'high', 'critical')) not null,
  location text not null,
  workplace text not null,
  industry text not null,
  photo_url text,
  status text check (status in ('submitted', 'under_review', 'in_progress', 'resolved')) default 'submitted',
  resolution_notes text,
  assigned_to text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Anonymous Feedback (No user foreign key reference to guarantee anonymity)
create table anonymous_feedback (
  id text primary key,
  category text not null,
  industry text not null,
  department text not null,
  message text not null,
  severity text check (severity in ('neutral', 'concern', 'urgent')) not null,
  admin_acknowledgment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  acknowledged_at timestamp with time zone
);

-- 5. Row Level Security Policies (RLS)
alter table profiles enable row level security;
alter table attendance enable row level security;
alter table safety_complaints enable row level security;
alter table anonymous_feedback enable row level security;

-- Workers can read/write their own attendance
create policy "Workers manage own attendance" on attendance
  for all using (auth.uid() = worker_id);

-- Employers can read all attendance within their organization
create policy "Admins read organization attendance" on attendance
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'supervisor'))
  );
```

---

## 👥 Demo Personas Available in Platform

Switch between live accounts anytime from the top navigation bar:
- **Raju Kumar** (Worker — Scaffolding Lead, Metro Rail Construction Line 4)
- **Anita Murthy** (Worker — Lead Housekeeping Officer, Apex National University)
- **Vikram Sharma** (Employer / Admin — Site Safety Director, Metro Rail Construction)
- **Dr. Priya Raman** (Employer / Admin — Dean of Campus Operations, Apex National University)
- **Sunil Verma** (Worker — Tower Crane Operator, Metro Rail Construction)

---

## 🌿 UN SDG 8 Alignment

dead.croco directly addresses **United Nations Sustainable Development Goal 8 (Decent Work and Economic Growth)**:
- **Target 8.5:** Full and productive employment and decent work with equal pay for work of equal value.
- **Target 8.8:** Protect labor rights and promote safe and secure working environments for all workers, including precarious workers.

*BE DEAD LIKE CROCO.*
