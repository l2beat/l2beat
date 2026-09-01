DROP TABLE IF EXISTS "TokenConnection";

-- A TokenRelation is identified by the route and its plugin-level
-- classification. The observed burn/mint flags are deliberately NOT columns:
-- they are nullable observations on interop transfers and live in the
-- "transfer" evidence JSON exactly as observed. Materializing them as
-- non-nullable columns previously forced fabricated `false` values for
-- one-sided transfers. See
-- docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
CREATE TABLE "TokenRelation" (
    "tokenFromChain" VARCHAR(32) NOT NULL,
    "tokenFromAddress" VARCHAR(255) NOT NULL,
    "tokenToChain" VARCHAR(32) NOT NULL,
    "tokenToAddress" VARCHAR(255) NOT NULL,
    "plugin" VARCHAR(64) NOT NULL,
    "bridgeType" VARCHAR(32) NOT NULL,
    "transfer" JSONB NOT NULL,

    CONSTRAINT "TokenRelation_pkey" PRIMARY KEY (
        "tokenFromChain",
        "tokenFromAddress",
        "tokenToChain",
        "tokenToAddress",
        "plugin",
        "bridgeType"
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
