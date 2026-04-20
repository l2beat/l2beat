-- CreateTable
CREATE TABLE "TokenFactInput" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "arguments" TEXT NOT NULL,
    "context" JSONB,

    CONSTRAINT "TokenFactInput_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenFactInput_name_idx" ON "TokenFactInput"("name");
