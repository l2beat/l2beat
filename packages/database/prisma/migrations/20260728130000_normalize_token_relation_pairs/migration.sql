-- Brings existing `TokenRelation` rows to the invariant the code now writes:
-- the two endpoints are an unordered pair stored in lexicographic order, and
-- `lockedToken` names the slot holding the locked token of a `lockAndMint`
-- pair. See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
--
-- Runs AFTER the writer that maintains this invariant is deployed, so nothing
-- re-pollutes the table behind the cleanup and the constraints at the end
-- cannot reject an insert from still-running old code.
--
-- Steps 1-4 must stay in this order: the backfill reads the evidence JSON
-- under the pre-rename writers' orientation — slot A held the sample
-- transfer's source — which step 4 destroys when it swaps rows into
-- lexicographic order.

-- The file runs as one transaction, and the live writer keeps inserting
-- normalized rows while it does. Without this lock, an insert committing in
-- the gap between step 3's delete and step 4's swap can occupy the exact
-- primary key the swap is about to write, aborting the whole migration.
-- EXCLUSIVE blocks writers while letting reads proceed; it is released on
-- commit (sub-second for this table), after which a blocked ingestion tick
-- simply resumes against the then-constrained table.
LOCK TABLE "TokenRelation" IN EXCLUSIVE MODE;

-- 1. Backfill `lockedToken` from the evidence, mirroring
--    `InteropTransferClassifier.inferLockedTransferSide`. `IS TRUE`/`IS FALSE`
--    keep an unobserved flag from propagating NULL. A pair that both flags
--    claim, or that neither claims, identifies no locked endpoint and stays
--    NULL. `burnAndMint` is symmetric and stays NULL by definition.
--
--    Only rows with no role yet are touched. Reading the flags as slot roles
--    assumes slot A holds the sample transfer's source, which is only known
--    for rows written before the current writer went live: those kept the
--    observed transfer order and never got a `lockedToken`, so they are all
--    still NULL. A role that is already set is authoritative — the writer
--    stored it under normalized orientation (the endpoints may sit swapped
--    relative to the sample), its resolution path derived it from a later
--    transfer than the stored sample, or a human corrected it — and
--    recomputing any of those from the sample under the old orientation
--    assumption would flip or erase a correct value. The guard costs nothing
--    on writer-era rows still at NULL: their flags identify no side, so the
--    recomputation would yield NULL anyway.
--
--    This is the one place a read of the evidence JSON is legitimate: a
--    one-time backfill, not a read path.
UPDATE "TokenRelation"
SET "lockedToken" = CASE
  WHEN (
    ("transfer" ->> 'srcWasBurned')::boolean IS FALSE
    OR ("transfer" ->> 'dstWasMinted')::boolean IS TRUE
  ) AND NOT (
    ("transfer" ->> 'srcWasBurned')::boolean IS TRUE
    OR ("transfer" ->> 'dstWasMinted')::boolean IS FALSE
  ) THEN 'A'
  WHEN (
    ("transfer" ->> 'srcWasBurned')::boolean IS TRUE
    OR ("transfer" ->> 'dstWasMinted')::boolean IS FALSE
  ) AND NOT (
    ("transfer" ->> 'srcWasBurned')::boolean IS FALSE
    OR ("transfer" ->> 'dstWasMinted')::boolean IS TRUE
  ) THEN 'B'
END
WHERE "bridgeType" = 'lockAndMint'
  AND "lockedToken" IS NULL;

-- 2. Drop relations whose two endpoints are the same token. A token is
--    trivially the same asset as itself, so these carry no information — and
--    they have no canonical endpoint order, so the constraint below rejects
--    them.
DELETE FROM "TokenRelation"
WHERE "tokenAChain" = "tokenBChain"
  AND "tokenAAddress" = "tokenBAddress";

