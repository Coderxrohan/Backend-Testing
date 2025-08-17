-- SQL schema for all required tables for cab booking app.

-- Cab Operators Table
CREATE TABLE cab_operators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- Routes Table
CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  origin VARCHAR(100),
  destination VARCHAR(100),
  distance_km FLOAT,
  eta_min INT,
  base_fare FLOAT,
  active BOOLEAN,
  cab_operator_id INT REFERENCES cab_operators(id)
);

-- Reports Table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  route_id INT REFERENCES routes(id),
  date DATE,
  bookings INT,
  completed INT,
  cancellations INT,
  revenue FLOAT
);

-- Revenue Table
CREATE TABLE revenue (
  id SERIAL PRIMARY KEY,
  route_id INT REFERENCES routes(id),
  total_revenue FLOAT
);

-- Vendors Table
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(20),
  address VARCHAR(200),
  kyc_status VARCHAR(20) DEFAULT 'Pending'
);

-- Customers Table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  profile_pic VARCHAR(200),
  status VARCHAR(20),
  disputes INT,
  rating FLOAT,
  joined DATE
);
