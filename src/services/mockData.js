/**
 * mockData.js
 * -----------------------------------------------------------------------
 * Seed data standing in for D1 while the Cloudflare Worker backend isn't
 * live yet. Only api.js reads from this file directly — every other
 * module goes through dataLoader.js so this file can be deleted outright
 * once real endpoints exist.
 * -----------------------------------------------------------------------
 */

export const BUSINESS = {
  name: "Karis Media Production",
  whatsapp: "254794891348",
  email: "bookings@karismedia.co",
  messengerUser: "karismedia",
};

export const SERVICES = [
  { id: "wedding-photography", title: "Wedding Photography", desc: "Full-day coverage that captures the quiet moments between the big ones.", icon: "calendar" },
  { id: "cinematic-videography", title: "Cinematic Videography", desc: "A short film of your day, cut to feel like memory — not a highlight reel.", icon: "book" },
  { id: "editorial-portraits", title: "Editorial Portraits", desc: "Studio or on-location sessions for people who want to be seen clearly.", icon: "grid" },
  { id: "event-coverage", title: "Event Coverage", desc: "Corporate functions and launches, documented with a discreet, editorial eye.", icon: "inbox" },
  { id: "commercial-visuals", title: "Commercial Visuals", desc: "Product and campaign content built for the platforms your audience lives on.", icon: "folder" },
];

/** Unified content collection — `kind` is 'project' or 'post'; `status` is 'completed' or 'upcoming'. */
export const CONTENT_SEED = [
  { id: 1, kind: "project", title: "Amara & James", category: "weddings", status: "completed", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=60", date: "2026-01-15", description: "A rain-soaked garden ceremony in Karen, shot on the run between showers." },
  { id: 2, kind: "project", title: "Aurelia Skincare Campaign", category: "commercial", status: "completed", cover: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=60", date: "2026-02-02", description: "Product and lifestyle stills for Aurelia's spring skincare launch." },
  { id: 3, kind: "project", title: "TechSummit 2026", category: "events", status: "completed", cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=60", date: "2026-02-10", description: "Two-day conference coverage — keynotes, panels, and the hallway conversations that mattered more." },
  { id: 4, kind: "project", title: "Wanjiru & David", category: "weddings", status: "completed", cover: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=60", date: "2026-03-01", description: "A 300-guest reception at Lake Naivasha, documented top to bottom." },
  { id: 5, kind: "project", title: "Nia — Studio Session", category: "portraits", status: "completed", cover: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=60", date: "2026-03-10", description: "A clean-light editorial portrait sitting for Nia's new headshots." },
  { id: 6, kind: "project", title: "Riverside Music Video", category: "film", status: "upcoming", cover: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=60", date: "2026-09-01", description: "A one-day shoot along the Athi river for an upcoming single release." },
  { id: 7, kind: "project", title: "Coastal Wedding — Diani", category: "weddings", status: "upcoming", cover: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=60", date: "2026-10-12", description: "A beachfront ceremony booked for October, full weekend coverage." },
  { id: 101, kind: "post", title: "Behind Amara & James: shooting a rainy-day wedding", category: "weddings", status: "completed", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=60", date: "2026-01-20", description: "When the forecast turned an hour before the ceremony, the whole plan changed — here's how we adapted without losing the shot list.", linkedProjectId: 1 },
  { id: 102, kind: "post", title: "Lighting the Aurelia campaign in one afternoon", category: "commercial", status: "completed", cover: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=60", date: "2026-02-05", description: "A breakdown of the three-light setup we used to shoot twelve product looks before sunset.", linkedProjectId: 2 },
  { id: 103, kind: "post", title: "What we learned covering TechSummit live", category: "events", status: "completed", cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=60", date: "2026-02-15", description: "Running coverage across two stages at once taught us a few things about triage.", linkedProjectId: 3 },
];

export const LEADS_SEED = [
  { id: 1, name: "Jane Doe", phone: "+254712345678", email: "jane@example.com", service: "wedding-photography", eventDate: "2026-09-20", location: "Nairobi, Karen", notes: "Outdoor ceremony, ~120 guests", preferredChannel: "whatsapp", status: "new", submittedAt: "2026-07-28T09:12:00Z" },
  { id: 2, name: "Brian Otieno", phone: "+254798765432", email: "brian@example.com", service: "commercial-visuals", eventDate: "2026-08-30", location: "Nairobi CBD", notes: "Product shoot for a skincare line, 40 SKUs", preferredChannel: "email", status: "contacted", submittedAt: "2026-07-26T14:40:00Z" },
  { id: 3, name: "Faith K.", phone: "+254701122334", email: "faithk@example.com", service: "event-coverage", eventDate: "2026-09-05", location: "Westlands", notes: "", preferredChannel: "call", status: "booked", submittedAt: "2026-07-20T08:05:00Z" },
  { id: 4, name: "Samuel M.", phone: "+254722998877", email: "sam.m@example.com", service: "editorial-portraits", eventDate: "2026-09-14", location: "Kilimani studio", notes: "Headshots for the whole founding team", preferredChannel: "whatsapp", status: "new", submittedAt: "2026-08-01T11:22:00Z" },
];
