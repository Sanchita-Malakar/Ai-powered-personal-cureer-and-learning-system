-- ==============================================================================
-- CareerOS Student Application - Supabase Database Schema
-- Table: public.student_profiles
-- Scope: Personal Details & Educational / Academic Details
-- ==============================================================================

-- 1. Create the Main student_profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    -- Unique Identifier & Auth Linking
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    -- ==========================================================================
    -- A. PERSONAL DETAILS (Input from Student Profile -> Personal Tab)
    -- ==========================================================================
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),

    -- Location Details (Verified Searchable Autocomplete)
    country_name VARCHAR(100),
    country_code VARCHAR(10),                           -- ISO 3166-1 alpha-2 code (e.g. 'IN', 'US')
    city_id VARCHAR(100),                               -- Reference ID (e.g. 'city_in_kolkata')
    current_city VARCHAR(255),                          -- Display string (e.g. 'Kolkata, West Bengal, India')
    city_details JSONB DEFAULT '{}'::jsonb,             -- Full verified payload: { id, name, state, country, countryCode }
    location_verified BOOLEAN DEFAULT false,

    -- Educational Institution (Verified Searchable Autocomplete)
    university_id VARCHAR(100),                         -- Reference ID (e.g. 'uni_in_ju')
    institution_name VARCHAR(255),                      -- Official Name (e.g. 'Jadavpur University')
    university_details JSONB DEFAULT '{}'::jsonb,       -- Full verified payload: { id, officialName, shortName, city, state, website }
    institution_verified BOOLEAN DEFAULT false,

    -- Program Credentials
    degree VARCHAR(255) DEFAULT 'B.Tech Computer Science & Engineering',
    graduation_year VARCHAR(20) DEFAULT '2025',

    -- Developer Presence & Web Links
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,

    -- ==========================================================================
    -- B. EDUCATIONAL & ACADEMIC DETAILS (Input from Student Profile -> Academics)
    -- ==========================================================================
    cgpa NUMERIC(4, 2) CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    grading_scale VARCHAR(20) DEFAULT '10.0',           -- Supported: '10.0', '4.0', 'Percentage'
    current_semester VARCHAR(50) DEFAULT 'Semester 7',
    department_branch VARCHAR(255) DEFAULT 'Computer Science & Engineering',
    tenth_percentage VARCHAR(20),                       -- e.g. '94.2%'
    twelfth_percentage VARCHAR(20),                     -- e.g. '91.8%'
    active_backlogs VARCHAR(10) DEFAULT '0' CHECK (active_backlogs IN ('0', '1', '2+')),

    -- Core Coursework Performance (Subjects, Grades & Proficiencies)
    -- JSON structure: [{"id": "sub-1", "name": "Data Structures & Algorithms", "gradeOrScore": "A+", "proficiency": "Mastered"}]
    coursework_subjects JSONB DEFAULT '[]'::jsonb,

    -- ==========================================================================
    -- C. TIMESTAMPS
    -- ==========================================================================
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 2. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_city_id ON public.student_profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_university_id ON public.student_profiles(university_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_country_code ON public.student_profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_student_profiles_cgpa ON public.student_profiles(cgpa);

-- ==============================================================================
-- 3. Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Allow students to read only their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.student_profiles;
CREATE POLICY "Users can view their own profile"
    ON public.student_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow students to insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.student_profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.student_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow students to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.student_profiles;
CREATE POLICY "Users can update their own profile"
    ON public.student_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow students to delete their own profile
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.student_profiles;
CREATE POLICY "Users can delete their own profile"
    ON public.student_profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. Trigger: Automatically Update `updated_at` Timestamp on Modification
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_student_profiles_timestamp ON public.student_profiles;
CREATE TRIGGER trigger_update_student_profiles_timestamp
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_updated_at();

-- ==============================================================================
-- 5. Trigger: Automatically Provision Student Profile on New Supabase Auth Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_student_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.student_profiles (
        user_id,
        full_name,
        email,
        country_name,
        country_code,
        current_city,
        degree,
        graduation_year
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        'India',
        'IN',
        'Bengaluru, Karnataka, India',
        'B.Tech Computer Science & Engineering',
        '2025'
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_auth_user_created ON auth.users;
CREATE TRIGGER trigger_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_student_signup();
