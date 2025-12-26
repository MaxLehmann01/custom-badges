CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name VARCHAR(100) NOT NULL,
    key_ct BYTEA NOT NULL,
    key_iv BYTEA NOT NULL,
    key_tag BYTEA NOT NULL,
    key_digest BYTEA NOT NULL
);