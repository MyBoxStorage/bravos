-- AlterTable
ALTER TABLE "generations" ADD COLUMN "expires_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "generations" ADD COLUMN "is_expired" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "generations_expires_at_is_expired_idx" ON "generations"("expires_at", "is_expired");
