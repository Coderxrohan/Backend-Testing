-- db/schema.sql

-- Use pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Cab Operators
CREATE TABLE IF NOT EXISTS cab_operators (
  operator_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(15)  NOT NULL UNIQUE,
  license_no  VARCHAR(50)  NOT NULL,
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2) Routes
CREATE TABLE IF NOT EXISTS routes (
  route_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_point  VARCHAR(120) NOT NULL,
  end_point    VARCHAR(120) NOT NULL,
  distance_km  NUMERIC(7,2),
  eta_minutes  INTEGER,
  UNIQUE (start_point, end_point)
);

-- 3) Schedules (Cab on a Route at a time)
CREATE TABLE IF NOT EXISTS schedules (
  schedule_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id    UUID NOT NULL REFERENCES cab_operators(operator_id) ON DELETE CASCADE,
  route_id       UUID NOT NULL REFERENCES routes(route_id) ON DELETE CASCADE,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time   TIMESTAMPTZ,
  status         VARCHAR(40) NOT NULL DEFAULT 'Scheduled',
  CHECK (status IN ('Scheduled','In-Progress','Completed','Cancelled'))
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_schedules_operator_time ON schedules(operator_id, departure_time);
CREATE INDEX IF NOT EXISTS idx_schedules_route_time    ON schedules(route_id, departure_time);
