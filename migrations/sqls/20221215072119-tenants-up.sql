-- Table: public.tenants
-- DROP TABLE IF EXISTS public.tenants;
CREATE TABLE IF NOT EXISTS public.tenants (
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY (
        INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1
    ),
    "firstName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "practiceName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "practiceLink" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "isVerified" boolean NOT NULL DEFAULT false,
    "isAgree" boolean NOT NULL,
    "verificationCode" integer,
    "isResetPassword" boolean NOT NULL DEFAULT false,
    "isCodeTimeout" boolean NOT NULL DEFAULT false,
    "isDeleted" boolean NOT NULL DEFAULT false,
    specialization character varying(255) COLLATE pg_catalog."default",
    "addressLine1" character varying(255) COLLATE pg_catalog."default",
    "addressLine2" character varying(255) COLLATE pg_catalog."default",
    city character varying(255) COLLATE pg_catalog."default",
    state character varying(255) COLLATE pg_catalog."default",
    country character varying(255) COLLATE pg_catalog."default",
    pincode integer,
    "licenseNumber" character varying(255) COLLATE pg_catalog."default",
    timeout integer DEFAULT 1800,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    image character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT tenants_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE
    IF EXISTS public.tenants OWNER to postgres;