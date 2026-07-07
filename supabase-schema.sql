-- ==============================================
-- JOTO RAMEN - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
UUID=107be3b7-e336-445b-a4e0-fb74e0ed1cce
-- ==============================================
-- MENU ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  name_jp     TEXT,
  description TEXT,
  price       INTEGER NOT NULL,           -- in KSh
  category    TEXT NOT NULL CHECK (category IN ('ramen','starters','sides','drinks','desserts')),
  tags        TEXT[],                     -- e.g. ARRAY['signature','popular']
  image_url   TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- RESERVATIONS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS reservations (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  guests      INTEGER NOT NULL CHECK (guests BETWEEN 1 AND 20),
  location    TEXT NOT NULL,
  requests    TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- CONTACT MESSAGES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE menu_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages      ENABLE ROW LEVEL SECURITY;

-- Menu items: public read, authenticated admin write
CREATE POLICY "menu_items_public_read"
  ON menu_items FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "menu_items_admin_write"
  ON menu_items FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Reservations: public insert, authenticated read/update
CREATE POLICY "reservations_public_insert"
  ON reservations FOR INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "reservations_admin_all"
  ON reservations FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Newsletter: public insert, authenticated read
CREATE POLICY "newsletter_public_insert"
  ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "newsletter_admin_all"
  ON newsletter_subscribers FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Contact messages: public insert, authenticated read/update
CREATE POLICY "contact_public_insert"
  ON contact_messages FOR INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "contact_admin_all"
  ON contact_messages FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ==============================================
-- SEED MENU DATA
-- ==============================================
INSERT INTO menu_items (name, name_jp, description, price, category, tags, image_url) VALUES
  ('Special Shoyu',    '特製醤油', 'Clean soy-based broth with gentle smokiness, pulled chicken, pork belly, and seaweed. Our signature 6-hour chicken broth.', 1850, 'ramen',    ARRAY['signature'],           'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600'),
  ('Special Miso',     '特製味噌', 'Rich and bold — miso paste, corn, ground meat, seared chashu pork, and spring onions. Our most popular order.',             1850, 'ramen',    ARRAY['signature','popular'], 'https://images.unsplash.com/photo-1626804475297-411dbe6373b3?w=600'),
  ('Vegan Ramen',      'ビーガンラーメン', 'Plant-based broth with seasonal vegetables, tofu, and handmade noodles. Fully vegan and deeply satisfying.',      1650, 'ramen',    ARRAY['vegan'],               'https://images.unsplash.com/photo-1546060754-72d961c45a45?w=600'),
  ('Spicy Miso',       '辛味噌',   'Our signature miso with an extra kick of chili oil and spicy ground pork.',                                                  1950, 'ramen',    ARRAY['spicy'],               'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600'),
  ('Karaage',          '唐揚げ',   'Japanese fried chicken — crispy outside, juicy inside. Served with lemon and special dipping sauce.',                        850,  'starters', ARRAY[]::TEXT[],              'https://images.unsplash.com/photo-1580476262798-bddd9dd90e3e?w=600'),
  ('Edamame',          '枝豆',     'Steamed soybeans with sea salt. A classic Japanese starter.',                                                                450,  'starters', ARRAY['vegan'],               'https://images.unsplash.com/photo-1596519415180-2624a8b2e5bb?w=600'),
  ('Gyoza',            '餃子',     'Pan-fried pork dumplings with crispy bottoms and tender tops.',                                                              750,  'starters', ARRAY[]::TEXT[],              'https://images.unsplash.com/photo-1623970533845-5b5e000a1e68?w=600'),
  ('Tornado Potatoes', 'トルネードポテト', 'Crispy spiral-cut potatoes on a stick, seasoned with signature spices.',                                             650,  'sides',    ARRAY['vegan'],               'https://images.unsplash.com/photo-1600205735056-04b2c0842a39?w=600'),
  ('Japanese Green Tea','緑茶',    'Authentic sencha green tea, served hot or iced.',                                                                            350,  'drinks',   ARRAY['vegan'],               'https://images.unsplash.com/photo-1556816907-6c74f5e6e5a4?w=600'),
  ('Ramune',           'ラムネ',   'Classic Japanese soda in strawberry, melon, or original flavours.',                                                         400,  'drinks',   ARRAY['vegan'],               'https://images.unsplash.com/photo-1557862921-3789c8b971ae?w=600')
ON CONFLICT DO NOTHING;