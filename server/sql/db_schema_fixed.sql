-- db_schema_fixed.sql
-- Rebuild schema for Cab Booking app (safe for a fresh database).
-- Run this in pgAdmin4 Query Tool connected to database: cab_booking

BEGIN;

-- Drop existing (ignore errors if they don't exist)
DROP VIEW IF EXISTS v_schedules_list;
DROP VIEW IF EXISTS v_routes_list;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS cabs CASCADE;
DROP TABLE IF EXISTS cab_operators CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Core tables
CREATE TABLE cab_operators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE cabs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  seats INT NOT NULL CHECK (seats > 0)
);

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  distance_km FLOAT NOT NULL CHECK (distance_km >= 0),
  eta_min INT NOT NULL CHECK (eta_min > 0),
  base_fare FLOAT NOT NULL CHECK (base_fare >= 0),
  active BOOLEAN DEFAULT TRUE,
  cab_operator_id INT REFERENCES cab_operators(id)
);

CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  cab_id INT REFERENCES cabs(id) ON DELETE CASCADE,
  route_id INT REFERENCES routes(id) ON DELETE CASCADE,
  frequency VARCHAR(20) NOT NULL,
  time TIME NOT NULL,
  price FLOAT NOT NULL CHECK (price >= 0)
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  route_id INT REFERENCES routes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bookings INT DEFAULT 0,
  completed INT DEFAULT 0,
  cancellations INT DEFAULT 0,
  revenue FLOAT DEFAULT 0
);

CREATE TABLE revenue (
  id SERIAL PRIMARY KEY,
  route_id INT REFERENCES routes(id) ON DELETE CASCADE,
  total_revenue FLOAT NOT NULL DEFAULT 0
);

CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(20),
  address VARCHAR(200),
  kyc_status VARCHAR(20) DEFAULT 'Pending'
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  profile_pic VARCHAR(200),
  status VARCHAR(20),
  disputes INT DEFAULT 0,
  rating FLOAT,
  joined DATE DEFAULT CURRENT_DATE
);

-- Seed data
INSERT INTO cab_operators (name, active) VALUES
  ('Cabz Inc', TRUE),
  ('CityRide', TRUE);

INSERT INTO cabs (name, type, seats) VALUES
  ('Cab 101', 'Sedan', 4),
  ('Cab 202', 'SUV', 6),
  ('Cab 303', 'Van', 8);

INSERT INTO routes (origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id) VALUES
  ('New York', 'Brooklyn', 15.50, 35, 25.00, TRUE, 1),
  ('Brooklyn', 'Queens', 22.80, 45, 32.50, TRUE, 1),
  ('San Jose', 'Palo Alto', 24.00, 40, 30.00, TRUE, 2);

INSERT INTO schedules (cab_id, route_id, frequency, time, price) VALUES
  (1, 1, 'Daily',  '09:00', 25.00),
  (2, 2, 'Daily',  '10:00', 32.50),
  (3, 3, 'Weekly', '08:30', 35.00);

INSERT INTO reports (route_id, date, bookings, completed, cancellations, revenue) VALUES
  (1, DATE '2025-08-01', 120, 115, 5, 2112.00),
  (2, DATE '2025-08-02',  90,  85, 5, 1820.00);

INSERT INTO revenue (route_id, total_revenue) VALUES
  (1, 2112.00),
  (2, 1440.00),
  (3, 1350.00);

INSERT INTO vendors (name, contact, address, kyc_status) VALUES
  ('Cab Vendor A', '+1-555-0100', '123 5th Ave', 'Verified'),
  ('Cab Vendor B', '+1-555-0101', '456 Market St', 'Pending');

INSERT INTO customers (name, email, phone, status, disputes, rating, joined) VALUES
  ('Alice', 'alice@example.com', '555-1212', 'Active', 0, 4.8, CURRENT_DATE - INTERVAL '30 days'),
  ('Bob', 'bob@example.com', '555-3434', 'Active', 1, 4.2, CURRENT_DATE - INTERVAL '10 days');

-- Convenience views for frontend list pages
CREATE OR REPLACE VIEW v_routes_list AS
SELECT
  id,
  origin AS "from",
  destination AS "to",
  CONCAT(distance_km, ' km') AS distance
FROM routes
WHERE active = TRUE;

CREATE OR REPLACE VIEW v_schedules_list AS
SELECT
  s.id,
  c.name AS cab,
  (r.origin || ' - ' || r.destination) AS route,
  s.frequency,
  TO_CHAR(s.time, 'HH24:MI') AS time,
  s.price
FROM schedules s
JOIN cabs c ON s.cab_id = c.id
JOIN routes r ON s.route_id = r.id;

COMMIT;
