-- CreateTable
CREATE TABLE "EthereumSupplyDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "supply" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EthereumSupplyDaily_pkey" PRIMARY KEY ("timestamp")
);
