-- Reshapes `TokenRelation` from a pair of endpoints that read like a direction
-- into an explicitly unordered pair with a role.
--
-- Both statements below are metadata-only, so this migration is effectively
-- instantaneous regardless of table size, and Prisma runs the file in a single
-- transaction — either both changes land or neither does.
-- See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.

-- 1. `tokenFrom`/`tokenTo` never meant a direction: the endpoints of a relation
--    are an unordered pair, and reading the names as "the transfer went from
--    here to there" is exactly the mistake that made the graph arrows and the
--    Relations tab arbitrary. `tokenA`/`tokenB` cannot be misread that way.
--    Which endpoint is which is decided by lexicographic order, and the role
--    each one plays is carried by `lockedToken` below.
--
--    `RENAME COLUMN` rewrites the primary key and both endpoint indexes in
--    place: no table rewrite and no index rebuild.
--
--    This is the one change here that is NOT backwards compatible — code
--    deployed before this migration queries columns that no longer exist. The
--    same PR updates the repository to address the new names while still
--    exposing the old field names to its callers, so the only affected window
--    is between this migration landing and that PR's own deploy. Relation
--    ingestion fails loudly and is retried from an unadvanced cursor
--    (`TokenIngestionLoop` catches it), so nothing is lost.
ALTER TABLE "TokenRelation" RENAME COLUMN "tokenFromChain" TO "tokenAChain";
ALTER TABLE "TokenRelation" RENAME COLUMN "tokenFromAddress" TO "tokenAAddress";
ALTER TABLE "TokenRelation" RENAME COLUMN "tokenToChain" TO "tokenBChain";
ALTER TABLE "TokenRelation" RENAME COLUMN "tokenToAddress" TO "tokenBAddress";

--    Index definitions follow the rename automatically, but their names do not.
--    Prisma derives an index name from its columns and reports a mismatch as
--    drift, so rename them to what `schema.prisma` now implies. Also
--    metadata-only.
ALTER INDEX "TokenRelation_tokenFromChain_tokenFromAddress_idx"
  RENAME TO "TokenRelation_tokenAChain_tokenAAddress_idx";
ALTER INDEX "TokenRelation_tokenToChain_tokenToAddress_idx"
  RENAME TO "TokenRelation_tokenBChain_tokenBAddress_idx";

-- 2. Which endpoint of a `lockAndMint` relation holds the locked (escrowed)
--    token: 'A' or 'B'. The complementary endpoint holds the minted
--    representation, so this one field carries the whole role assignment.
--
--    Nullable and NOT part of the primary key, deliberately:
--      * `burnAndMint` relations are symmetric — nothing is locked, so NULL is
--        the correct terminal value for them.
--      * a `lockAndMint` relation whose evidence never identified a side stays
--        NULL until an observation does identify one; because the column is
--        outside the key, that later observation can simply update it.
--
--    Additive and backwards compatible on its own. Existing rows are normalized
--    by a separate migration that runs AFTER the writer which populates this
--    column is live.
ALTER TABLE "TokenRelation" ADD COLUMN "lockedToken" CHAR(1);
