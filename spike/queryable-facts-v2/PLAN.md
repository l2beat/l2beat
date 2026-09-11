# Second prototype: facts → rules → questions with evidence

Working notes for resuming after an interruption. Tick items as they land; the last section says
where work stopped.

## Shape

1. **Inputs → facts.** A project (discovered.json + .flat/) or one .sol file. Each file: pragma → exact
   solc → AST + storage layout → `.facts` files (Soufflé's native tab-separated input), shown as Datalog
   atoms. discovered.json → d* facts. Nothing else.
2. **Rules → derived.** One library, one list of layers (the old concepts/lib/project split is gone from the
   presentation). Evaluated per unit, then once over the union of exported unit relations + discovery.
   Every tuple explains down to base facts (proofs stitched across the two stages).
3. **Ask.** The agent gets the catalogue (relation, signature, one line) and one way to make a claim: write
   Datalog rules, run them (`./q run`), cite the tuples. Each ask is recorded (queries, results, proofs,
   answer); cited atoms are checked against the derived tuples; rules are classified composition /
   interpretation; a rule can be promoted into the library.

## Phases

- [x] P1 core: package, copies of compile/emit/discovery, rules library (merged, exports), souffle runner,
      project pipeline (project or single file), run.json, CLI `run`. Verified on fixtures + Zora
      (same derived rows as v1 for exported relations).
- [x] P2 query + proof + agent tool: query program over available relations, unit-level fallback,
      classification, stitched explain, `./q` shim + CLI commands (catalog, show, rows, run, why, source),
      codex briefing, citation check, ask recording. Verified: pause question on Zora.
- [x] P3 web: server API (inputs, run stream, reopen runs, facts pages, rules+counts, rows, explain, ask
      stream, asks list, promote) and the three screens.
- [x] P4 promotion to library (+ expected tuples), README, typecheck/lint clean, semantic oracle.

## Where work stopped

(previous note) P3 web: server done (web/server/{api,runs}.ts), client written (App, screens Inputs/Rules/Ask, components); next: typecheck web, `pnpm dev` on 5179, smoke-test API and screens, then P4 (README, lint/format, semantic). Agent test on Zora (asks/01 of out/runs/zora-20260909-121136): 9/9 cited atoms verified, but 822 s and many `rows` calls before the query — tighten the briefing.


Update: P3 done (dev server on 5179 answers every endpoint; client bundle builds). README written. Second agent test (upgrade question, through the web API) running → out/ask-test2.ndjson. Left: lint/format, read the second agent run, final recap to the user.

Final: lint, format, typecheck clean; semantic ok (3 fixtures, 78 rows); differential vs v1 ok (5,927 relations, 0 diffs). Dev server: `pnpm dev` → http://localhost:5179.
