<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Intent / Plan / Execute](#intent--plan--execute)
  - [TL;DR](#tldr)
  - [Why this shape?](#why-this-shape)
    - [1. Show the user the full blast radius of their edit](#1-show-the-user-the-full-blast-radius-of-their-edit)
    - [2. Make concurrent edits safe without manual locking](#2-make-concurrent-edits-safe-without-manual-locking)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Intent / Plan / Execute

This document describes how user-driven edits to TokenDB flow through the
`token-backend` package. It is the model that sits behind every "Add
token", "Update token", and "Delete token" action coming from the token-UI.

If you're looking for how tokens are added *automatically* from interop
transfers, that's a different subsystem — see
[Automatic Token Ingestion](./automatic_token_ingestion.md).

## TL;DR

Every write to TokenDB goes through three artefacts:

```
Intent   ─►   Plan   ─►   Commands  ─►  TokenDB
       plan         execute
```

- **Intent** ([intents.ts](../../../../../packages/token-backend/src/intents.ts)) —
  *what the user wants*. A small, validated union: add/update/delete an
  abstract or deployed token.
- **Plan** ([planning.ts](../../../../../packages/token-backend/src/planning.ts)) —
  *what will happen* if the intent is carried out: the original intent
  plus the ordered list of low-level **Commands** the backend will run.
  Generating a plan is **read-only** — it never mutates the DB.
- **Commands** ([commands.ts](../../../../../packages/token-backend/src/commands.ts)) —
  the primitive write operations TokenDB knows how to execute (insert,
  update, delete on the two tables).
- **Execute** ([execution.ts](../../../../../packages/token-backend/src/execution.ts)) —
  takes a `Plan` and applies its commands in a single `SERIALIZABLE`
  transaction. Before applying anything, it **regenerates the plan from
  the same intent and refuses to proceed unless the new plan is byte-for-
  byte identical** to the one the user confirmed.

The two tRPC procedures that expose this are `plan.generate` (intent → plan)
and `plan.execute` (plan → success/error), wired up in
[trpc/routers/plan/index.ts](../../../../../packages/token-backend/src/trpc/routers/plan/index.ts).
On the frontend, [PlanConfirmationDialog.tsx](../../../../../packages/token-ui/src/components/PlanConfirmationDialog.tsx)
shows the plan to the user, and only on **Confirm** does it call
`plan.execute`.

## Why this shape?

Two reasons, both load-bearing.

### 1. Show the user the full blast radius of their edit

A single user intent can — in principle — touch more than one record.
Imagine a researcher reassigns a deployed token to a different abstract
token. Depending on what's connected to that deployed token (interop
transfers, sibling deployments, etc.), the backend may want to propagate
that change to keep the graph consistent. The user typed one edit; the
system might need to write five.

The plan/confirm pattern means **the user always sees the full set of
writes before approving**. The confirmation dialog literally enumerates
each `Command` ("Deployed token X will be updated", "Abstract token Y
will be added") with diffs. There are no surprise mutations executed
after a click.

Most planners today are 1:1 — one intent produces one command. That is
fine: the abstraction is set up so that when propagation rules grow more
complex, the UX does not need to change. The dialog already knows how
to render a list of commands.

### 2. Make concurrent edits safe without manual locking

Multiple researchers can be editing tokens in token-UI at the same time.
Without protection, the classic race is:

1. Alice opens token X, makes a change, gets a plan, takes a coffee.
2. Bob edits token X meanwhile and saves.
3. Alice clicks Confirm. Her plan was computed against state that no
   longer exists.

`executePlan` defends against this with two layers:

- **`SERIALIZABLE` transaction.** Postgres treats the whole execute step
  as if no other transaction were running. No interleaving with concurrent
  writers from other sessions.
- **Plan re-generation and deep-equality check.** Inside the transaction
  it calls `generatePlan(intent)` again and compares the result to the
  plan the user is confirming using `isDeepStrictEqual`. If anything has
  changed — a referenced row no longer exists, a uniqueness check now
  fails, or a propagation rule would now produce different commands — the
  execute fails with *"Plan is no longer valid due to recent changes to
  the database"* and the user is asked to re-plan.

The combination guarantees: **what the user confirmed is exactly what
gets written, or nothing gets written**. There is no "we executed half
the plan and then a conflict appeared".
