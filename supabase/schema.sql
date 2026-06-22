-- ============================================
-- 二手機交易平台 - Supabase Schema
-- 在 Supabase Dashboard > SQL Editor 執行這段
-- ============================================

-- 1. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  description TEXT,
  cover_image TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT '在庫' CHECK (status IN ('在庫', '預訂中', '已售出')),
  brand TEXT NOT NULL,
  storage TEXT,
  color TEXT,
  condition TEXT CHECK (condition IN ('全新', '九成新', '八成新', '七成新')),
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Inquiries Table
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- 4. Storage policy - anyone can view images
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 5. Storage policy - only authenticated users can upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 6. RLS Policies for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert products"
ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update products"
ON products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete products"
ON products FOR DELETE USING (auth.role() = 'authenticated');

-- 7. RLS Policies for inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create inquiries"
ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view inquiries"
ON inquiries FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update inquiries"
ON inquiries FOR UPDATE USING (auth.role() = 'authenticated');

-- 8. Function to increment views
CREATE OR REPLACE FUNCTION increment_views(product_id UUID)
RETURNS void AS $$
  UPDATE products SET views = views + 1 WHERE id = product_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 9. Sample data (optional, for testing)
INSERT INTO products (name, price, original_price, description, brand, storage, color, condition, status, is_featured, cover_image)
VALUES
  ('iPhone 15 Pro 256GB', 38000, 42900, '台灣公司貨，盒裝配件齊全，電池健康度 98%，外觀近乎全新無刮痕', 'Apple', '256GB', '黑色鈦金屬', '九成新', '在庫', true, ''),
  ('Samsung S24 Ultra 512GB', 32000, 39900, '韓版，功能正常，S Pen 完好，僅使用 3 個月', 'Samsung', '512GB', '鈦黑色', '九成新', '在庫', true, ''),
  ('iPhone 14 128GB', 22000, 27900, '女用機，外觀漂亮，無維修紀錄，電池 95%', 'Apple', '128GB', '星光色', '九成新', '在庫', false, '');
