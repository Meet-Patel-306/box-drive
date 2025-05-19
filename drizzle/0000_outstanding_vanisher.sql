CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"size" integer NOT NULL,
	"path" text NOT NULL,
	"type" text NOT NULL,
	"file_url" text NOT NULL,
	"thumbnail_url" text,
	"user_id" text NOT NULL,
	"parent_id" text,
	"is_starred" boolean DEFAULT false NOT NULL,
	"is_trash" boolean DEFAULT false NOT NULL,
	"is_folder" boolean DEFAULT false NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp DEFAULT now() NOT NULL
);
