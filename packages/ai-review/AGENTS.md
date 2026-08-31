# AI Review

AI Review is a repo-owned PR review loop. A GitHub Actions workflow, triggered only by an org member commenting `/ai-review` on a PR, assembles maximal context (repo checkout, linked Linear issue and initiative, PR description and commits, AGENTS.md chain, docs, CI results, lessons), judges the PR's intent before its lines, and posts a short, ranked, evidence-backed review. Everything it learns is distilled into versioned lesson files that live in the reviewed repo and activate only through a human-merged PR.

You can think of AI Review as a replacement for the shallow bot review that maintainers currently skim past: it exists because review capacity is the team's bottleneck, and it carries its own kill criteria so that if it doesn't measurably beat the old bot, we delete it.

## What we can never compromise on

### 1. Intent before lines

Every review opens with a 1–3 sentence restatement of what the PR is supposed to do, per the linked Linear issue and description, and alignment is judged before any line-level analysis. A bug-free PR that does the wrong thing is a finding (`intent-mismatch`). A PR whose purpose cannot be known — no linked issue, no intent in the description — is a finding too (`intent-missing`), and the rest is reviewed against the diff only, saying so.

### 2. Evidence or nothing

At most 5 findings per review, ranked by severity × confidence. Every finding carries evidence — a code reference, a CI result, an execution result, or a Linear issue/initiative reference — and a fix sketch. When nothing clears the bar, the review says explicitly what was consulted and that nothing was found; silence is never ambiguous with failure. Reviewer attention is the resource this project exists to save; an unranked dump spends it.

### 3. Learning gated by merged PRs

Lessons are proposed as a PR to the repo they concern and do nothing until a human merges it (the memory-poisoning gate). No text from a public PR thread can silently steer future reviews. Feedback capture itself is zero-effort for maintainers: reactions, replies, thread resolutions, and follow-up commits are the verdicts.

### 4. The privilege split

Agent stages run with the engine credential and a read-only Linear token, nothing else. A separate deterministic post step holds the GitHub token (`pull-requests: write`) and posts only schema-validated output. A prompt-injected diff therefore cannot post, push, write to Linear, or exfiltrate through the bot identity. Any change that hands the agent a write credential breaks the project's core security property.

### 5. Measured or dead

The eval harness (~50 pinned historical PRs, human review comments as ground truth, existing Codex comments as baseline) was built first and is the regression suite for every prompt and lesson change. Kill criteria are pre-agreed and evaluated after 4 weeks: precision and recall clearly above the Codex baseline, and maintainers still triggering it unprompted. Any miss → delete the workflow, keep the harness and lessons.

### 6. Files in git are the only memory

Lessons and eval history are committed files in the repo they concern. GitHub is the raw event log; Linear is read live, never mirrored; per-review agent sessions are stateless and unpreserved so reviews stay reproducible. This survives ephemeral runners, is auditable via git, and transfers to any future runtime — including a bought tool.

## A note from the maintainers

This project is deliberately small: GitHub Actions only, no orchestrator, no self-hosted service, no daemon. The reviewer consumes CI results instead of re-running the suite. v0's engine is Codex CLI headless behind a thin adapter seam; resist building the multi-engine abstraction before a second engine exists. When you feel the pull to add a stage, a service, or a store, remember the project is designed to be cheap to delete — every piece of machinery you add is a piece someone must weigh at the 4-week decision point. Fight scope creep; the Out of scope list below is load-bearing.

## How it works

One run is a fixed pipeline: **Context pack** (deterministic assembly per the context policy) → **Intent** (restatement + alignment check) → **Find** (candidate findings, schema-forced) → **Rank** (dedupe, severity × confidence, cap at 5) → **Post** (deterministic step; one batched review, intent restatement first, inline comments on diff lines where possible, metadata footer). There is no adversarial refute stage in v0 — precision is carried by the cap, the evidence requirement, and lessons; add a refute stage only if the eval harness shows precision is the weak axis.

