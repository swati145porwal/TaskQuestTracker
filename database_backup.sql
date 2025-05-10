--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avatars; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.avatars (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    streak_required integer DEFAULT 0 NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    description text,
    category text
);


ALTER TABLE public.avatars OWNER TO neondb_owner;

--
-- Name: avatars_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.avatars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avatars_id_seq OWNER TO neondb_owner;

--
-- Name: avatars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.avatars_id_seq OWNED BY public.avatars.id;


--
-- Name: completed_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.completed_tasks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    task_id integer NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL,
    points_earned integer NOT NULL
);


ALTER TABLE public.completed_tasks OWNER TO neondb_owner;

--
-- Name: completed_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.completed_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.completed_tasks_id_seq OWNER TO neondb_owner;

--
-- Name: completed_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.completed_tasks_id_seq OWNED BY public.completed_tasks.id;


--
-- Name: redeemed_rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.redeemed_rewards (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reward_id integer NOT NULL,
    redeemed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.redeemed_rewards OWNER TO neondb_owner;

--
-- Name: redeemed_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.redeemed_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.redeemed_rewards_id_seq OWNER TO neondb_owner;

--
-- Name: redeemed_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.redeemed_rewards_id_seq OWNED BY public.redeemed_rewards.id;


--
-- Name: rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rewards (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    description text,
    points integer NOT NULL,
    icon text NOT NULL,
    color text NOT NULL
);


ALTER TABLE public.rewards OWNER TO neondb_owner;

--
-- Name: rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rewards_id_seq OWNER TO neondb_owner;

--
-- Name: rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.rewards_id_seq OWNED BY public.rewards.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    description text,
    points integer NOT NULL,
    "time" text,
    date text,
    is_completed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    category text,
    google_event_id text,
    priority text DEFAULT 'medium'::text
);


ALTER TABLE public.tasks OWNER TO neondb_owner;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO neondb_owner;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    streak integer DEFAULT 0 NOT NULL,
    google_refresh_token text,
    google_email text,
    google_picture_url text,
    current_avatar_id integer
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: avatars id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.avatars ALTER COLUMN id SET DEFAULT nextval('public.avatars_id_seq'::regclass);


--
-- Name: completed_tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.completed_tasks ALTER COLUMN id SET DEFAULT nextval('public.completed_tasks_id_seq'::regclass);


--
-- Name: redeemed_rewards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redeemed_rewards ALTER COLUMN id SET DEFAULT nextval('public.redeemed_rewards_id_seq'::regclass);


