DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        WHERE t.typname = 'badge_type'
    ) THEN
CREATE TYPE badge_type AS ENUM ('coverage', 'version');
END IF;
END
$$;

CREATE TABLE IF NOT EXISTS project_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type badge_type NOT NULL,
    value VARCHAR(255) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(project_id, type)
);