The full typecheck/lint/test signal comes from the PR's existing CI checks, fetched via the GitHub API — the reviewer may run cheap targeted probes (one test file, one package's typecheck) when a finding warrants it, but CI owns execution. Affected-package scope comes from the turbo filter against the merge base.

The learning loop closes nightly: the sweep collects verdicts and human review findings from reviewed PRs, the distiller opens a single `status: proposed` lessons PR per repo, and a maintainer's merge activates it. Lesson `origin` records the channel (`bot-verdict`, `human-review`, `seed`) so the eval can report which channel actually improves recall.

### The `ai-review-test` label

`issue_comment` always runs the workflow and package code from the default branch, so a `/ai-review` comment can never exercise unmerged changes. To test a branch end to end, apply the `ai-review-test` label to a PR: the `pull_request: labeled` trigger runs *this branch's* workflow and package against the latest `/ai-review` comment on the PR. It is a maintainer-only debug tool, gated to member/owner-authored PRs because the label path runs unreviewed branch code as the reviewer, next to the engine credential — a policy control, not a security boundary (see the privilege split). Do not rely on it for anything but manual debugging, and never widen its trigger to external PRs.

## Where code lives

- `packages/ai-review` — the pipeline seams, adapter, sweep collector, distiller, and eval harness, as a standard monorepo package.
- `.github/workflows/` — the review workflow (`issue_comment` trigger), the nightly sweep, and the weekly 10-PR eval replay, in each reviewed repo.
- `.ai-review/lessons/` — one markdown file per lesson, in the repo the lessons apply to.
- Eval dataset pins and metrics JSONL are committed alongside the harness; bulky replay outputs go to workflow artifacts, never git.

## Verifying

- Only external behavior is tested, at the smallest number of seams. The primary seam is the pipeline boundary: (checkout, PR ref, CI results, Linear snapshot, lessons) in → findings JSON out — and the eval harness is that seam's test suite.
- The pure seams get conventional unit tests with fixtures: trigger gate, context pack assembler, lessons loader, post-step mapping (including the not-in-diff fallback and top-level intent findings), sweep collector (channel assignment, bot-rooted-thread exclusion, org filter, eval exclusion, outcome classification), distiller output contract.
- Standard monorepo setup: mocha + earl, per-package `pnpm test`. Model-output parsing is pinned by golden fixtures (recorded headless-run transcripts), never live calls.
- The non-deterministic Intent and Find stages are tested only for their contracts — schema validity, cap, ranking order, restatement present — and for aggregate quality via the eval harness. A unit test asserting model output content is wrong by construction.
- Every prompt or lesson change gets judged by the weekly replay trend; a full replay exists only to fix baselines.

## Out of scope

Treat this list as decided, not as a backlog:

- Merge gating or any "merge when no findings" flow — human review remains mandatory.
- External-fork PR review, auto-review on push/lifecycle events, self-hosted runners, multi-engine support beyond keeping the adapter seam clean.
- Full test/typecheck/lint execution inside the review job.
- Any generated or mirrored documentation — no roadmap files synced from Linear, no code-mirror docs, no shared context repo. Linear is read live at review time.
- Linear write access for the bot, and live production access of any kind (DB, Kibana, logs).
- Sweeping human comments on PRs that never had a run (a Future Releases candidate, gated on the distiller's measured rejection rate).

Planned but explicitly not built now: ARCHITECTURE.md enforcement (reviewer checks architectural PRs update it; distiller routes facts there and behaviors to lessons), the adversarial refute stage, and the broader sweep — all contingent on v0 passing its 4-week checkpoint.

## Taste

- Determinism belongs everywhere the model isn't: triggering, context assembly, posting, sweeping, and outcome classification are pure code with fixtures, and the model is confined to Intent/Find/Rank behind a schema.
- Prefer deleting a stage to tuning it. The project's honesty comes from the eval number, not from how sophisticated the pipeline looks.
- Comparable runs beat clever runs: context is priority-ordered and budgeted so eval replays measure the change you made, not context drift.
- When a rule here fights the task in front of you, say so loudly and get a human sign-off before breaking it — especially anything touching the privilege split or the memory-poisoning gate.
