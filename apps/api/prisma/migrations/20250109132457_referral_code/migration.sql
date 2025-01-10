/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referredId_fkey";

-- AlterTable
ALTER TABLE "Referral" ALTER COLUMN "referredId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referralCode_key" ON "Referral"("referralCode");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
