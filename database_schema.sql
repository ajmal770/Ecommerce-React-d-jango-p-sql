-- SQL Schema for Hardware Shop Application
-- This script contains the structure for the PostgreSQL database.
-- Note: Django ORM handles these implicitly via migrations, but this script is provided as per deliverables.

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(254) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    is_customer BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE store_product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product Images Table
CREATE TABLE store_productimage (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES store_product(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL
);

-- 4. Spare Parts Table
CREATE TABLE store_sparepart (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES store_product(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- 5. Cart Table
CREATE TABLE orders_cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Cart Items Table
CREATE TABLE orders_cartitem (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES orders_cart(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES store_product(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1
);

-- 7. Orders Table
CREATE TABLE orders_order (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items Table
CREATE TABLE orders_orderitem (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders_order(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES store_product(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- 9. Invoices Table
CREATE TABLE orders_invoice (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders_order(id) ON DELETE CASCADE UNIQUE,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'Pending',
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example Insert Data
INSERT INTO store_product (name, description, price, stock) VALUES
('Bosch Professional Angle Grinder - GWS 600', 'High quality angle grinder from Bosch.', 2500.00, 50),
('INGCO Rotary Hammer Drill Machine - RGH6528 - 650Watt', 'Heavy duty rotary hammer drill.', 3500.00, 30),
('Stanley Hacksaw Frame', 'Durable hacksaw frame for professional use.', 450.00, 100),
('Taparia 1004 8-Inch Adjustable Wrench', 'Standard 8-inch adjustable wrench.', 250.00, 80),
('DeWalt DWD112 8 Amp 3/8-Inch VSR Drill', 'Powerful VSR corded drill.', 4200.00, 20);

-- Insert associated Spare Parts
INSERT INTO store_sparepart (product_id, name, description, price) VALUES
(1, 'Armature (220-240V)', 'Spare armature for Bosch GWS 600', 800.00),
(1, 'Field Coil (220-240V)', 'Spare field coil for Bosch GWS 600', 450.00),
(2, 'Carbon Brushes', 'Replacement carbon brushes for RGH6528', 150.00),
(2, 'SDS Plus Chuck', 'Replacement chuck for hammer drill', 600.00),
(3, 'Hacksaw Blade 12-inch (Pack of 10)', 'High-speed steel hacksaw blades', 120.00);
