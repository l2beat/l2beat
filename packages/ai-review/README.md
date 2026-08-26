# @l2beat/ai-review

Eval harness for the AI PR review loop. Data lives in `.ai-review/eval/` at the
repo root: `dataset.json` (pinned historical PRs) and `metrics.jsonl` (one row
per scoring run). Bulky per-run outputs go to `packages/ai-review/out/`
(gitignored; upload as workflow artifacts in CI).

```sh
pnpm eval select                       # scan Codex-reviewed merged PRs, print a stratified pick
pnpm eval build --prs 1,2,3            # pin PRs (SHAs, comments, Linear snapshot) into dataset.json
pnpm eval baseline                     # judge Codex findings vs human comments, append metrics row
```

`build` resolves the linked Linear issue via `LINEAR_API_KEY`, or from a
pre-resolved `--linear-snapshots file.json` (`{ "L2B-123": LinearSnapshot }`).
`baseline` never reads Linear or GitHub; it only reads `dataset.json`. Judge
verdicts are cached under `out/judge-cache/` keyed by prompt, so re-runs
replay identical verdicts; delete the cache to re-judge.

Ground truth per PR = thread-root inline comments and substantive review
bodies from human non-author reviewers. Baseline findings = thread-root
comments by `chatgpt-codex-connector[bot]`. The judge (`codex exec`, schema
forced) emits a match/no-match verdict per (finding, human comment) pair,
matching by issue identity rather than wording. Metrics: recall = human
comments matched by any finding; precision = findings matched to any human
comment; noise = findings per PR; judge token usage and latency; median Codex
review latency from reviewed commit to review.
