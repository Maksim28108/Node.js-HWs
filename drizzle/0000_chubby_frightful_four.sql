CREATE TABLE "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"ingredient_id" varchar(255) NOT NULL,
	"units" integer NOT NULL
);
