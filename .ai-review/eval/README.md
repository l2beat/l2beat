# AI review eval data

- `dataset.json` — pinned historical PRs (head/base/merge SHAs, human review
  comments as ground truth, Codex findings as baseline, Linear snapshot of the
  linked issue/project/initiative as resolved at build time). Replays read only
  this file; nothing is fetched live.
- `metrics.jsonl` — one row per scoring run, appended by
  `pnpm -C packages/ai-review eval baseline`. Bulky per-run outputs live in
  `packages/ai-review/out/` (gitignored, upload as workflow artifacts).

Stratification: 22 backend / 22 frontend / 5 config. Config is short because
only 5 Codex-reviewed config PRs carried human inline review at build time.
Rebuild with `pnpm -C packages/ai-review eval select` and `eval build`.
