-- ==============================================================================
-- CareerOS Multi-Student GitHub App Integration Schema
-- Tables: github_connections, github_repositories, project_github_connections
-- ==============================================================================

-- 1. Ensure student_projects has root_path column for monorepos
ALTER TABLE public.student_projects 
ADD COLUMN IF NOT EXISTS root_path TEXT,
ADD COLUMN IF NOT EXISTS github_repository_id BIGINT;

-- 2. GitHub Connections Table (Per-Student Installation Mapping)
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

-- 3. GitHub Permitted Repositories Table (Tenant-Isolated Repositories)
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

-- ==============================================================================
-- Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_github_connections_student_id ON public.github_connections(student_id);
CREATE INDEX IF NOT EXISTS idx_github_connections_installation_id ON public.github_connections(installation_id);
CREATE INDEX IF NOT EXISTS idx_github_repositories_student_id ON public.github_repositories(student_id);
CREATE INDEX IF NOT EXISTS idx_github_repositories_repo_id ON public.github_repositories(github_repository_id);
CREATE INDEX IF NOT EXISTS idx_project_github_connections_project_id ON public.project_github_connections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_github_connections_student_id ON public.project_github_connections(student_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies - Strict Multi-Tenant Isolation
-- ==============================================================================
ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_github_connections ENABLE ROW LEVEL SECURITY;

-- github_connections: Student can only view and manage their own connection
DROP POLICY IF EXISTS "Users can manage their own github connection" ON public.github_connections;
CREATE POLICY "Users can manage their own github connection"
    ON public.github_connections
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- github_repositories: Student can only view their own permitted repositories
DROP POLICY IF EXISTS "Users can view their own permitted repositories" ON public.github_repositories;
DROP POLICY IF EXISTS "Users can manage their own permitted repositories" ON public.github_repositories;
CREATE POLICY "Users can manage their own permitted repositories"
    ON public.github_repositories
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- project_github_connections: Student can only view and manage connections for their own projects
DROP POLICY IF EXISTS "Users can manage their own project github connections" ON public.project_github_connections;
CREATE POLICY "Users can manage their own project github connections"
    ON public.project_github_connections
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- ==============================================================================
-- Automatic updated_at Triggers
-- ==============================================================================
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
