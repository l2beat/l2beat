# Handoff: migrate nonTemplateDaTracking projects into daTracking.json

## Where you are

Repo worktree: `/Users/tomasz/.t3/worktrees/l2beat/t3code-d114f910` (L2BEAT monorepo), branch `t3code/preserve-da-tracking-configs`.

The previous session implemented the daTracking era-store mechanism. **The work is complete, verified (full config suite green, 23,442 tests) but NOT yet committed** — `git status` shows ~10 modified files, the new module/script/tests, and 48 generated `daTracking.json` files. Read these instead of re-deriving context:

- Design/context: `/Users/tomasz/.claude/plans/we-have-a-problem-compressed-moore.md`
- Mechanism core: `packages/config/src/templates/daTrackingHistory.ts` (schema, parser rules, `resolveDaTracking`, resolution registry)
- Generator: `packages/config/scripts/daHistory/update.ts` (`pnpm da:history`), pure logic in `packages/config/src/templates/daTrackingHistoryUpdate.ts`
- Guard: `packages/config/src/snapshots/daTracking/history.test.ts` (staleness, file-required, orphan checks)
- Workflow docs: `docs/da-tracking.md` ("Where the config comes from" + rotation sections)

Mechanism in one line: stack templates (opStack/orbitStack/zkStack) resolve daTracking as `nonTemplateDaTracking` override → committed `src/projects/<name>/daTracking.json` → single era derived from discovery; the JSON files hold the full era history so on-chain rotations can't silently wipe backend data.

## Your task: the migration

Move the **template-based** projects that were pushed out of templates into `nonTemplateDaTracking` (because of past rotations) onto the new `daTracking.json` mechanism, so they get template derivation + guard coverage back.

Candidates (the set restored by commit `f85e8592a0` plus zksync2 — all in `packages/config/src/projects/<name>/<name>.ts`):

| project | notes |
|---|---|
| mint | opStack, 2 chained eras (batcher rotation) |
| morph | multi-era, check stack |
| thebinaryholdings | opStack |
| treasure | 2 eras (zkStack?) |
| zksync2 | 4 chained eras; old eras use `eth:`-prefixed inbox strings — keep them VERBATIM, they are part of the production hash (see pinned tests in `packages/shared/src/tools/createDaTrackingId.test.ts`) |
| arenaz | **likely must STAY on nonTemplateDaTracking** — archived, all eras closed; see pitfall #2 |
| taiko | **stays** — hand-rolled config with `topics`, not template-derivable |

There are ~22 `nonTemplateDaTracking` users total; anything genuinely custom (base, optimism, celo, mantle, …) stays as-is. Grep `nonTemplateDaTracking` to enumerate.

### Per-project procedure

1. Serialize the project's `nonTemplateDaTracking` array into `src/projects/<name>/daTracking.json` (`{ "eras": [...] }`). This is the one legitimate hand-authoring exception (or write a small one-off script). Constraints enforced by `parseDaTrackingHistory`:
   - every closed era (has `untilBlock`) MUST carry `closed` metadata — use `{ "reason": "<what rotated, from git history/comments>", "precision": "manual" }`
   - open era (no `untilBlock`) must be last in its (type, daLayer) group and must NOT have `closed`
   - `daLayer` is a plain string in JSON; addresses/inbox strings verbatim from the .ts
   - drop TS-only sugar (`EthereumAddress(...)` wrappers become plain strings; comments are lost — fold important ones into `closed.reason`)
2. Delete the `nonTemplateDaTracking` block from the `.ts` (both changes must land together — the orphan guard fails if the file coexists with the override).
3. Verify, per project:
   - `pnpm test` in `packages/config` — the history staleness guard requires the open era's identity to equal the current template derivation; if it fails, the project's last entry doesn't match discovery (investigate before forcing anything)
   - **`git diff packages/config/src/snapshots/daTracking/snapshot.json` must be EMPTY** — since/until/discriminator-free migrations change zero ids. Any snapshot diff means you altered an identity: stop and compare field by field.
   - `pnpm da:history <name>` should then report "already up to date"
4. One project per commit, so a bad migration is trivially revertible.

### Pitfalls

1. **Do not run `pnpm da:history` to create these files** — for a project still on `nonTemplateDaTracking` it skips; after you delete the override but before the file exists, it would init a file with only the current era, silently dropping the history. Author the JSON first, delete the override second, in the same change.
2. **Archived / fully-closed projects (arenaz)**: the staleness guard requires open-era identities == derived identities. An archived project has zero open eras but the template still derives one → guard fails. Either leave such projects on `nonTemplateDaTracking` (fine, escape hatch is permanent), or extend the mechanism with an explicit "archived/derivation-suppressed" affordance if there are several of them — discuss with the user before changing guard semantics.
3. Chained eras share boundary blocks (`untilBlock` of era N == `sinceBlock` of era N+1). That's valid for *different* identities; identical identities must be strictly disjoint (parser enforces).
4. `sinceBlock`/`untilBlock` are not hashed — copying ranges exactly is still important for data correctness, but only identity fields (inbox/sequencers/topics/namespace/appIds) affect ids.
5. Build deps first if typecheck complains: `pnpm build:dependencies:config` from repo root.

### Definition of done

- Migrated projects have `daTracking.json`, no `nonTemplateDaTracking`, guard green, snapshot.json byte-identical.
- Full `pnpm test` in packages/config green.
- Optionally sanity-check one migrated project with `pnpm da:preview <name>` (packages/backend, needs env — see `docs/da-tracking.md`).

## Suggested skills

- `l2beat-config-project` — invoke before editing anything in packages/config (project/template/config conventions, since-until era rules).
- `simplify` — after the migration commits, on the changed code.
- `mattpocock-skills:code-review` — review the branch against this handoff + the plan file before handing to the user.

## Open questions for the user (ask only if hit)

- Whether the previous session's uncommitted implementation should be committed first (likely yes — migration builds on it; branch from the current state).
- Whether arenaz-style archived projects justify an "archived" affordance in the guard or just stay on the escape hatch.
