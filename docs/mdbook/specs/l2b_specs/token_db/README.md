<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [TokenDB](#tokendb)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# TokenDB

TokenDB is the system that holds L2BEAT's canonical token catalogue —
**Abstract Tokens** (the asset, e.g. "USDC") and **Deployed Tokens**
(individual `(chain, address)` instances of an asset), plus the
relations between deployed tokens. It is served by the `token-backend` package and
edited through the `token-ui` package.

The docs in this folder describe how TokenDB is kept correct:

- [Automatic token ingestion](./automatic_token_ingestion.md) — the
  background loop that discovers new deployed tokens from interop
  transfers, links them to abstract tokens (via transfer evidence and
  CoinGecko), materializes token relations from non-swapping interop
  transfer evidence, and surfaces conflicts/errors to humans.
- [Intent / Plan / Execute](./intent_plan_execute.md) — the
  intent → plan → commands pipeline behind every human-driven write
  from token-UI, and why it exists (visible blast radius + concurrency
  safety).

## Two "planning" subsystems — what they share, what they don't

TokenDB has *two* pipelines with `plan`-like steps in their names, and it
is worth being explicit about why they exist and how they relate, because
the distinction is load-bearing for any future work in this area.

- **`intent → plan → execute`** ([intent_plan_execute.md](./intent_plan_execute.md))
  is a **UX construct**. The plan exists so the user can see the full
  blast radius of their edit before clicking Confirm; the re-plan-and-
  compare inside the SERIALIZABLE transaction exists so what they
  confirmed is exactly what gets written. It is not really about
  "planning writes" — it is about *showing* writes and guaranteeing they
  don't drift between dialog and click.
- **`plan → fetch → apply`** ([automatic_token_ingestion.md](./automatic_token_ingestion.md))
  in the ingestion processor is a **cost / separation construct**.
  `plan` is RPC-free so the queue page can predict every row's outcome
  cheaply; `fetch` is the only place external calls happen; `apply`
  writes. The reasons are different, and the deep-equality check from
  the other pipeline would actively hurt this one — CoinGecko coin map
  updates would invalidate plans constantly.

So merging the two into a single "plan-and-execute" pipeline would be the
wrong target. Forcing ingestion through the intent pipeline would mean
rebuilding a user-confirmation construct around something that has no
user; conversely, dropping the intent pipeline would not actually
simplify ingestion.

What the two pipelines *do* share — and what should remain shared — is
the **write boundary** below them: the `Command` primitives and a single
`commitTokenChanges` helper in
[`packages/token-backend/src/commitTokenChanges.ts`](../../../../../packages/token-backend/src/commitTokenChanges.ts).
Both pipelines translate their work into `Command[]` and funnel it
through this helper. That means:

- There is exactly one place that writes to TokenDB's three core tables
  (`AbstractToken`, `DeployedToken`, `TokenRelation`).
- Future cross-cutting concerns (history, audit log, write proofs) plug
  in here once and cover both pipelines automatically.
- Each pipeline still owns its own concurrency story (the intent
  pipeline re-plans inside the SERIALIZABLE transaction; ingestion just
  wraps the writes in SERIALIZABLE), because they have different
  guarantees to provide.

Each pipeline attaches an `AbstractTokenAssignmentProof` to deployed-token
commands at *plan time*, so the proof is visible in the diff the user
sees before clicking Confirm (and in the ingestion preview dialog):
`{ kind: 'manual'; user }` (with the logged-in user's email) for user
plans, and `{ kind: 'coingecko' }` or
`{ kind: 'non-swapping-transfer'; transfer }` for ingestion plans. The
proof lands on the `DeployedToken.abstractTokenAssignmentProof` JSON
column; `commitTokenChanges` does not modify commands, it just routes
them. The non-swapping-transfer proof carries the *full* transfer
because the interop transfer table is a sliding 7-day window; BigInt raw
amounts are stored in JSON as decimal strings. A persistent history
table will land in a follow-up change.
