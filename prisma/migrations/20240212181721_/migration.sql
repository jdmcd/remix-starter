-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwords" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "passwords_userId_key" ON "passwords"("userId");

-- CreateIndex
CREATE INDEX "passwords_userId_idx" ON "passwords"("userId");

-- AddForeignKey
ALTER TABLE "passwords" ADD CONSTRAINT "passwords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
