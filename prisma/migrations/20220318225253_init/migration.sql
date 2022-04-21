/*
  Warnings:

  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pitcherId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_B_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "image" TEXT DEFAULT E'https://wallpapercave.com/wp/PDI4CCU.jpg';

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "pitcherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DEFAULT E'https://wallpapercave.com/wp/PDI4CCU.jpg';

-- DropTable
DROP TABLE "_UserFavorites";

-- CreateTable
CREATE TABLE "Pitcher" (
    "name" VARCHAR(20) NOT NULL,
    "team" VARCHAR(20),
    "wins" INTEGER,
    "losses" INTEGER,
    "era" DECIMAL,
    "games" INTEGER,
    "games_started" INTEGER,
    "saves" INTEGER,
    "innings_pitched" DECIMAL,
    "hits" INTEGER,
    "earned_runs" INTEGER,
    "home_runs_allowed" INTEGER,
    "strikeouts" INTEGER,
    "walks" INTEGER,
    "whip" DECIMAL,
    "ks_per_nine" DECIMAL,
    "walks_per_nine" DECIMAL,
    "fip" DECIMAL,
    "war" DECIMAL,
    "ra_nine_war" DECIMAL,
    "adp" DECIMAL,
    "id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Pitcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFavoriteArticles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PitcherToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFavoritePitchers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pitcher_slug_key" ON "Pitcher"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavoriteArticles_AB_unique" ON "_UserFavoriteArticles"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavoriteArticles_B_index" ON "_UserFavoriteArticles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PitcherToTag_AB_unique" ON "_PitcherToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PitcherToTag_B_index" ON "_PitcherToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavoritePitchers_AB_unique" ON "_UserFavoritePitchers"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavoritePitchers_B_index" ON "_UserFavoritePitchers"("B");

-- AddForeignKey
ALTER TABLE "Pitcher" ADD CONSTRAINT "Pitcher_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pitcherId_fkey" FOREIGN KEY ("pitcherId") REFERENCES "Pitcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoriteArticles" ADD FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoriteArticles" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PitcherToTag" ADD FOREIGN KEY ("A") REFERENCES "Pitcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PitcherToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePitchers" ADD FOREIGN KEY ("A") REFERENCES "Pitcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePitchers" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Article.slug_unique" RENAME TO "Article_slug_key";

-- RenameIndex
ALTER INDEX "Tag.name_unique" RENAME TO "Tag_name_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.username_unique" RENAME TO "User_username_key";
