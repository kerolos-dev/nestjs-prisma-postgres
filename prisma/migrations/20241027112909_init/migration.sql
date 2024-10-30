/*
  Warnings:

  - You are about to drop the column `agent` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `isValid` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Token` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "agent",
DROP COLUMN "expiredAt",
DROP COLUMN "isValid",
DROP COLUMN "token",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
