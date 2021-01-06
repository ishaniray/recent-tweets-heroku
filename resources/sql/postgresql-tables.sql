-- Table: public.searchedterms

-- DROP TABLE public.searchedterms;

CREATE TABLE public.searchedterms
(
    id integer NOT NULL DEFAULT nextval('searchedterms_id_seq'::regclass),
    hashtag character varying(255) COLLATE pg_catalog."default" NOT NULL,
    resulttype character varying(255) COLLATE pg_catalog."default" NOT NULL,
    searchedat timestamp without time zone NOT NULL,
    CONSTRAINT searchedterms_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.searchedterms
    OWNER to postgres;
