CREATE TABLE IF NOT EXISTS task_state (
  id          TEXT PRIMARY KEY,
  done        INTEGER NOT NULL DEFAULT 0,
  owner       TEXT,
  updated_at  TEXT,
  updated_by  TEXT
);

CREATE TABLE IF NOT EXISTS gate_state (
  id          TEXT PRIMARY KEY,   -- "<client-slug>|G3-0N"
  val         TEXT,               -- "Y" | "N" | "NA"
  updated_at  TEXT,
  updated_by  TEXT
);

CREATE TABLE IF NOT EXISTS keyword_state (
  id           TEXT PRIMARY KEY,  -- "<client-slug>-kw-xxxx"
  client       TEXT,              -- client slug
  kw           TEXT,              -- the keyword
  note         TEXT,              -- target page / rank / city
  primary_flag INTEGER DEFAULT 0,
  updated_at   TEXT,
  updated_by   TEXT
);

-- If task_state already existed before owners were added, run:
-- ALTER TABLE task_state ADD COLUMN owner TEXT;
