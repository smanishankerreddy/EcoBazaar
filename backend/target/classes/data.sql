-- Roles are handled in code/enums
-- Sample Users
INSERT INTO user (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@ecobazaar.com', '$2a$10$hashedpasswordhere', 'ADMIN'),
(2, 'Seller User', 'seller@ecobazaar.com', '$2a$10$hashedpasswordhere', 'SELLER'),
(3, 'Normal User', 'user@ecobazaar.com', '$2a$10$hashedpasswordhere', 'USER');

-- Sample Products
INSERT INTO product (id, name, description, price, eco_rating, eco_certified, carbon_impact, image_url) VALUES
(1, 'Eco Bamboo Toothbrush', 'Sustainable bamboo toothbrush', 5.99, 'GOOD', true, 0.02, 'https://example.com/toothbrush.jpg'),
(2, 'Reusable Water Bottle', 'Stainless steel bottle', 15.50, 'EXCELLENT', true, 0.05, 'https://example.com/bottle.jpg'),
(3, 'Organic Cotton Bag', 'Eco-friendly shopping bag', 12.00, 'MODERATE', false, 0.08, 'https://example.com/bag.jpg');
