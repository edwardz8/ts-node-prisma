/*
  Warnings:

  - You are about to drop the column `authorId` on the `Pitcher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pitcher" DROP CONSTRAINT "Pitcher_authorId_fkey";

-- AlterTable
ALTER TABLE "Pitcher" DROP COLUMN "authorId";
