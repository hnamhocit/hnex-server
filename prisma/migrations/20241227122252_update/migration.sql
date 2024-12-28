/*
  Warnings:

  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Reaction` table. All the data in the column will be lost.
  - Added the required column `type` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('ANGRY', 'LIKE', 'HEART', 'SURPRISE', 'CRY', 'SMILE');

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "name",
ADD COLUMN     "type" "ReactionType" NOT NULL;

-- DropEnum
DROP TYPE "MediaType";
