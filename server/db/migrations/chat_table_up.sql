CREATE TABLE "chat"(
                       "id" varchar PRIMARY KEY NOT NULL,
                       "name" varchar NOT NULL,
                       "created_at" TIMESTAMP DEFAULT current_timestamp
)