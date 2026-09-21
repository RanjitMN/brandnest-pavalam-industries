-- ============================================================
-- Pavalam Industries — Full E-Commerce Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images JSONB DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0,
  weight_grams INTEGER,
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  has_variants BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCT VARIANTS TABLE (optional per product)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  weight_grams INTEGER,
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  gst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  gst_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'cash', 'upi', 'card', 'bank_transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  channel TEXT NOT NULL DEFAULT 'online' CHECK (channel IN ('online', 'offline')),
  shipping_address JSONB NOT NULL,
  coupon_code TEXT,
  notes TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS TABLE (normalized)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  image_url TEXT
);

-- ============================================================
-- COUPONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEFAULT SETTINGS
-- ============================================================
INSERT INTO settings (key, value, description) VALUES
  ('delivery_charge', '60', 'Standard delivery charge in INR'),
  ('free_delivery_above', '500', 'Free delivery for orders above this amount'),
  ('gst_rate', '5', 'GST percentage applied to orders'),
  ('min_order_amount', '100', 'Minimum order amount in INR'),
  ('site_name', 'Pavalam Industries', 'Site name'),
  ('site_tagline', 'Premium Cup Sambrani — Since 1995', 'Site tagline'),
  ('contact_email', 'info@pavalam.com', 'Contact email'),
  ('contact_phone', '+91 98765 43210', 'Contact phone'),
  ('contact_address', 'Tamil Nadu, India', 'Business address'),
  ('instagram_url', '', 'Instagram URL'),
  ('facebook_url', '', 'Facebook URL'),
  ('whatsapp_number', '', 'WhatsApp number for support')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- DEFAULT CATEGORIES (placeholders)
