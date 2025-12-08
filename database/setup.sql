CREATE TABLE IF NOT EXISTS public.classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_year INTEGER NOT NULL CHECK (inv_year >= 1900),
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255) NOT NULL,
  inv_thumbnail VARCHAR(255) NOT NULL,
  inv_price DECIMAL(10, 2) NOT NULL CHECK (inv_price >= 0),
  inv_miles INTEGER NOT NULL CHECK (inv_miles >= 0),
  inv_color VARCHAR(50) NOT NULL,
  classification_id INTEGER NOT NULL,
  FOREIGN KEY (classification_id) REFERENCES public.classification (classification_id)
);

CREATE TABLE IF NOT EXISTS public.account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) NOT NULL UNIQUE,
  account_password VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) DEFAULT 'Client' CHECK (account_type IN ('Client', 'Employee', 'Admin'))
);

INSERT INTO public.classification (classification_name)
VALUES 
  ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan')
ON CONFLICT (classification_name) DO NOTHING;

INSERT INTO public.inventory (
  inv_make, inv_model, inv_year, inv_description, 
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
)
VALUES 
  ('DMC', 'Delorean', 1981, 'The DMC DeLorean is a rear-engine two-passenger sports car manufactured and marketed by John DeLoreans DeLorean Motor Company for the American market from 1981-83.',
   '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 40000.00, 50000, 'Silver', 1),
  ('Jeep', 'Wrangler', 2020, 'The Jeep Wrangler is a series of compact and mid-size four-wheel drive off-road SUVs manufactured by Jeep.',
   '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg', 35000.00, 25000, 'Red', 3),
  ('Ford', 'Mustang', 2022, 'The Ford Mustang is an American car manufactured by Ford.',
   '/images/vehicles/mustang.jpg', '/images/vehicles/mustang-tn.jpg', 45000.00, 10000, 'Blue', 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES ('Admin', 'User', 'admin@csemotors.com', '.YhKQh0YLl3gJxPzXGq3pqZlGZqHpWqK', 'Admin')
ON CONFLICT (account_email) DO NOTHING;