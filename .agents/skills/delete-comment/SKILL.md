---
name: delete-comment
description: Triage the code comments in a package or folder, delete them, and move the decisions into docs/adr.
disable-model-invocation: true
argument-hint: <path, e.g. packages/uif>
---

Triage every code comment in `$ARGUMENTS`. The rule and its reasons are in [ADR 1](../../../docs/adr/0001-decisions-live-in-adrs-not-comments.md); read it first. With no path given, ask for one: a whole package is the usual unit.

## 1. List

```sh
pnpm lint:comments --list $ARGUMENTS
```

Each line is one `//` line or one `/* */` block. Treat a run of adjacent `//` lines as one comment. Comments that tools read (`biome-ignore`, `@ts-expect-error`, …) are not listed and stay.

## 2. Categorise

Read each comment with the code around it, then put it in exactly one category. Check the claim against the code before you decide: grep the names it mentions, read the callers, read `git log -S` when it talks about history.

| Category | Test | Action |
|---|---|---|
| **Tautology** | The code, its names or its types already say it. Test step narration ("first call returns stale data") lands here. | Delete. |
| **Stale** | It names code, behaviour or callers that are gone or have changed. | Delete. When the code it describes has no users left, delete that code too. |
| **Excuse** | It explains away a hack: `TODO`, `HACK`, "for now", "ideally we would", a known gap. | Delete, and add the hack to the PR's excuse list (step 4). Leave the code as it is. |
| **Decision record** | It gives a reason a reader could not get from the code: a constraint, a trade-off, a spec rule, a bug it avoids. | Move it into an ADR (step 3), then delete. |

When a comment mixes categories, split it: a stale warning and a real decision in one header are two entries.

Done when every listed comment has a category and a one-line reason in your triage table.

## 3. Write the ADRs

Follow `docs/adr/README.md`. One ADR per module or concept, holding all of its decisions; when one already covers the file (search `docs/adr` for the path), extend it. When a spec in `docs/` already holds the decision, the ADR points to it and adds only what the spec lacks.

Write the reason, not the code: name functions and files, never line numbers. Keep every fact the comment had: numbers, EIP and spec links, the bug it avoids.

When a better name or a test title can carry a short fact, rename instead of writing an ADR. Behaviour stays the same.

## 4. Check and ship

1. `pnpm lint:comments --list $ARGUMENTS` prints nothing.
2. `pnpm lint:comments --update` lowers the baseline. Then `pnpm lint:comments` passes.
3. `pnpm biome ci`, plus typecheck and tests for every package you touched.
4. In the PR body, put:
   - counts per category;
   - the excuse list: for each hack, the file, what it does wrong, and the fix it needs;
   - the ADRs added or changed.
