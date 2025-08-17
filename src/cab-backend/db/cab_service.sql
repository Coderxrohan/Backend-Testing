--
-- PostgreSQL database dump
--

\restrict ywkEh8UfiMuwXmh9HsUA7M3TaFImhkUheRJr9l9xEDjXAfX8EWuZS3MROZLTRH3

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cab_operators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cab_operators (
    operator_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    city character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cab_operators OWNER TO postgres;

--
-- Name: cab_operators_operator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cab_operators_operator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cab_operators_operator_id_seq OWNER TO postgres;

--
-- Name: cab_operators_operator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cab_operators_operator_id_seq OWNED BY public.cab_operators.operator_id;


--
-- Name: routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routes (
    route_id bigint NOT NULL,
    origin character varying(255) NOT NULL,
    destination character varying(255) NOT NULL,
    distance_km double precision NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.routes OWNER TO postgres;

--
-- Name: routes_route_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.routes_route_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routes_route_id_seq OWNER TO postgres;

--
-- Name: routes_route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.routes_route_id_seq OWNED BY public.routes.route_id;


--
-- Name: cab_operators operator_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_operators ALTER COLUMN operator_id SET DEFAULT nextval('public.cab_operators_operator_id_seq'::regclass);


--
-- Name: routes route_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes ALTER COLUMN route_id SET DEFAULT nextval('public.routes_route_id_seq'::regclass);


--
-- Data for Name: cab_operators; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cab_operators (operator_id, name, email, phone, city, created_at) FROM stdin;
\.


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routes (route_id, origin, destination, distance_km, created_at) FROM stdin;
8	Pune	Mumbai	150	2025-08-17 09:50:45.225159
10	Bangalore	Mysore	145	2025-08-17 09:50:45.276509
13	nigadi	pimpri	6.1	2025-08-17 11:26:24.738925
\.


--
-- Name: cab_operators_operator_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cab_operators_operator_id_seq', 1, false);


--
-- Name: routes_route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.routes_route_id_seq', 14, true);


--
-- Name: cab_operators cab_operators_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_operators
    ADD CONSTRAINT cab_operators_email_key UNIQUE (email);


--
-- Name: cab_operators cab_operators_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_operators
    ADD CONSTRAINT cab_operators_phone_key UNIQUE (phone);


--
-- Name: cab_operators cab_operators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_operators
    ADD CONSTRAINT cab_operators_pkey PRIMARY KEY (operator_id);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (route_id);


--
-- PostgreSQL database dump complete
--

\unrestrict ywkEh8UfiMuwXmh9HsUA7M3TaFImhkUheRJr9l9xEDjXAfX8EWuZS3MROZLTRH3

