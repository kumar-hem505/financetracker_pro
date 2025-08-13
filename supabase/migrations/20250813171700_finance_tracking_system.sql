-- Location: supabase/migrations/20250813171700_finance_tracking_system.sql
-- Finance Tracking System with Authentication and Role Management
-- Integration Type: Complete system setup with auth, transactions, budgets, and insights

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'accountant', 'viewer');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'refund');
CREATE TYPE public.payment_mode AS ENUM ('upi', 'bank_transfer', 'cash', 'card', 'cheque');
CREATE TYPE public.budget_status AS ENUM ('active', 'completed', 'overrun', 'suspended');
CREATE TYPE public.alert_type AS ENUM ('budget_overrun', 'upcoming_bill', 'tax_deadline', 'anomaly');
CREATE TYPE public.alert_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- 2. Core Tables

-- User profiles table (intermediary for auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'viewer'::public.user_role,
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Vendors/Suppliers table
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    gst_number TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Transaction categories
CREATE TABLE public.transaction_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_category_id UUID REFERENCES public.transaction_categories(id) ON DELETE CASCADE,
    is_gst_applicable BOOLEAN DEFAULT false,
    gst_rate DECIMAL(5,2) DEFAULT 0,
    color_code TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Main transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type public.transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.transaction_categories(id) ON DELETE RESTRICT,
    payment_mode public.payment_mode NOT NULL,
    invoice_number TEXT,
    invoice_url TEXT,
    gst_amount DECIMAL(15,2) DEFAULT 0,
    tds_amount DECIMAL(15,2) DEFAULT 0,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency TEXT, -- monthly, quarterly, yearly
    project_id UUID, -- For project-based tracking
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department TEXT,
    category_id UUID REFERENCES public.transaction_categories(id) ON DELETE RESTRICT,
    allocated_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status public.budget_status DEFAULT 'active'::public.budget_status,
    alert_threshold DECIMAL(5,2) DEFAULT 80, -- Alert at 80% utilization
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Alerts and notifications
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    alert_type public.alert_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority public.alert_priority DEFAULT 'medium'::public.alert_priority,
    is_read BOOLEAN DEFAULT false,
    related_entity_id UUID, -- Could be transaction, budget, etc.
    related_entity_type TEXT, -- 'transaction', 'budget', etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tax liability tracking
CREATE TABLE public.tax_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tax_type TEXT NOT NULL, -- GST, TDS, Income Tax
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    taxable_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    due_date DATE,
    filing_status TEXT DEFAULT 'pending', -- pending, filed, paid
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Projects for cost tracking
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    budget_allocated DECIMAL(15,2),
    budget_spent DECIMAL(15,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active', -- active, completed, on_hold
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_by ON public.transactions(created_by);
CREATE INDEX idx_transactions_vendor_id ON public.transactions(vendor_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_budgets_department ON public.budgets(department);
CREATE INDEX idx_budgets_period ON public.budgets(period_start, period_end);
CREATE INDEX idx_budgets_created_by ON public.budgets(created_by);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX idx_vendors_created_by ON public.vendors(created_by);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(
    (SELECT role::TEXT FROM public.user_profiles WHERE id = auth.uid()),
    'viewer'
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_accountant()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT public.get_user_role() IN ('admin', 'accountant')
$$;

-- 6. RLS Policies

-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for most tables
CREATE POLICY "users_manage_own_transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_own_budgets"
ON public.budgets
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_own_vendors"
ON public.vendors
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_own_projects"
ON public.projects
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_view_own_alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "system_creates_alerts"
ON public.alerts
FOR INSERT
TO authenticated
WITH CHECK (true); -- System can create alerts for any user

-- Pattern 4: Public read for shared data
CREATE POLICY "all_users_read_transaction_categories"
ON public.transaction_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_accountant_manage_categories"
ON public.transaction_categories
FOR ALL
TO authenticated
USING (public.is_admin_or_accountant())
WITH CHECK (public.is_admin_or_accountant());

-- Admin-only access for tax records
CREATE POLICY "admin_accountant_manage_tax_records"
ON public.tax_records
FOR ALL
TO authenticated
USING (public.is_admin_or_accountant())
WITH CHECK (public.is_admin_or_accountant());

-- 7. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Budget utilization update function
CREATE OR REPLACE FUNCTION public.update_budget_spent()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.transaction_type = 'expense' THEN
        -- Update budget spent amount
        UPDATE public.budgets 
        SET spent_amount = spent_amount + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE category_id = NEW.category_id
        AND period_start <= NEW.transaction_date
        AND period_end >= NEW.transaction_date
        AND status = 'active';
        
        -- Check for budget overruns and create alerts
        INSERT INTO public.alerts (user_id, alert_type, title, message, priority)
        SELECT 
            NEW.created_by,
            'budget_overrun'::public.alert_type,
            'Budget Alert: ' || b.name,
            'Budget utilization is at ' || ROUND((b.spent_amount + NEW.amount) / b.allocated_amount * 100, 1) || '%',
            CASE 
                WHEN (b.spent_amount + NEW.amount) / b.allocated_amount > 1.0 THEN 'critical'
                WHEN (b.spent_amount + NEW.amount) / b.allocated_amount > b.alert_threshold / 100 THEN 'high'
                ELSE 'medium'
            END::public.alert_priority
        FROM public.budgets b
        WHERE b.category_id = NEW.category_id
        AND b.period_start <= NEW.transaction_date
        AND b.period_end >= NEW.transaction_date
        AND b.status = 'active'
        AND (b.spent_amount + NEW.amount) / b.allocated_amount > (b.alert_threshold / 100);
    END IF;
    RETURN NEW;
END;
$$;

-- Trigger for budget updates
CREATE TRIGGER on_transaction_budget_update
    AFTER INSERT OR UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_budget_spent();

-- 9. Mock Data
DO $$
DECLARE
    admin_id UUID := gen_random_uuid();
    accountant_id UUID := gen_random_uuid();
    viewer_id UUID := gen_random_uuid();
    office_cat_id UUID := gen_random_uuid();
    marketing_cat_id UUID := gen_random_uuid();
    travel_cat_id UUID := gen_random_uuid();
    vendor1_id UUID := gen_random_uuid();
    vendor2_id UUID := gen_random_uuid();
    budget1_id UUID := gen_random_uuid();
    project1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@company.com', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (accountant_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'accountant@company.com', crypt('Account123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Accountant User", "role": "accountant"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (viewer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'viewer@company.com', crypt('Viewer123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Viewer User", "role": "viewer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert default transaction categories
    INSERT INTO public.transaction_categories (id, name, is_gst_applicable, gst_rate, color_code) VALUES
        (office_cat_id, 'Office Supplies', true, 18.00, '#3B82F6'),
        (marketing_cat_id, 'Marketing & Advertising', true, 18.00, '#EF4444'),
        (travel_cat_id, 'Travel & Transportation', true, 5.00, '#10B981'),
        (gen_random_uuid(), 'Utilities', true, 18.00, '#F59E0B'),
        (gen_random_uuid(), 'Software & Subscriptions', true, 18.00, '#8B5CF6'),
        (gen_random_uuid(), 'Professional Services', true, 18.00, '#06B6D4'),
        (gen_random_uuid(), 'Equipment & Hardware', true, 28.00, '#EC4899'),
        (gen_random_uuid(), 'Rent & Property', false, 0.00, '#6B7280');

    -- Insert vendors
    INSERT INTO public.vendors (id, name, category, gst_number, contact_email, created_by) VALUES
        (vendor1_id, 'TechCorp Solutions', 'Software Vendor', '29ABCDE1234F1Z5', 'contact@techcorp.com', admin_id),
        (vendor2_id, 'Office Supplies Ltd', 'Office Supplies', '29FGHIJ5678K2Z1', 'sales@officesupplies.com', admin_id),
        (gen_random_uuid(), 'Digital Marketing Pro', 'Marketing Agency', '29LMNOP9012L3Z7', 'hello@digitalmarketing.com', admin_id);

    -- Insert projects
    INSERT INTO public.projects (id, name, description, budget_allocated, start_date, end_date, created_by) VALUES
        (project1_id, 'Website Redesign 2024', 'Complete company website overhaul', 500000.00, '2024-01-01', '2024-06-30', admin_id),
        (gen_random_uuid(), 'Mobile App Development', 'Cross-platform mobile application', 800000.00, '2024-03-01', '2024-12-31', admin_id);

    -- Insert budgets
    INSERT INTO public.budgets (id, name, department, category_id, allocated_amount, period_start, period_end, alert_threshold, created_by) VALUES
        (budget1_id, 'Q1 Office Supplies Budget', 'Administration', office_cat_id, 50000.00, '2024-01-01', '2024-03-31', 75.0, admin_id),
        (gen_random_uuid(), 'Marketing Campaign Q1', 'Marketing', marketing_cat_id, 200000.00, '2024-01-01', '2024-03-31', 80.0, admin_id),
        (gen_random_uuid(), 'Travel Budget Q1', 'Sales', travel_cat_id, 100000.00, '2024-01-01', '2024-03-31', 85.0, admin_id);

    -- Insert sample transactions
    INSERT INTO public.transactions (transaction_type, amount, description, transaction_date, vendor_id, category_id, payment_mode, gst_amount, created_by, project_id) VALUES
        ('expense', 25000.00, 'Software License Purchase', '2024-01-15', vendor1_id, office_cat_id, 'bank_transfer', 4500.00, admin_id, project1_id),
        ('expense', 8500.00, 'Office Stationery', '2024-01-20', vendor2_id, office_cat_id, 'card', 1530.00, accountant_id, null),
        ('income', 150000.00, 'Client Payment - Project Alpha', '2024-01-25', null, null, 'bank_transfer', 27000.00, admin_id, project1_id),
        ('expense', 12000.00, 'Google Ads Campaign', '2024-02-01', null, marketing_cat_id, 'card', 2160.00, accountant_id, null),
        ('expense', 18500.00, 'Team Travel - Client Meeting', '2024-02-05', null, travel_cat_id, 'cash', 925.00, accountant_id, null),
        ('income', 75000.00, 'Consulting Services', '2024-02-10', null, null, 'bank_transfer', 13500.00, admin_id, null);

    -- Insert tax records
    INSERT INTO public.tax_records (tax_type, period_start, period_end, taxable_amount, tax_amount, due_date) VALUES
        ('GST', '2024-01-01', '2024-01-31', 300000.00, 54000.00, '2024-02-20'),
        ('TDS', '2024-01-01', '2024-01-31', 150000.00, 15000.00, '2024-02-07'),
        ('Income Tax', '2023-04-01', '2024-03-31', 1200000.00, 360000.00, '2024-07-31');

    -- Insert sample alerts
    INSERT INTO public.alerts (user_id, alert_type, title, message, priority) VALUES
        (admin_id, 'budget_overrun', 'Marketing Budget Alert', 'Marketing budget utilization is at 85%', 'high'),
        (accountant_id, 'upcoming_bill', 'GST Filing Due', 'GST return filing is due on 20th Feb 2024', 'medium'),
        (admin_id, 'tax_deadline', 'Income Tax Deadline', 'Annual income tax filing deadline approaching', 'high');

END $$;

-- 10. Storage bucket for invoices and receipts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'invoice-documents',
    'invoice-documents',
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- Storage RLS policies
CREATE POLICY "users_view_own_invoice_files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'invoice-documents' AND owner = auth.uid());

CREATE POLICY "users_upload_invoice_files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'invoice-documents' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_invoice_files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'invoice-documents' AND owner = auth.uid())
WITH CHECK (bucket_id = 'invoice-documents' AND owner = auth.uid());

CREATE POLICY "users_delete_own_invoice_files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'invoice-documents' AND owner = auth.uid());