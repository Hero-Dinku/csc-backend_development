-- =============================================
-- W02 Assignment: Task One - CRUD Operations
-- File: assignment2.sql
-- Purpose: Contains 6 specific SQL queries for database manipulation
-- =============================================

-- 1. INSERT: Add Tony Stark to the account table
-- The account_id is auto-generated, account_type defaults to 'Client'
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. UPDATE: Change Tony Stark's account type to Admin
-- Using email for precise targeting as it should be unique
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. DELETE: Remove Tony Stark from the database
-- Clean up after our operations
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. UPDATE: Modify GM Hummer description
-- Replace 'small interiors' with 'a huge interior' using REPLACE function
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. SELECT with INNER JOIN: Get Sport category vehicles
-- Combine inventory and classification tables to show only Sport vehicles
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification
    ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- 6. UPDATE: Add '/vehicles' to image paths
-- Update both inv_image and inv_thumbnail columns simultaneously
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');