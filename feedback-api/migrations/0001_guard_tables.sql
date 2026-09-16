CREATE TABLE rate_limits (
  fingerprint TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (fingerprint, window_start)
);

CREATE INDEX idx_rate_limits_expires_at ON rate_limits (expires_at);

CREATE TABLE submission_idempotency (
  idempotency_key TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('pending', 'complete')),
  issue_number INTEGER,
  issue_url TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX idx_submission_idempotency_expires_at
  ON submission_idempotency (expires_at);
