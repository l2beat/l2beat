# Queryable facts, level by level

L2B-14851, third pass. A Solidity file becomes facts; each level adds a few rules on top of the
previous ones; every level states exactly what it can claim and what it cannot. The levels are the
presentation: switch one on, show the example, show the rules, show the rows, show why a row holds.

The goal is the one from the issue: for a variable like `Playground.score`, narrow the reading to
the functions that can change it, soundly, so that a researcher (or an AI reading the source) has
a short list and a reason to trust it. Permission questions ("who may call it?") are annotations on
that list, not the list itself.

## The ladder

| Level | Question | What it may claim | Status |
| --- | --- | --- | --- |
| 0 facts | What did the compiler see? | Nothing. Rows are what solc returned; everything rests on them. | done |
| 1 vocabulary | What are the contracts, functions, variables, statements? | Readable ids over node ids. Exact. | done |
| 2 direct writes | Which functions contain a write to V? | `writes(F, V)` exact by name; `doesNotWrite(F, V)` exact, only for functions without a blind spot; `blindSpot` lists every place the level cannot see (assembly, delegatecall, storage pointers). | done |
| 3 reach | Which entry points reach a writer through calls, modifiers, libraries, inheritance? | The only entries that can lead to a write. Over-approximation: may list too many, never too few. | next |
| 4 honesty | What can write V without naming it? | Storage pointers, `sstore` with a resolvable slot, delegatecall as an opaque effect that widens the scope. | |
| 5 around the write | What stands between the entry and the write? | Conditions, modifiers, reverting calls, loops, try/catch: the reading list. An empty list means every successful call writes. Recognised patterns (`onlyOwner`) are labelled as patterns. | |
| 6 project | Which deployed contract is behind `gate`? | Code at address, call targets, entries at addresses, from the discovery snapshot. | |
| 7 dependencies | What do the guards read, and who writes that? | Indirect scope, with the snapshot caveat stated. | |
| 8 AI | Answer a question with the enabled levels | Claims labelled fact / structural / reasoning, with file:line; the source must be read. | |

Every result relation carries a strength label in its comment (`// strength: exact | over | pattern`),
shown next to the relation in the web. Helpers (relations without `.output`) are scaffolding and are
hidden by default.

On re-entrancy: for "how can V change" it changes nothing. A callback re-enters through an entry
point that is already on the list, under that entry's conditions. It matters only for ordering and
state claims ("the check happens before the write"), which these levels do not make.

## Layout

```
rules/<n>-<name>.dl     one level per file; the banner at the top is the level's text in the web
examples/<id>.sol       synthetic examples; the comment block at the top is the description
expected/<id>/<rel>.tsv reviewed rows; `pnpm test` compares them with a fresh run at the top level
src/                    compile (solc, cached by pragma), emit (AST → facts), levels, run, test, cli
web/                    Vite + React; the API runs inside the dev server
out/<id>/               facts/ once per source hash, L<n>/ per level run (program.dl, derived/, run.json)
```

Prerequisites: node 24 (fnm), pnpm, Soufflé 2.5 on the PATH (`souffle`). solc binaries are fetched
from binaries.soliditylang.org on first use and sha256-checked; `.cache` is a symlink to the
sibling spike's cache so nothing needs downloading for the examples.

## Running

```
pnpm qf levels                       the ladder
pnpm qf examples                     the examples
pnpm qf run playground 2             run one example at one level; prints row counts
pnpm qf rows playground 2 writes     rows of one relation
pnpm qf explain playground 2 writes 'Playground.setScore(uint256)' Playground.score
pnpm test                            every expected/<id>/<rel>.tsv against a fresh run
pnpm qf expect playground writes     record the current rows as the expectation (review them first)
pnpm dev                             the web on http://localhost:5180
```

## Presenting

Open the web, pick `playground`, start at level 0 and move right.

- **Level 0.** Open `node` and `attr`: this is all there is. Point at the row
  `attr(<id>, "name", "setScore")`. Nothing knows it is a function.
- **Level 1.** Open `function`, `stateVariable`, `storageSlot`. Click an id to see it in the source.
  The rule file is on the same page: show `functionName`, one rule.
- **Level 2.** Open `writes`: one row for `score`, and it is `setScore`. Open `doesNotWrite` and
  filter on `score`: the decoys, stated one by one. Press "why?" on the `writes` row: Soufflé's proof
  down to the facts. Then switch to the `writes` example and open `blindSpot`: four hidden writes,
  none dropped, and those functions have no `doesNotWrite` rows.

Do not code live. Toggle pre-built levels.

## Working mode

One level per round: rule file with banner, example additions, reviewed expectations, this README's
row, the web picks it up by itself. Nothing is claimed that the tests do not check.