-- 3. Merge the mirrored rows. One bridge route observed in both directions
--    produced two rows describing the same pair in opposite orientations.
--    First give a role-less row the role its mirror knows (flipped, since the
--    mirror's endpoints are the other way round), then delete the mirror that
--    is stored in the wrong order. Measured on production data at the time of
--    writing: 1284 of 3607 rows were such mirrors, and zero pairs disagreed
--    about which endpoint is locked, so this merge has no ambiguity to resolve.
UPDATE "TokenRelation" AS target
SET "lockedToken" = CASE mirror."lockedToken"
  WHEN 'A' THEN 'B'
  WHEN 'B' THEN 'A'
END
FROM "TokenRelation" AS mirror
WHERE target."lockedToken" IS NULL
  AND mirror."lockedToken" IS NOT NULL
  AND target."plugin" = mirror."plugin"
  AND target."bridgeType" = mirror."bridgeType"
  AND target."tokenAChain" = mirror."tokenBChain"
  AND target."tokenAAddress" = mirror."tokenBAddress"
  AND target."tokenBChain" = mirror."tokenAChain"
  AND target."tokenBAddress" = mirror."tokenAAddress";

DELETE FROM "TokenRelation" AS reversed
USING "TokenRelation" AS ordered
WHERE (
        reversed."tokenAChain" COLLATE "C",
        reversed."tokenAAddress" COLLATE "C"
      ) > (
        reversed."tokenBChain" COLLATE "C",
        reversed."tokenBAddress" COLLATE "C"
      )
  AND reversed."plugin" = ordered."plugin"
  AND reversed."bridgeType" = ordered."bridgeType"
  AND reversed."tokenAChain" = ordered."tokenBChain"
  AND reversed."tokenAAddress" = ordered."tokenBAddress"
  AND reversed."tokenBChain" = ordered."tokenAChain"
  AND reversed."tokenBAddress" = ordered."tokenAAddress";

-- 4. Put the remaining reversed rows — the ones whose mirror was never
--    observed — into stored order, moving `lockedToken` with them. Postgres
--    evaluates the whole SET list against the old row, so this is a real swap.
UPDATE "TokenRelation"
SET "tokenAChain" = "tokenBChain",
    "tokenAAddress" = "tokenBAddress",
    "tokenBChain" = "tokenAChain",
    "tokenBAddress" = "tokenAAddress",
    "lockedToken" = CASE "lockedToken"
      WHEN 'A' THEN 'B'
      WHEN 'B' THEN 'A'
    END
WHERE ("tokenAChain" COLLATE "C", "tokenAAddress" COLLATE "C")
      > ("tokenBChain" COLLATE "C", "tokenBAddress" COLLATE "C");

-- 5. Lock the invariants in. The ordering constraint is what stops anyone
--    reading the endpoint slots as a direction again: a reversed pair is
--    rejected outright, and the constraint is visible to anyone who opens the
--    schema. `COLLATE "C"` makes the comparison byte order, matching the
--    JavaScript comparison in `normalizeTokenRelation`.
ALTER TABLE "TokenRelation"
  ADD CONSTRAINT "TokenRelation_endpoints_ordered" CHECK (
    ("tokenAChain" COLLATE "C", "tokenAAddress" COLLATE "C")
    < ("tokenBChain" COLLATE "C", "tokenBAddress" COLLATE "C")
  );

ALTER TABLE "TokenRelation"
  ADD CONSTRAINT "TokenRelation_lockedToken_valid" CHECK (
    "lockedToken" IN ('A', 'B')
    OR "lockedToken" IS NULL
  );

-- Only a `lockAndMint` pair has a locked endpoint; a `burnAndMint` pair burns
-- and mints on both sides, so naming one would be false.
ALTER TABLE "TokenRelation"
  ADD CONSTRAINT "TokenRelation_lockedToken_only_for_lock_and_mint" CHECK (
    "bridgeType" = 'lockAndMint' OR "lockedToken" IS NULL
  );
