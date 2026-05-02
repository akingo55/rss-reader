-- CreateTable
CREATE TABLE "feeds" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "rss_url" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
