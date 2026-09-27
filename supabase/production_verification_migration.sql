-- ==============================================================================
-- CareerOS Production-Ready Multi-Student GitHub Verification Schema
-- Tables:
--   1. public.student_projects
--   2. public.github_connections
--   3. public.github_repositories
--   4. public.project_github_connections
--   5. public.project_verifications
--   6. public.student_skills
--   7. public.skill_evidence
--   8. public.skill_history
-- ==============================================================================

-- 1. Student Featured Projects Table
CREATE TABLE IF NOT EXISTS public.student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Developer',
    description TEXT,
    technologies JSONB DEFAULT '[]'::jsonb,
    github_url TEXT,
    live_url TEXT,
    impact_metrics TEXT,
    verification_status VARCHAR(50) DEFAULT 'NOT_VERIFIED'
        CHECK (verification_status IN (
            'NOT_VERIFIED', 'AWAITING_PERMISSION', 'AUTHENTICATING', 'QUEUED', 
            'CONNECTING', 'FETCHING_REPOSITORY', 'ANALYZING', 'ANALYZING_STRUCTURE', 
            'ANALYZING_CODE', 'ANALYZING_AI', 'AI_ANALYSIS', 'SCORING', 'VERIFIED', 
            'COMPLETED', 'FAILED', 'REVOKED', 'REQUIRES_REAUTHORIZATION'
        )),
    verification_score INTEGER CHECK (verification_score >= 0 AND verification_score <= 100),
    last_verified_at TIMESTAMPTZ,
    verified_commit_sha VARCHAR(100),
    root_path TEXT, -- Monorepo subdirectory (e.g. "packages/web" or "apps/api")
    github_repository_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure columns exist if student_projects was already created
ALTER TABLE public.student_projects 
ADD COLUMN IF NOT EXISTS root_path TEXT,
ADD COLUMN IF NOT EXISTS github_repository_id BIGINT,
ADD COLUMN IF NOT EXISTS verified_commit_sha VARCHAR(100);

-- 2. GitHub Connections Table (Per-Student GitHub App Installation Mapping)
CREATE TABLE IF NOT EXISTS public.github_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    github_user_id VARCHAR(100),
    github_username VARCHAR(255) NOT NULL,
    installation_id BIGINT NOT NULL,
    connection_status VARCHAR(50) NOT NULL DEFAULT 'connected' 
        CHECK (connection_status IN ('connected', 'suspended', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id)
);

-- 3. GitHub Permitted Repositories Table (Tenant-Isolated Authorized Repositories)
CREATE TABLE IF NOT EXISTS public.github_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    github_connection_id UUID NOT NULL REFERENCES public.github_connections(id) ON DELETE CASCADE,
    github_repository_id BIGINT NOT NULL,
    owner_login VARCHAR(255) NOT NULL,
    repository_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    default_branch VARCHAR(100) NOT NULL DEFAULT 'main',
    private BOOLEAN NOT NULL DEFAULT false,
    html_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, github_repository_id)
);

-- 4. Project GitHub Connections Junction Table
CREATE TABLE IF NOT EXISTS public.project_github_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    github_repository_id BIGINT NOT NULL,
    root_path TEXT, -- e.g. "packages/client" for monorepos
    branch VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(project_id)
);

-- 5. Project Verifications Table (Historical & Active Verification Reports)
CREATE TABLE IF NOT EXISTS public.project_verifications (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    repo_owner VARCHAR(255) NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    commit_sha VARCHAR(100),
    analysis_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    detected_technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    ai_analysis_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    error_message TEXT,
    root_path TEXT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Student Skills Matrix Table
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Development',
    claimed_level VARCHAR(50) DEFAULT 'Beginner',
    student_claimed BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    verified_percentage INTEGER DEFAULT 20 CHECK (verified_percentage >= 0 AND verified_percentage <= 100),
    verified_level VARCHAR(50) DEFAULT 'Exposure',
    confidence_score NUMERIC(3, 2) DEFAULT 0.20,
    evidence_projects_count INTEGER DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, name)
);

-- 7. Skill Evidence Table (Atomic Evidence Signals Linked to Projects)
CREATE TABLE IF NOT EXISTS public.skill_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    project_id UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
    evidence_score INTEGER NOT NULL,
    file_count INTEGER DEFAULT 1,
    signals JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Skill History Table (Audit Trail of Skill Progression Over Time)
