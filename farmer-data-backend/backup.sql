--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: app_user
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'SuperAdmin',
    'CEO'
);


ALTER TYPE public."enum_Users_role" OWNER TO app_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Farmers; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public."Farmers" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "fatherName" character varying(255),
    sex character varying(255),
    age integer,
    "familyMembers" jsonb,
    "landType" character varying(255),
    income integer,
    aadhar character varying(255),
    "farmerId" character varying(255),
    crops jsonb,
    contact character varying(255),
    location jsonb NOT NULL,
    "locationCoords" jsonb,
    photo character varying(255),
    "ceoId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastEditedAt" timestamp with time zone
);


ALTER TABLE public."Farmers" OWNER TO app_user;

--
-- Name: Farmers_id_seq; Type: SEQUENCE; Schema: public; Owner: app_user
--

CREATE SEQUENCE public."Farmers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Farmers_id_seq" OWNER TO app_user;

--
-- Name: Farmers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app_user
--

ALTER SEQUENCE public."Farmers_id_seq" OWNED BY public."Farmers".id;


--
-- Name: Locations; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public."Locations" (
    id integer NOT NULL,
    state character varying(255) NOT NULL,
    "locationData" jsonb NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Locations" OWNER TO app_user;

--
-- Name: Locations_id_seq; Type: SEQUENCE; Schema: public; Owner: app_user
--

CREATE SEQUENCE public."Locations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Locations_id_seq" OWNER TO app_user;

--
-- Name: Locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app_user
--

ALTER SEQUENCE public."Locations_id_seq" OWNED BY public."Locations".id;


--
-- Name: Memberships; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public."Memberships" (
    id integer NOT NULL,
    "farmerId" integer NOT NULL,
    "ceoId" integer NOT NULL,
    "membershipFee" integer NOT NULL,
    "receiptNo" character varying(255) NOT NULL,
    "receiptPicture" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Memberships" OWNER TO app_user;

--
-- Name: Memberships_id_seq; Type: SEQUENCE; Schema: public; Owner: app_user
--

CREATE SEQUENCE public."Memberships_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Memberships_id_seq" OWNER TO app_user;

--
-- Name: Memberships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app_user
--

ALTER SEQUENCE public."Memberships_id_seq" OWNED BY public."Memberships".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO app_user;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" NOT NULL,
    "fpoName" character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Users" OWNER TO app_user;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: app_user
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO app_user;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app_user
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Farmers id; Type: DEFAULT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Farmers" ALTER COLUMN id SET DEFAULT nextval('public."Farmers_id_seq"'::regclass);


--
-- Name: Locations id; Type: DEFAULT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Locations" ALTER COLUMN id SET DEFAULT nextval('public."Locations_id_seq"'::regclass);


--
-- Name: Memberships id; Type: DEFAULT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Memberships" ALTER COLUMN id SET DEFAULT nextval('public."Memberships_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Farmers; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public."Farmers" (id, name, "fatherName", sex, age, "familyMembers", "landType", income, aadhar, "farmerId", crops, contact, location, "locationCoords", photo, "ceoId", "createdAt", "updatedAt", "lastEditedAt") FROM stdin;
1	fgfgdf	fhsgdhfgh	M	23	{"boys": 4, "girls": 5}	own	23142341	34123534543535	34523463	["reeee"]	4123543	{"block": "Haveli", "state": "Maharashtra", "village": "Village1", "district": "Pune", "panchayat": "Khadakwasla"}	{"lat": "", "long": ""}	/Uploads/1744570487687-test.jpg	2	2025-04-14 00:24:47.7+05:30	2025-04-14 00:45:38.154+05:30	2025-04-14 00:45:38.151+05:30
2	ANIKET	fyhkhhg	M	28	{"boys": 1, "girls": 2}	Own	547464	341235345435	34523463	["rice", "dal"]	7767676879	{"block": "Haveli", "state": "Maharashtra", "village": "Village1", "district": "Pune", "panchayat": "Khadakwasla"}	{"lat": 0, "long": 0}	/Uploads/1745006409391-test.jpg	2	2025-04-19 01:30:10.031+05:30	2025-04-19 01:30:10.031+05:30	2025-04-19 01:30:10.03+05:30
3	hgdshf	sfgadfsg	M	28	{"boys": 4, "girls": 0}	Own	100000	111111111111	tuwyoeri	["dal"]	6565656565	{"block": "Haveli", "state": "Maharashtra", "village": "Village1", "district": "Pune", "panchayat": "Khadakwasla"}	{"lat": 0, "long": 0}	/Uploads/1745057744948-test.jpg	2	2025-04-19 15:45:44.953+05:30	2025-04-19 15:45:44.953+05:30	2025-04-19 15:45:44.952+05:30
\.


--
-- Data for Name: Locations; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public."Locations" (id, state, "locationData", "createdAt", "updatedAt") FROM stdin;
1	Maharashtra	{"districts": [{"name": "Pune", "blocks": [{"name": "Haveli", "panchayats": [{"name": "Khadakwasla", "villages": [{"name": "Village1", "coords": {"lat": 18.45, "long": 73.77}}]}]}]}]}	2025-04-13 18:01:24.189+05:30	2025-04-13 18:01:24.189+05:30
\.


--
-- Data for Name: Memberships; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public."Memberships" (id, "farmerId", "ceoId", "membershipFee", "receiptNo", "receiptPicture", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250413122733-create-user.js
20250413122814-create-farmer.js
20250413122835-create-location.js
20250413182438-add-last-edited-at-to-farmers.js
20250419182428-remove-memberFee-from-farmers.js
20250419182504-create-memberships.js
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public."Users" (id, name, email, password, role, "fpoName", "createdAt", "updatedAt") FROM stdin;
1	Super Admin	admin@example.com	$2b$10$y8FpOH/MfNZp.kITQ5kmNuizeGYr0GmAvXunoXxQsQnQBEb.6rd1u	SuperAdmin	\N	2025-04-13 18:01:24.176+05:30	2025-04-13 18:01:24.176+05:30
2	John Doe	ceo@example.com	$2b$10$gvy7UeoCoBYNriS904fQVOMyvU3qnoTjpdpCochDTOx3NO3us1a5m	CEO	Test FPO	2025-04-13 18:11:02.309+05:30	2025-04-13 18:11:02.309+05:30
3	aniket	aniketnayak@gmail.com	$2b$10$MYxvRwpBcaE1bSd/.4voLOfmoeTytKdqp.sLEBZ5fxNLT0efwA7hy	CEO	fpo1	2025-04-14 10:33:07.25+05:30	2025-04-14 10:33:07.25+05:30
\.


--
-- Name: Farmers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app_user
--

SELECT pg_catalog.setval('public."Farmers_id_seq"', 3, true);


--
-- Name: Locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app_user
--

SELECT pg_catalog.setval('public."Locations_id_seq"', 1, true);


--
-- Name: Memberships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app_user
--

SELECT pg_catalog.setval('public."Memberships_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app_user
--

SELECT pg_catalog.setval('public."Users_id_seq"', 3, true);


--
-- Name: Farmers Farmers_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Farmers"
    ADD CONSTRAINT "Farmers_pkey" PRIMARY KEY (id);


--
-- Name: Locations Locations_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_pkey" PRIMARY KEY (id);


--
-- Name: Memberships Memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Memberships"
    ADD CONSTRAINT "Memberships_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Farmers Farmers_ceoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Farmers"
    ADD CONSTRAINT "Farmers_ceoId_fkey" FOREIGN KEY ("ceoId") REFERENCES public."Users"(id);


--
-- Name: Memberships Memberships_ceoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Memberships"
    ADD CONSTRAINT "Memberships_ceoId_fkey" FOREIGN KEY ("ceoId") REFERENCES public."Users"(id);


--
-- Name: Memberships Memberships_farmerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public."Memberships"
    ADD CONSTRAINT "Memberships_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES public."Farmers"(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO app_user;


--
-- PostgreSQL database dump complete
--

