-- Create database
CREATE DATABASE IF NOT EXISTS cse340;
USE cse340;

-- Create classifications table
CREATE TABLE classification (
    classification_id INT AUTO_INCREMENT PRIMARY KEY,
    classification_name VARCHAR(30) NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE inventory (
    inv_id INT AUTO_INCREMENT PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INT NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL,
    inv_thumbnail VARCHAR(255) NOT NULL,
    inv_price DECIMAL(10,2) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

-- Insert sample classifications
INSERT INTO classification (classification_name) VALUES 
('Custom'),
('Sedan'),
('SUV'),
('Truck');

-- Insert sample vehicles
INSERT INTO inventory (
    inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, 
    inv_color, classification_id
) VALUES 
('DMC', 'Delorean', 1985, 'The iconic time-traveling sports car from Back to the Future. Features gull-wing doors and stainless steel body.', 
'/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', 65000.00, 12500, 'Silver', 1),

('Nissan', 'Sentra SV', 2019, 'Reliable and fuel-efficient compact sedan with modern features and comfortable interior.', 
'/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', 16999.00, 74750, 'Blue', 2),

('Jeep', 'Grand Cherokee', 2022, 'Powerful SUV with off-road capabilities and luxurious interior features.', 
'/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', 42999.00, 15000, 'Black', 3),

('Ford', 'F-150', 2021, 'Americas best-selling truck with powerful engine options and advanced towing capabilities.', 
'/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', 38999.00, 22000, 'White', 4);
