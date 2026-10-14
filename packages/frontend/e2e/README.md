# Frontend e2e tests

How the suites here are split across CI runners, and how to keep the split
even when you add tests.

## Why the tests are split

A GitHub runner has four CPUs, and the tests share them with the frontend
server they test. Running more workers on one runner makes each test slower
and the timing-sensitive ones flaky, so CI adds runners instead. Each runner
spends about 35 s on setup (install, Playwright, frontend build) before the
first test, so a job is only worth it if it holds about 30 s of tests or more.

The aim is for every job to finish at about the same time, as CI waits for the
slowest one. That is about 1.5 min now.

## Where the split is set

- `../playwright.config.ts` sorts the tests into projects:
  - `chromium`: the functional tests, everything outside a `*-perf` folder.
  - `perf`: the ratchets in `resize-perf`, which count how much work a page
    does, and in `blobs-webkit-perf`, which runs in WebKit to catch what only
    Safari slows down on. Tests running beside them push those counts up, so
    they run one at a time (`workers: 1`) after the rest. Its runner installs
    WebKit (`webkit: true` in its matrix entry); locally, run
    `pnpm exec playwright install webkit` once.
  - `blobs perf`: the ratchets in `blobs-perf`. Each one watches the chain for
    a few 12 s slots, so each takes about 50 s however fast the machine is.
- The `test-e2e-shard` job in `/.github/workflows/ci.yml` has one matrix entry
  per runner, each with the Playwright arguments that runner gets.
- The `test-e2e` job, named "E2E tests", is the check branch protection
  requires. It passes once every matrix entry has, so you can add or remove
  entries without touching the repository's settings. Do not rename it.

The current runners:

| Runner             | Arguments                                         |
| ------------------ | ------------------------------------------------- |
| Chromium 1/2, 2/2  | `--project chromium --shard N/2`                  |
| perf               | `--project perf --no-deps`                        |
| blobs perf 1/3–3/3 | `--project "blobs perf" --no-deps --shard N/3`    |

The perf runners pass `--no-deps` because locally the perf projects wait for
`chromium` to finish, and on CI those tests already run on other runners.

## How `--shard` splits

Playwright splits by **test count**, not by time. It cuts the list of tests,
in file order, into runs of about equal length. Tests that must stay together
are never cut apart:

- In a file with `test.describe.configure({ mode: 'parallel' })`, or in a
  project with `fullyParallel: true`, each test is its own unit.
- Otherwise the whole file is one unit, and lands on one shard.

So shards balance only when the tests are about as long as each other. A file
of slow serial tests can tip one shard over.

## What a ratchet measures

A count of the work a page does (layouts, restyled elements, chart rerenders,
boxes, layers) is the same on every run, so its ceiling can sit at the count
itself and a regression of one fails. Gate on counts.

A time is not the same on every run. GitHub's runners come with different
CPUs, and the same commit measures up to 2.5× apart: the WebKit table layout
took 3.4 ms a change on an AMD EPYC 9V45 and 8.1 ms on an EPYC 7763, and
`scriptMs` on `/scaling/projects/arbitrum` ranges 56–131 ms over 22 runs.
Neither escape works on these runners:

- **CPU time** splits the same way. The WebKit main thread's CPU time matched
  its wall time within 5%, with no time stolen by the host: the runner is
  slow, not interrupted.
- **Instruction counts** need the CPU's hardware counters, which the VMs do
  not expose. `perf_event_open` fails with `ENOENT` even with
  `kernel.perf_event_paranoid` lowered.

So a time ceiling is only a backstop for regressions several times over: set
it from the slowest CI run with at least 2× headroom. One set from a local run
lands inside the CI spread and fails at random; the WebKit ceiling did, set at
4× a Mac's time. Printing a time without a ceiling is fine.

To catch a new kind of slowness, find it by time where time is steady: a
profile on a device or the iOS Simulator. Fix it, then ratchet what caused it
as a count, and check once that the count moves with the time (the `h-full`
bars: 31 ms a change, 3 ms fixed; boxes under a percent height, 68 and 0).

## Adding tests

- **A functional test**: put it anywhere outside a `*-perf` folder and it
  joins `chromium`. Then check the split (below). If one Chromium job is now
  the slowest in the workflow by a lot, add a third shard: add a
  `Chromium 3/3` entry and change the others to `--shard N/3`.
- **A long test of its own**: give its file `mode: 'parallel'` if its tests
  do not depend on each other, so the shards can spread them.
- **A resize ceiling**: it joins `perf`. That job has room for a few more.
- **A blobs ceiling** (a key in `blobs-perf/ceilings.json` or
  `swipeCeilings.json`): it adds a test to `blobs perf`, which runs one test
  per runner. Add a `blobs perf N/M` entry and raise every `--shard N/M` to
  the new test count, or two tests will share a runner and take twice as long.
- **A new perf folder** (`*-perf`): it is picked up by `perf`. If it runs as
  long as the blobs ratchets, give it a project and runners of its own, as
  `blobs perf` has.

## Checking the split

List what each shard would run, without running anything:

```sh
pnpm exec playwright test --list --project chromium --shard 1/2
pnpm exec playwright test --list --project chromium --shard 2/2
```

Then compare the jobs' times on a CI run of your branch:

```sh
gh run view <run-id> --json jobs \
  -q '.jobs[] | select(.name | test("E2E")) | "\(.name) \(.startedAt) \(.completedAt)"'
```

The log of each job ends with the tests' own time, e.g. `16 passed (38.4s)`.

## DiscoUI

`packages/protocolbeat` works the same way in the `test-e2e-discoui` job: its
page suite runs as `--shard N/2`, and the second runner also runs the `l2b`
backend suite, which takes about 20 s.
