/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'REFRESH_TOKEN';

-- DropIndex
DROP INDEX "token_idx";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "last_activity" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
