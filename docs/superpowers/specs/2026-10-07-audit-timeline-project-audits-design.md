# Audit timeline: which audits count as the project's

Date: 2026-10-07. Status: decided. Extends section 7.5 of
`2026-09-14-audit-data-flow-design.md`.

## 1. Question

The audits timeline (project page section and dashboard sparkline) places audit reports next
to the critical changes tracked by ossification, and derives "latest audit", "average audit
interval" and "upgrades since the latest audit" from the audits it counts. Which of the reports
the coverage store associates with a project should count as the project's audits, and which
should stay behind the "shared" toggle?

## 2. Evidence

Checked on the 13 projects of the store at dataset revision `546e6ed7` against the ossification
histories of the 9 projects that have one (October 2026).

- Critical **code** upgrades are almost always preceded by a dedicated report, one to two months
  earlier. OP Mainnet: 12 of 14 code-change clusters have a named Upgrade N review; Scroll: every
  release upgrade (gas optimizations, EIP-4844, Euclid, Feynman, Galileo) has one two to four
  weeks before. Critical **state** changes (ownership and threshold changes, respected game
  type, verifier key rotations) mostly have no audit counterpart.
- On OP Stack chains the project's own collection explains none of the critical changes: Unichain's
  own reports (fee splitter, Flashtestations) match nothing in the critical perimeter, Ronin's own
  reports predate its OP Stack chain. Every critical upgrade of Unichain maps to a report of the
  `optimism` collection (U16, U16a, U17, U18, U20 and the interop re-review), executed on the
  chain the same day as on OP Mainnet or days later.
- Of the 192 shared matches across all projects, 113 come from library collections (OpenZeppelin,
  Safe, Solady, Solmate, SP1) and 37 from project collections outside the project's ranked
  context (origin `other`). None of these 150 corresponds to a critical change of the project.
  They match vendored units: `SafeERC20` from a zkSync contest, `IERC20` from an Arbitrum
  report, the whole OP monorepo vendored in the Kailua repository (83 to 152 units on each OP
  Stack chain). On non-stack projects every shared match is of this kind.
- Of the 29 `optimism` reports matched on the four stack chains and dated within their life,
  about 20 correspond to an observed upgrade, 6 are library-only matches of the same release
  line, 3 are releases the chain did not adopt (Upgrade 20 on Ronin and BOB).
- A report's date relative to the chain's launch does not separate the cases: Ronin launched on
  U18-era code, so the U17 and U18 reports predate its launch and are the audits of its initial
  perimeter.

## 3. Decision

A **project audit** is a dated report that is either

1. in one of the project's own collections (origin `own`), matched to deployed code or not, or
2. in an upstream or stack collection of kind `project` (context rank at most 2, the collections
   of a repository the project forked or of its discovery template vendor) **and** matched to at
   least one deployed unit.

Everything else that matched deployed code is an **other matched audit**: reports of library
collections and of project collections outside the ranked context. They stay available behind
the timeline toggle and in the report list, because they are real coverage evidence, but they do
not count as the project's audits.

Consequences:

- Project audits drive the timeline markers, the sparkline ticks, "latest audit", "average audit
  interval" and "upgrades since the latest audit", on the project page and on the dashboard.
- Own and stack reports keep distinct markers and legend entries, so a reader can see that
  Unichain's audits are OP Labs' audits.
- Non-stack projects are unchanged: rule 2 selects nothing for them.
- Stack reports need a unit match. Taking every dated report of the stack collection would put
  all 54 `optimism` reports, governor and fee-splitter audits included, on every OP Stack chain.
  The known cost is that a release audit whose scope matched no perimeter unit stays off the
  timeline, as Upgrade 19 does today.
- Library collections ranked `stack` through a template hint (OpenZeppelin via `ProxyAdmin`,
  Safe via `GnosisSafe`) are excluded by the kind check, not by the rank.

## 4. Not done

Counting only critical code changes, and not state changes, on the timeline was considered and
dropped for now: ossification records new dispute-game and verifier registrations as state
changes, so a plain type filter would hide the upgrades that Scroll's and Celo's audits cover.
A cleaner rule is to be designed separately.

## 5. Implementation

- `getAuditsOwnReports` becomes `getAuditsProjectReports`, returning `AuditsProjectReport`
  with `origin: 'own' | 'upstream' | 'stack'` and `collectionName`. It needs the collection
  kind from `AuditCoverageSource.getCollection`.
- `AuditsProjectTimeline.sharedAudits` becomes `otherAudits`: the dated matched reports that are
  not project audits.
- `getAuditsSummaryEntries` and `getAuditsProjectDetails` feed both through
  `getAuditsProjectTimeline`. "Latest audit" and "upgrades since the latest audit" take the
  stack audits into account. The audit interval starts at the launch or the first own audit,
  whichever came first, and counts the audits since then: the stack's audits before the project
  existed describe the stack's history, not the project's cadence. The MAX range of the chart
  still reaches back to the first audit of any kind, since those reports did audit code the
  project runs.
- The chart marks own, stack and other audits; the toggle and its legend entry are renamed to
  "other matched audits". Section, sparkline and dashboard texts say "project and stack audits".
