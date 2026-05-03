/*
  Warnings:

  - A unique constraint covering the columns `[feed_id,url]` on the table `articles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rss_url]` on the table `feeds` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "articles" ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "published_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feeds" (
    "profile_id" UUID NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_feeds_pkey" PRIMARY KEY ("profile_id","feed_id")
);

-- CreateTable
CREATE TABLE "article_reads" (
    "profile_id" UUID NOT NULL,
    "article_id" INTEGER NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_reads_pkey" PRIMARY KEY ("profile_id","article_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "articles_feed_id_url_key" ON "articles"("feed_id", "url");

-- CreateIndex
CREATE UNIQUE INDEX "feeds_rss_url_key" ON "feeds"("rss_url");

-- AddForeignKey
ALTER TABLE "user_feeds" ADD CONSTRAINT "user_feeds_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feeds" ADD CONSTRAINT "user_feeds_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_reads" ADD CONSTRAINT "article_reads_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_reads" ADD CONSTRAINT "article_reads_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
