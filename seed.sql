-- seed.sql
-- Run with: wrangler d1 execute karis-media-db --remote --file=./seed.sql
-- (after schema.sql). Safe to re-run: it clears these tables first.
-- admin_users / sessions are NOT seeded here — create the real admin
-- account via POST /api/admin/setup instead (see README-DEPLOY.md).

DELETE FROM leads;
DELETE FROM content;
DELETE FROM services;
DELETE FROM business;

INSERT INTO business (id, name, whatsapp, email, messenger_user) VALUES
  (1, 'Karis Media Production', '254794891348', 'bookings@karismedia.co', 'karismedia');

INSERT INTO services (id, title, blurb, icon, sort_order) VALUES
  ('wedding-photography', 'Wedding Photography', 'Full-day coverage that captures the quiet moments between the big ones.', 'calendar', 1),
  ('cinematic-videography', 'Cinematic Videography', 'A short film of your day, cut to feel like memory — not a highlight reel.', 'book', 2),
  ('editorial-portraits', 'Editorial Portraits', 'Studio or on-location sessions for people who want to be seen clearly.', 'grid', 3),
  ('event-coverage', 'Event Coverage', 'Corporate functions and launches, documented with a discreet, editorial eye.', 'inbox', 4),
  ('commercial-visuals', 'Commercial Visuals', 'Product and campaign content built for the platforms your audience lives on.', 'folder', 5);

INSERT INTO content (id, kind, title, category, status, cover, date, description, linked_project_id) VALUES
  (1, 'project', 'Amara & James', 'weddings', 'completed', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=60', '2026-01-15', 'A rain-soaked garden ceremony in Karen, shot on the run between showers.', NULL),
  (2, 'project', 'Aurelia Skincare Campaign', 'commercial', 'completed', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=60', '2026-02-02', 'Product and lifestyle stills for Aurelia''s spring skincare launch.', NULL),
  (3, 'project', 'TechSummit 2026', 'events', 'completed', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=60', '2026-02-10', 'Two-day conference coverage — keynotes, panels, and the hallway conversations that mattered more.', NULL),
  (4, 'project', 'Wanjiru & David', 'weddings', 'completed', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=60', '2026-03-01', 'A 300-guest reception at Lake Naivasha, documented top to bottom.', NULL),
  (5, 'project', 'Nia — Studio Session', 'portraits', 'completed', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=60', '2026-03-10', 'A clean-light editorial portrait sitting for Nia''s new headshots.', NULL),
  (6, 'project', 'Riverside Music Video', 'film', 'upcoming', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=60', '2026-09-01', 'A one-day shoot along the Athi river for an upcoming single release.', NULL),
  (7, 'project', 'Coastal Wedding — Diani', 'weddings', 'upcoming', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=60', '2026-10-12', 'A beachfront ceremony booked for October, full weekend coverage.', NULL),
  (101, 'post', 'Behind Amara & James: shooting a rainy-day wedding', 'weddings', 'completed', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=60', '2026-01-20', 'When the forecast turned an hour before the ceremony, the whole plan changed — here''s how we adapted without losing the shot list.', 1),
  (102, 'post', 'Lighting the Aurelia campaign in one afternoon', 'commercial', 'completed', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=60', '2026-02-05', 'A breakdown of the three-light setup we used to shoot twelve product looks before sunset.', 2),
  (103, 'post', 'What we learned covering TechSummit live', 'events', 'completed', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=60', '2026-02-15', 'Running coverage across two stages at once taught us a few things about triage.', 3);

INSERT INTO leads (id, name, phone, email, service, event_date, location, notes, preferred_channel, status, submitted_at) VALUES
  (1, 'Jane Doe', '+254712345678', 'jane@example.com', 'wedding-photography', '2026-09-20', 'Nairobi, Karen', 'Outdoor ceremony, ~120 guests', 'whatsapp', 'new', '2026-07-28T09:12:00Z'),
  (2, 'Brian Otieno', '+254798765432', 'brian@example.com', 'commercial-visuals', '2026-08-30', 'Nairobi CBD', 'Product shoot for a skincare line, 40 SKUs', 'email', 'contacted', '2026-07-26T14:40:00Z'),
  (3, 'Faith K.', '+254701122334', 'faithk@example.com', 'event-coverage', '2026-09-05', 'Westlands', '', 'call', 'booked', '2026-07-20T08:05:00Z'),
  (4, 'Samuel M.', '+254722998877', 'sam.m@example.com', 'editorial-portraits', '2026-09-14', 'Kilimani studio', 'Headshots for the whole founding team', 'whatsapp', 'new', '2026-08-01T11:22:00Z');

-- keep autoincrement counters ahead of the hand-picked ids above
INSERT INTO sqlite_sequence (name, seq) VALUES ('content', 103), ('leads', 4)
  ON CONFLICT(name) DO UPDATE SET seq = excluded.seq;
