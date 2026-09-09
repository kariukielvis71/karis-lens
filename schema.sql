-- schema.sql
-- Run with: wrangler d1 execute karis-media-db --remote --file=./schema.sql

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS business;
DROP TABLE IF EXISTS admin_users;

CREATE TABLE business (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  messenger_user TEXT NOT NULL,
  tiktok TEXT,       -- full profile URL, nullable — shown as a link if set
  facebook TEXT,
  youtube TEXT,
  instagram TEXT
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  blurb TEXT NOT NULL,       -- exposed to the frontend as `desc`
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL CHECK (kind IN ('project','post')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed','upcoming')),
  cover TEXT NOT NULL,               -- pasted image URL (Unsplash, etc.) — no file storage
  date TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  linked_project_id INTEGER REFERENCES content(id),
  platform TEXT CHECK (platform IN ('tiktok','youtube','facebook','instagram') OR platform IS NULL),
  external_url TEXT                  -- "view on <platform>" link, optional
);

CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  preferred_channel TEXT NOT NULL DEFAULT 'whatsapp',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','booked','declined')),
  submitted_at TEXT NOT NULL
);

-- Created via POST /api/admin/setup (see README-DEPLOY.md), not seeded here.
CREATE TABLE admin_users (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX idx_content_kind ON content(kind);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);