CREATE TABLE IF NOT EXISTS public.skill_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    previous_percentage INTEGER NOT NULL,
    new_percentage INTEGER NOT NULL,
    previous_level VARCHAR(50) NOT NULL,
    new_level VARCHAR(50) NOT NULL,
    change_reason TEXT NOT NULL,
    project_id UUID REFERENCES public.student_projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- Performance Indexes for Scalability
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_student_projects_user_id ON public.student_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_github_connections_student_id ON public.github_connections(student_id);
CREATE INDEX IF NOT EXISTS idx_github_connections_installation_id ON public.github_connections(installation_id);
CREATE INDEX IF NOT EXISTS idx_github_repositories_student_id ON public.github_repositories(student_id);
CREATE INDEX IF NOT EXISTS idx_github_repositories_repo_id ON public.github_repositories(github_repository_id);
CREATE INDEX IF NOT EXISTS idx_project_github_connections_project_id ON public.project_github_connections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_github_connections_student_id ON public.project_github_connections(student_id);
CREATE INDEX IF NOT EXISTS idx_project_verifications_project_id ON public.project_verifications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_verifications_user_id ON public.project_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_user_id ON public.student_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_user_id ON public.skill_evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_project_id ON public.skill_evidence(project_id);
CREATE INDEX IF NOT EXISTS idx_skill_history_user_id ON public.skill_history(user_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies - Strict Multi-Tenant Isolation
-- ==============================================================================
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_history ENABLE ROW LEVEL SECURITY;

-- student_projects: Student can only view and manage their own projects
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.student_projects;
CREATE POLICY "Users can manage their own projects"
    ON public.student_projects
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- github_connections: Student can only view and manage their own connection
DROP POLICY IF EXISTS "Users can manage their own github connection" ON public.github_connections;
CREATE POLICY "Users can manage their own github connection"
    ON public.github_connections
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- github_repositories: Student can only view their own permitted repositories
DROP POLICY IF EXISTS "Users can manage their own permitted repositories" ON public.github_repositories;
CREATE POLICY "Users can manage their own permitted repositories"
    ON public.github_repositories
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- project_github_connections: Student can only manage connections for their own projects
DROP POLICY IF EXISTS "Users can manage their own project github connections" ON public.project_github_connections;
CREATE POLICY "Users can manage their own project github connections"
    ON public.project_github_connections
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- project_verifications: Student can only access verification reports for their own projects
DROP POLICY IF EXISTS "Users can manage their own project verifications" ON public.project_verifications;
CREATE POLICY "Users can manage their own project verifications"
    ON public.project_verifications
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- student_skills: Student can only manage their own skills
DROP POLICY IF EXISTS "Users can manage their own skills" ON public.student_skills;
CREATE POLICY "Users can manage their own skills"
    ON public.student_skills
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- skill_evidence: Student can only view their own skill evidence
DROP POLICY IF EXISTS "Users can manage their own skill evidence" ON public.skill_evidence;
CREATE POLICY "Users can manage their own skill evidence"
    ON public.skill_evidence
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- skill_history: Student can only view their own skill progression history
DROP POLICY IF EXISTS "Users can manage their own skill history" ON public.skill_history;
CREATE POLICY "Users can manage their own skill history"
    ON public.skill_history
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Automatic updated_at Triggers
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_student_projects_timestamp ON public.student_projects;
CREATE TRIGGER trigger_update_student_projects_timestamp
    BEFORE UPDATE ON public.student_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_updated_at();

DROP TRIGGER IF EXISTS trigger_update_github_connections_timestamp ON public.github_connections;
CREATE TRIGGER trigger_update_github_connections_timestamp
    BEFORE UPDATE ON public.github_connections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_updated_at();

DROP TRIGGER IF EXISTS trigger_update_github_repositories_timestamp ON public.github_repositories;
CREATE TRIGGER trigger_update_github_repositories_timestamp
    BEFORE UPDATE ON public.github_repositories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_updated_at();

DROP TRIGGER IF EXISTS trigger_update_student_skills_timestamp ON public.student_skills;
CREATE TRIGGER trigger_update_student_skills_timestamp
    BEFORE UPDATE ON public.student_skills
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_updated_at();