-- ============================================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Cup Sambrani', 'cup-sambrani', 'Traditional cup sambrani for daily prayers and rituals', 1),
  ('Sambrani Powder', 'sambrani-powder', 'Pure sambrani powder for special occasions', 2),
  ('Dhoop Sticks', 'dhoop-sticks', 'Premium dhoop sticks with long-lasting fragrance', 3),
  ('Combo Packs', 'combo-packs', 'Value combo packs for families', 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SAMPLE PRODUCTS
-- ============================================================
INSERT INTO products (name, slug, description, short_description, price, compare_price, stock, weight_grams, is_active, is_featured, category_id) VALUES
  (
    'Pavalam Premium Cup Sambrani',
    'pavalam-premium-cup-sambrani',
    'The classic divine fragrance that brings tranquility to your daily prayers and rituals. Made from 100% natural resins sourced from the finest forests of Tamil Nadu. Each cup burns for 15-20 minutes, filling your home with a heavenly, long-lasting aroma.',
    'Classic divine fragrance for daily prayers — 100% natural resins.',
    149.00, 199.00, 100, 100, true, true,
    (SELECT id FROM categories WHERE slug = 'cup-sambrani' LIMIT 1)
  ),
  (
    'Pavalam Heritage Collection',
    'pavalam-heritage-collection',
    'Crafted with pure natural resins for an authentic, long-lasting sacred aroma. Our heritage collection brings the finest traditional sambrani experience passed down through generations.',
    'Authentic heritage blend — pure natural resins, long-lasting aroma.',
    199.00, 249.00, 75, 150, true, true,
    (SELECT id FROM categories WHERE slug = 'cup-sambrani' LIMIT 1)
  ),
  (
    'Pavalam Traditional Sambrani',
    'pavalam-traditional-sambrani',
    'A timeless blend rooted in Tamil Nadu heritage, purifying your sacred spaces. The sweet, earthy aroma eliminates negative energy and brings profound peace and tranquility.',
    'Timeless Tamil Nadu heritage blend — purifies and brings peace.',
    129.00, 169.00, 120, 80, true, false,
    (SELECT id FROM categories WHERE slug = 'cup-sambrani' LIMIT 1)
  ),
  (
    'Pavalam Family Pack',
    'pavalam-family-pack',
    'Value combo pack perfect for families. Contains our bestselling Cup Sambrani along with Sambrani Powder. Ideal for festivals, daily pooja, and special occasions.',
    'Best value combo pack — perfect for families and festivals.',
    349.00, 450.00, 50, 300, true, true,
    (SELECT id FROM categories WHERE slug = 'combo-packs' LIMIT 1)
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCT VARIANTS (example for Premium Cup Sambrani)
-- ============================================================
INSERT INTO product_variants (product_id, name, price, compare_price, stock, weight_grams, sort_order) VALUES
  (
    (SELECT id FROM products WHERE slug = 'pavalam-premium-cup-sambrani' LIMIT 1),
    '12 Cups Pack',
    149.00, 199.00, 50, 100, 1
  ),
  (
    (SELECT id FROM products WHERE slug = 'pavalam-premium-cup-sambrani' LIMIT 1),
    '24 Cups Pack',
    269.00, 349.00, 30, 200, 2
  ),
  (
    (SELECT id FROM products WHERE slug = 'pavalam-premium-cup-sambrani' LIMIT 1),
    '48 Cups Pack',
    499.00, 649.00, 20, 400, 3
  )
ON CONFLICT DO NOTHING;

-- Update has_variants flag
UPDATE products SET has_variants = true WHERE slug = 'pavalam-premium-cup-sambrani';

-- ============================================================
-- SAMPLE REVIEWS (approved, for display)
-- ============================================================
INSERT INTO reviews (product_id, reviewer_name, rating, comment, is_verified, is_approved) VALUES
  (
    (SELECT id FROM products WHERE slug = 'pavalam-premium-cup-sambrani' LIMIT 1),
    'Priya Subramaniam',
    5,
    'Absolutely divine fragrance! The aroma fills the entire room and lasts for hours. Perfect for our daily pooja. Will definitely order again.',
    true, true
  ),
  (
    (SELECT id FROM products WHERE slug = 'pavalam-premium-cup-sambrani' LIMIT 1),
    'Ramesh Kumar',
    5,
    'Best sambrani I have ever used. The quality is outstanding and the fragrance is exactly like the traditional ones my grandmother used. Highly recommended!',
    true, true
  ),
  (
    (SELECT id FROM products WHERE slug = 'pavalam-heritage-collection' LIMIT 1),
    'Lakshmi Devi',
    4,
    'Very good quality sambrani. The heritage collection has a rich, authentic fragrance. Packaging is also nice. Good value for money.',
    true, true
  ),
  (
    (SELECT id FROM products WHERE slug = 'pavalam-traditional-sambrani' LIMIT 1),
    'Muthu Krishnan',
    5,
    'Excellent product! Pure natural ingredients, no artificial fragrance. The traditional blend is exactly what we needed for our temple. Fast delivery too.',
    true, true
  ),
  (
    (SELECT id FROM products WHERE slug = 'pavalam-family-pack' LIMIT 1),
    'Anitha Rajan',
    5,
    'Great value combo pack! We use Pavalam sambrani every day for pooja. The family pack lasts a full month. Will keep ordering regularly.',
    true, true
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE COUPON
-- ============================================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
  ('WELCOME10', 'Welcome discount — 10% off on first order', 'percentage', 10.00, 200.00, 1000, true),
  ('FLAT50', 'Flat ₹50 off on orders above ₹500', 'flat', 50.00, 500.00, NULL, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admin can update all profiles" ON profiles FOR UPDATE USING (is_admin());

-- CATEGORIES (public read, admin write)
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (is_admin());

-- PRODUCTS (public read, admin write)
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (is_admin());

-- PRODUCT VARIANTS (public read, admin write)
CREATE POLICY "Public can view active variants" ON product_variants FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage variants" ON product_variants FOR ALL USING (is_admin());

-- ORDERS (users see own, admin sees all)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Authenticated users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage all orders" ON orders FOR ALL USING (is_admin());

-- ORDER ITEMS
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Authenticated can insert order items" ON order_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage order items" ON order_items FOR ALL USING (is_admin());

-- COUPONS (limited public read, admin write)
CREATE POLICY "Public can view active coupons by code" ON coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage coupons" ON coupons FOR ALL USING (is_admin());

-- REVIEWS (public read approved, admin all)
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = true OR is_admin());
CREATE POLICY "Authenticated can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage reviews" ON reviews FOR ALL USING (is_admin());

-- SETTINGS (public read, admin write)
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage settings" ON settings FOR ALL USING (is_admin());

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Coupon usage from checkout (customers cannot update coupons directly)
CREATE OR REPLACE FUNCTION public.record_coupon_use(p_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.coupons
  SET uses_count = COALESCE(uses_count, 0) + 1
  WHERE code = p_code AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.record_coupon_use(TEXT) TO authenticated;

-- ============================================================
-- STORAGE BUCKET for product images
-- ============================================================
-- Run this separately in Supabase Storage settings or via dashboard:
-- CREATE BUCKET 'product-images' (public: true)
-- ============================================================