--
-- Name: rewards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rewards ALTER COLUMN id SET DEFAULT nextval('public.rewards_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: avatars; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.avatars (id, name, image_url, streak_required, is_default, description, category) FROM stdin;
9	Purple Hair	/avatars/avatar1.svg	0	t	\N	\N
10	Orange Glasses	/avatars/avatar2.svg	0	t	\N	\N
11	Robot	/avatars/avatar3.svg	3	f	\N	\N
12	Kitty	/avatars/avatar4.svg	7	f	\N	\N
13	Alien	/avatars/avatar5.svg	14	f	\N	\N
14	Ninja	/avatars/avatar6.svg	21	f	\N	\N
15	Royal	/avatars/avatar7.svg	30	f	\N	\N
16	Wizard	/avatars/avatar8.svg	60	f	\N	\N
\.


--
-- Data for Name: completed_tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.completed_tasks (id, user_id, task_id, completed_at, points_earned) FROM stdin;
1	2	1	2025-04-28 14:17:49.848583	25
2	1	4	2025-04-28 16:50:44.761087	50
3	2	2	2025-04-28 17:43:24.108064	25
4	2	8	2025-04-29 04:51:47.575526	25
5	2	12	2025-04-29 06:59:12.952079	25
6	2	13	2025-04-29 09:04:48.159607	30
7	2	14	2025-04-29 09:32:28.68761	20
8	2	16	2025-04-29 09:49:44.25531	100
9	2	10	2025-04-29 16:36:19.109739	100
10	2	9	2025-04-29 17:50:19.784077	50
11	2	17	2025-04-29 18:20:35.273044	75
12	2	11	2025-04-29 18:20:36.103532	100
13	2	29	2025-04-30 11:01:00.920098	15
14	2	30	2025-04-30 13:48:21.405049	25
15	2	28	2025-04-30 13:48:23.266548	15
16	2	26	2025-04-30 13:48:24.837542	75
17	2	21	2025-04-30 17:14:03.539678	50
18	2	15	2025-05-02 05:23:39.809351	50
19	2	33	2025-05-02 10:51:15.284359	100
20	2	32	2025-05-02 16:13:44.030733	75
21	2	34	2025-05-02 16:13:45.191344	50
22	2	35	2025-05-02 16:13:46.19454	100
23	2	23	2025-05-04 05:57:16.701856	75
24	2	31	2025-05-04 05:57:18.75913	100
25	2	22	2025-05-04 05:57:20.78814	75
26	2	19	2025-05-04 05:57:23.515061	25
27	2	36	2025-05-04 05:57:50.528521	10
\.


--
-- Data for Name: redeemed_rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.redeemed_rewards (id, user_id, reward_id, redeemed_at) FROM stdin;
\.


--
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rewards (id, user_id, title, description, points, icon, color) FROM stdin;
2	2	Good headphones	\N	100000	ri-headphone-line	from-accent-500 to-secondary-500
3	2	New PS5 game	\N	5000	ri-game-line	from-primary-500 to-accent-500
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
IvKXveh0kjaTLZfQd6IarHn9nxBH7MxA	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-05T14:59:14.422Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":3}}	2025-05-05 20:00:38
_N7vWtCrfiSQDt3dwBzZnVpYzVFDnOhA	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-07T08:24:58.240Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-05-11 06:01:44
CH2_PBsOnZLc3SfUVe-ja9DF5VcGJG3n	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-05T17:17:25.838Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":4}}	2025-05-05 17:18:32
1nHEO35CmzJMaF-1B6B8fZ4JGnSGBpxs	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-07T07:08:28.784Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-05-09 06:34:55
CxXF_1lX2GijfZdOc0ZDPF1OkM5AJsi3	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-07T11:00:29.988Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":2}}	2025-05-09 16:13:52
umXb_-ayO5Q6FxWXlEgA9vYuxJfA3m3C	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-06T17:14:52.878Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":2}}	2025-05-11 05:57:58
UpXzcVWznZJaN7bDMWIQLUUMvvQ_BLoG	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-06T18:06:59.620Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":5}}	2025-05-06 18:08:02
DpemSSFEJWVjjXxUNygZb7-2v1pyFjD_	{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-06T18:16:31.093Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":6}}	2025-05-06 18:17:14
xWSgBDBmFlCp-1M6OyvaBkgDGVgF-haS	{"cookie":{"originalMaxAge":604799999,"expires":"2025-05-06T20:46:03.554Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":7}}	2025-05-06 20:46:19
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tasks (id, user_id, title, description, points, "time", date, is_completed, created_at, category, google_event_id, priority) FROM stdin;
4	1	Zumba	\N	50	\N	\N	t	2025-04-28 16:50:37.199319	Health	\N	medium
5	4	Gossip with Mausi 	Gossip gossip	10	Now 	\N	f	2025-04-28 17:18:21.004563	Wellness	\N	medium
7	1	Embroider for 30 mins	\N	50	\N	\N	f	2025-04-28 18:32:04.690798	Health	\N	medium
8	2	Zumba	30 mins	25	\N	\N	t	2025-04-29 04:40:58.287125	Health	\N	medium
12	2	Electromin meet without getting izzy	\N	25	\N	\N	t	2025-04-29 04:50:21.284849	Work	\N	medium
13	2	AJP 15	\N	30	\N	\N	t	2025-04-29 04:51:24.852612	Personal	\N	medium
14	2	Take meds	\N	20	\N	\N	t	2025-04-29 04:51:39.254146	Health	\N	medium
16	2	Complete App Management PRD	\N	100	\N	\N	t	2025-04-29 05:18:14.874124	Work	\N	medium
10	2	Wrap up the product case study, pt 1	\N	100	\N	\N	t	2025-04-29 04:45:49.096182	Health	\N	medium
9	2	Drink 2 stanley cups worth of water	\N	50	\N	\N	t	2025-04-29 04:45:09.553345	Health	\N	medium
17	2	Build a separate product portfolio, progress path 1	\N	75	\N	\N	t	2025-04-29 11:32:57.051856	Self-improvement	\N	medium
11	2	Wrap up the product case study part 2	\N	100	\N	\N	t	2025-04-29 04:46:17.448722	Personal	\N	medium
24	8	Test123	Testing	60	\N	\N	f	2025-04-30 07:09:33.636371	Wellness	\N	medium
25	8	Test2	Test2	50	\N	\N	f	2025-04-30 07:09:55.133803	Health	\N	medium
29	2	Driver deboarding 	\N	15	\N	\N	t	2025-04-30 08:59:51.828389	Work	\N	medium
30	2	Give willo	\N	25	\N	\N	t	2025-04-30 13:48:13.961534	Health	\N	medium
28	2	Alert Management 	\N	15	\N	\N	t	2025-04-30 08:59:21.819417	Work	\N	medium
26	2	Make TaskQuest much better	\N	75	\N	\N	t	2025-04-30 07:27:45.083239	Work	\N	medium
21	2	Drink 2 stanley cups worth of water	\N	50	\N	\N	t	2025-04-30 05:25:24.918177	Health	\N	medium
15	2	Embroidery or Read for 30 mins	\N	50	\N	\N	t	2025-04-29 04:55:20.082879	Personal	\N	medium
33	2	Adnoc	\N	100	\N	\N	t	2025-05-02 10:10:52.278663	Health	\N	medium
32	2	Drink 2 stanley cupz	\N	75	\N	\N	t	2025-05-02 10:10:37.721435	Health	\N	medium
34	2	Saas What to communicate	\N	50	\N	\N	t	2025-05-02 10:11:17.573	Work	\N	medium
35	2	Int 1 and 2	\N	100	\N	\N	t	2025-05-02 10:11:39.639048	Work	\N	medium
23	2	AJP 15	\N	75	\N	\N	t	2025-04-30 06:29:32.230486	Health	\N	medium
31	2	Locally deploy on cursor pt1	\N	100	\N	\N	t	2025-05-02 10:09:43.879015	Personal	\N	medium
22	2	Build a separate product portfolio part 1	\N	75	\N	\N	t	2025-04-30 05:27:51.054031	Health	\N	medium
19	2	Zumba	\N	25	\N	\N	t	2025-04-30 05:25:01.349485	Health	\N	medium
36	2	Wake up before 11	\N	10	\N	\N	t	2025-05-04 05:57:45.036349	Health	\N	medium
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, points, streak, google_refresh_token, google_email, google_picture_url, current_avatar_id) FROM stdin;
3	belikeswap	b7abb86544bec6baf98ca1ec269da542f780a5b208cbe09d2ac57f1ae05fd16bde1393860ea31fe9e2aab2bed1adcb29f5b67210813bbb51bc06345e916136a8.bae865db9312fcc1cd2a1169151f85f8	0	0	\N	\N	\N	\N
1	swatip14	2336d522b4bca97d7de778bc80eaae4684f16551aed747243fdfea540a9ce33e31c2876efe790b9153601755e4fb65c29561774a387f447e13327774cfeafb9e.5d8faa7b13842dc391b8100dcc8e0fe9	50	0	\N	\N	\N	\N
4	Ani	e62d6be7d23adf30e8c3b744e0f30ff9d7ff660cadd4c3cedc705940de0f63162a94ffee4e2788a03740a99afdfd26ea83b5ea6cf9449683f3a9a3ce8dab4db4.4e9a281ef7e40f8296c6e515f209dc44	0	0	\N	\N	\N	\N
2	swatip145	07f9c2b4882caa96324820f6b3a98c35cd30bf77dd1d0c54c87357d38b7d75d5dd67b45baab5a9a41461b403869ed80ed729f2ddbb30476855866b8cb866080f.7ce357563efa961e08075abb22a712a0	1415	2	\N	\N	\N	10
5	abc123	9f6e836bcc693eb76ac9e83e11a65cff552ce3c26a285218f91201e9988abb1a97ebf1f0c8fb67083bd0448829e7c1d44b43b1a55f3a2daa3daeca7990581d46.c48a57abf8a77d4a09b71736c41d9f6b	0	0	\N	\N	\N	\N
6	neeharikab31	68e64c0b43b05cdb4fc0cb8ca6382d8d5e5213019aa3a6258ed787abf89b5a0d29737c36382c522648574a618bfbdf5582cc1d78a0ad6ac903c7efaa798e9100.84644785b4f65173144eabea77aeb6d6	0	0	\N	\N	\N	\N
7	aaaaaaaaaa	bd15cfef4a2ad99d8563247e47286a5f0903f84b5fefdaee7d1ff4642c7f3c8d1dc1c0b38f734197adef3c319b958f0db7523e0093cc4e5bd123272a8bc4b906.b8796db8a65df05ac6e0e9820856efc6	0	0	\N	\N	\N	\N
8	shubham123	59b2d007c5d77f3658f1571585e6cf3b9cd56e2e051ee37d934a1423d9d0cf8283beec80bb4314e6ebbf2f369223c9f216615822ecf1e9486fed395899ee1c3b.a3d64b5098f3e3fc14969fcaaab8b0e5	0	0	\N	\N	\N	\N
\.


--
-- Name: avatars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.avatars_id_seq', 16, true);


--
-- Name: completed_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.completed_tasks_id_seq', 27, true);


--
-- Name: redeemed_rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.redeemed_rewards_id_seq', 1, false);


--
-- Name: rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.rewards_id_seq', 3, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tasks_id_seq', 36, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: avatars avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.avatars
    ADD CONSTRAINT avatars_pkey PRIMARY KEY (id);


--
-- Name: completed_tasks completed_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_pkey PRIMARY KEY (id);


--
-- Name: redeemed_rewards redeemed_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redeemed_rewards
    ADD CONSTRAINT redeemed_rewards_pkey PRIMARY KEY (id);


--
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

