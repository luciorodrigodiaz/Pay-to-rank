-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "totalBid" REAL NOT NULL DEFAULT 0.0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entryId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "paymentIntentId" TEXT,
    "payerEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bid_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Bid_paymentIntentId_key" ON "Bid"("paymentIntentId");
