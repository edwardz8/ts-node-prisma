/*
  Warnings:

  - You are about to drop the column `description` on the `Pitcher` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Pitcher` table. All the data in the column will be lost.
  - You are about to drop the `_PitcherToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PitcherToTag" DROP CONSTRAINT "_PitcherToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PitcherToTag" DROP CONSTRAINT "_PitcherToTag_B_fkey";

-- DropIndex
DROP INDEX "Pitcher_slug_key";

-- AlterTable
ALTER TABLE "Pitcher" DROP COLUMN "description",
DROP COLUMN "slug";

-- DropTable
DROP TABLE "_PitcherToTag";
