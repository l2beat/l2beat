DROP TABLE IF EXISTS "TokenConnection";

CREATE TABLE "TokenRelation" (
    "tokenFromChain" VARCHAR(32) NOT NULL,
    "tokenFromAddress" VARCHAR(255) NOT NULL,
    "tokenToChain" VARCHAR(32) NOT NULL,
    "tokenToAddress" VARCHAR(255) NOT NULL,
    "plugin" VARCHAR(64) NOT NULL,
    "sourceWasBurned" BOOLEAN NOT NULL,
    "destinationWasMinted" BOOLEAN NOT NULL,
    "bridgeType" VARCHAR(32),
    "transfer" JSONB NOT NULL,

    CONSTRAINT "TokenRelation_pkey" PRIMARY KEY (
        "tokenFromChain",
        "tokenFromAddress",
        "tokenToChain",
        "tokenToAddress",
        "plugin",
        "sourceWasBurned",
        "destinationWasMinted"
    )
);

CREATE INDEX "TokenRelation_tokenFromChain_tokenFromAddress_idx"
ON "TokenRelation"("tokenFromChain", "tokenFromAddress");

CREATE INDEX "TokenRelation_tokenToChain_tokenToAddress_idx"
ON "TokenRelation"("tokenToChain", "tokenToAddress");

-- Deliberately no foreign keys to "DeployedToken": token relations are
-- observations of on-chain transfers and must be recordable before (or
-- without) either endpoint being catalogued as a deployed token.
-- See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
