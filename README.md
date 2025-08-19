# Cab Booking — Local Setup (by Abrar)

## Overview
This repo contains:
- server (Express + pg) -> `server/index.js`
- DB schema + seed -> `server/sql/db_schema_fixed.sql`
- Postman collection -> `server/sql/CabBooking.postman_collection.json`
- Demo images in `AbrarKivande/`

## Run locally (Windows 11)
1. Create DB in pgAdmin4: `cab_booking`.
2. In pgAdmin Query Tool run `server/sql/db_schema_fixed.sql`.
3. In `server` folder create `.env` from `.env.example` and set `PGPASSWORD`.
4. Start server:
cd server
npm install
node index.js
5. Start client (if client in repo root or `client` folder):
cd ..\client # or repo root if client present
npm install
npm start
6. Visit `http://localhost:3000`.

## Test steps (quick)
- Add/delete Cab, Route, Schedule in UI.
- Optional: import Postman collection from `server/sql` and test API calls.

## Notes
- Do not commit real credentials (.env is ignored).
- If issues occur, check server console for stack traces.
