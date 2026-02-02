CREATE DATABASE IF NOT EXISTS ecobazaar;
USE ecobazaar;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    eco_score DOUBLE DEFAULT 0.0,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Products Table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    carbon_impact DOUBLE NOT NULL,
    eco_certified BOOLEAN DEFAULT FALSE,
    eco_rating VARCHAR(20),
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    seller_id BIGINT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_eco_rating (eco_rating),
    INDEX idx_seller (seller_id),
    INDEX idx_active_approved (is_active, is_approved)
);

-- Carts Table
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    total_carbon DOUBLE DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- Cart Items Table
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2),
    carbon_subtotal DOUBLE,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id),
    INDEX idx_cart (cart_id),
    INDEX idx_product (product_id)
);

-- Orders Table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    total_carbon DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- Order Items Table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    carbon_impact DOUBLE NOT NULL,
    subtotal DECIMAL(10, 2),
    carbon_subtotal DOUBLE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- Carbon Reports Table
CREATE TABLE carbon_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    carbon_emitted DOUBLE DEFAULT 0.0,
    carbon_saved DOUBLE DEFAULT 0.0,
    eco_rank INT,
    report_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_month_year (user_id, month, year),
    INDEX idx_user (user_id),
    INDEX idx_month_year (month, year)
);

-- ==================== SAMPLE DATA ====================

-- Insert Sample Users
INSERT INTO users (name, email, password, role, eco_score, phone, address, is_active) VALUES
('Admin User', 'admin@ecobazaar.com', '$2a$10$xqRZ5wSJ1Ck9K5h1eQKYJOqXvLZYZG9wX5oY6F1kH8vN2eR7sT9uO', 'ADMIN', 100.0, '1234567890', '123 Admin St', TRUE),
('John Seller', 'seller@ecobazaar.com', '$2a$10$xqRZ5wSJ1Ck9K5h1eQKYJOqXvLZYZG9wX5oY6F1kH8vN2eR7sT9uO', 'SELLER', 75.5, '9876543210', '456 Seller Ave', TRUE),
('Jane Doe', 'user@ecobazaar.com', '$2a$10$xqRZ5wSJ1Ck9K5h1eQKYJOqXvLZYZG9wX5oY6F1kH8vN2eR7sT9uO', 'USER', 50.0, '5551234567', '789 User Blvd', TRUE);

-- Password for all users is: password123

-- Insert Sample Products
INSERT INTO products (name, description, price, carbon_impact, eco_certified, eco_rating, category, stock_quantity, image_url, seller_id, is_approved, is_active) VALUES
('Organic Cotton T-Shirt', 'Eco-friendly 100% organic cotton t-shirt', 29.99, 0.8, TRUE, 'EXCELLENT', 'Clothing', 100, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Bamboo Water Bottle', 'Reusable bamboo water bottle with stainless steel lining', 24.99, 0.5, TRUE, 'EXCELLENT', 'Accessories', 150, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Solar Power Bank', '10000mAh solar-powered portable charger', 49.99, 1.2, TRUE, 'GOOD', 'Electronics', 75, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Recycled Plastic Backpack', 'Durable backpack made from recycled ocean plastic', 59.99, 2.5, TRUE, 'GOOD', 'Accessories', 50, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Eco Laundry Detergent', 'Plant-based, biodegradable laundry detergent', 15.99, 0.6, TRUE, 'EXCELLENT', 'Home', 200, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('LED Light Bulbs Set', 'Energy-efficient LED bulbs (6 pack)', 34.99, 1.8, TRUE, 'GOOD', 'Home', 120, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Reusable Food Wraps', 'Beeswax-coated reusable food storage wraps', 19.99, 0.3, TRUE, 'EXCELLENT', 'Kitchen', 180, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Compostable Phone Case', 'Biodegradable phone case made from plants', 22.99, 0.4, TRUE, 'EXCELLENT', 'Electronics', 90, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Hemp Shopping Bags', 'Reusable hemp shopping bags (3 pack)', 16.99, 0.7, TRUE, 'EXCELLENT', 'Accessories', 160, 'https://via.placeholder.com/300', 2, TRUE, TRUE),
('Natural Bamboo Toothbrush', 'Biodegradable bamboo toothbrush', 4.99, 0.2, TRUE, 'EXCELLENT', 'Personal Care', 300, 'https://via.placeholder.com/300', 2, TRUE, TRUE);
