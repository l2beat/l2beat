# Audits frontend on `project.auditCoverage` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the audits dashboard from the `audit-coverage.json` files that `l2b audit-coverage` writes (loaded by config as `project.auditCoverage`), and retire the `@l2beat/audit-diff` engine and its committed content store.

**Architecture:** Pure functions in `packages/frontend/src/server/features/audits/coverage/` turn one `ProjectAuditCoverage` (type from `@l2beat/config`) into the existing view models; the page features compose them with `ps.getProjects`. Source text is not in the output, so the unit-details tRPC call reads the deployed flat from the `FlatSources` table (hash lookup after stripping discovery's header) and the audited file from GitHub's blob API, then renders the diff from the output's `added` / `removed` spans. Stack audits are identified without repository lineage: a matched report whose collections include the collection mapped from `scalingInfo.stacks` counts as a stack audit.

**Tech Stack:** TypeScript, React (SSR pages), tRPC, Kysely (`@l2beat/database`), mocha + earl for tests, `@l2beat/config` `ProjectService`.

## Global Constraints

- No additions to the `l2b audit-coverage` output. Everything derives from `ProjectAuditCoverage`, `scalingInfo.stacks`, `ossificationHistory`, `chainConfig`, the `FlatSources` table and GitHub.
- Repository mocks in tests are typed as `Database['flatSources']` (AGENTS.md).
- Statuses shown stay `identical | library | differs | unaudited`. Unit kinds become `contract | abstract | library | interface | function`.
- Report document URL: `https://github.com/<dataset.repository>/blob/<dataset.commit>/<document>` with every path segment percent-encoded. Audited file URL: `https://github.com/<repository>/blob/<commit>/<path>` for `owner/repo` ids, `https://gist.github.com/<owner>/<id>` for `gist/<owner>/<id>`, `https://<host>/<path>` otherwise.
- Discovery flat header to strip before hashing: `// SPDX-License-Identifier: Unknown\npragma solidity <v>;\n\n`.
- Stack to collection: `OP Stack → optimism`, `Arbitrum → arbitrum`, `ZK Stack → zksync2`, `Agglayer CDK → agglayer`, `SN Stack → starknet`, `Taiko → taiko`; other stacks map to nothing.

---

### Task 1: Coverage model (contracts, units, statuses, numbers)

**Files:**
- Create: `packages/frontend/src/server/features/audits/coverage/coverageModel.ts`
- Test: `packages/frontend/src/server/features/audits/coverage/coverageModel.test.ts`
- Modify: `packages/frontend/src/server/features/audits/types.ts`

**Produces:**
```ts
export function selectContracts(c: ProjectAuditCoverage): { selection: 'critical' | 'all'; addresses: string[] }
export function unitStatus(unit: Unit, c: ProjectAuditCoverage, projectId: string): AuditUnitStatus
export function unitCoveredLines(unit: Unit, status: AuditUnitStatus): number
export function contractSources(address: string, contract: Contract): { address: string; role: 'proxy' | 'implementation'; flat: string | undefined }[]
export function summarizeUnits(units: { unitId: string; status: AuditUnitStatus; lines: number; coveredLines: number }[]): { units: AuditStatusCounts; uniqueUnits: AuditStatusCounts; lines: { total; covered; uncovered } }
```

Rules: a contract is shown when `critical === true` or `critical` is an object without `untilTimestamp`; when none is critical all are shown. `none → unaudited`, `differs → differs`, `identical → library` when every report of the unit belongs only to collections of kind `library` (and none to the project's own collection), else `identical`. A `source` that is not 64 hex characters is "no source".

- [ ] Write tests for selection (critical present / absent / expired window), status mapping (library-only reports, mixed reports, own report), covered lines, summary and unique counting.
- [ ] Implement; run `pnpm --filter @l2beat/frontend test -- --grep coverageModel`; commit.

### Task 2: Reports, origins and links

**Files:**
- Create: `packages/frontend/src/server/features/audits/coverage/coverageReports.ts`
- Test: `packages/frontend/src/server/features/audits/coverage/coverageReports.test.ts`

**Produces:**
```ts
export type AuditReportOrigin = 'own' | 'stack' | 'library' | 'other'
export function stackCollectionOf(stacks: ProjectScalingStack[] | undefined, c: ProjectAuditCoverage): string | undefined
export function reportOrigin(reportId: string, c: ProjectAuditCoverage, projectId: string, stackCollection: string | undefined): AuditReportOrigin
export function reportUrl(c: ProjectAuditCoverage, reportId: string): string
export function auditedFileUrl(file: ProjectAuditCoverage['auditedFiles'][string]): string
export function matchedReportIds(c: ProjectAuditCoverage, addresses: string[]): Set<string>
export function unitOrigin(unit: Unit, c, projectId, stackCollection): AuditReportOrigin  // own > stack > library > other over unit.reports
export function primaryReportId(unit: Unit, c, projectId, stackCollection): string | undefined // best origin, then newest date, then id
```

`stackCollectionOf` returns the mapped collection only when `c.collections` has it. Own: `report.collections.includes(projectId)`. Stack: includes the stack collection. Library: every collection is kind `library`. Else other.

- [ ] Tests: mapping present / absent, origin precedence, URL encoding of spaces and parentheses in `document`, gist and other-host URLs.
- [ ] Implement, test, commit.

### Task 3: Project reports for the timeline

**Files:**
- Rewrite: `packages/frontend/src/server/features/audits/getAuditsProjectReports.ts`
- Rewrite test: `packages/frontend/src/server/features/audits/getAuditsProjectReports.test.ts`
- Modify: `types.ts` (`AuditsProjectReport.origin: 'own' | 'stack'`, `AuditsOtherReport.origin: AuditReportOrigin`)

Signature: `getAuditsProjectReports(c: ProjectAuditCoverage, projectId: string, stackCollection: string | undefined, matched: Set<string>): AuditsProjectReport[]`. Own dated reports always; stack reports only when matched. `parseReportDate` keeps its id fallback.

- [ ] Rewrite test with a `ProjectAuditCoverage` fixture; implement; test; commit.

### Task 4: Summary entries and project details

**Files:**
- Create: `packages/frontend/src/server/features/audits/getAuditsProjects.ts` — `ps.getProjects({ optional: ['auditCoverage','ossificationHistory','chainConfig','scalingInfo', ...] })` filtered to projects with coverage.
- Rewrite: `getAuditsSummaryEntries.ts`, `getAuditsProjectDetails.ts`, `countFullyCoveredContracts.ts` (+ test), `getContractsAuditInfo.ts`
- Delete: `AuditCoverageSource.ts`
- Modify: `types.ts` (`AuditsContractEntry.sources` replaces `files`; drop `template`, `warnings`, `matchedBy`, `similarity`, `laterAuditedVersionExists`, `totalVersions`, `auditStatus`, `reviewPhase`, `coverage` on the match, `ignored*` on diff stats, `generatedAt`; add `AuditsUnitMatchEntry.reports: { id; title; auditor; url }[]`, `findingIds: string[]`, `changedLines?: { added; removed }`; `AuditsProjectDetails.stackCollectionName?: string`, `datasetUrl: string`)
- Modify: `packages/frontend/src/utils/project/contracts-and-permissions/getContractsSection.ts` — `ProjectParams.auditCoverage?: ProjectAuditCoverage`; callers in `getL2ProjectEntry.ts`, `getPrivacyProjectEntry.ts`, `getDefiProjectEntry.ts`, `getInteropProtocolEntry.ts` add `'auditCoverage'` to their optional fields and pass it.

Unit entry id: `${flat}:${unitId}`; `unitId` and `flat` are carried for the details query. Diff stats: `added` = sum of `added` span lengths, `removed` = sum of `removed` group lengths.

- [ ] Adapt `countFullyCoveredContracts` to `{ noSource: boolean; units: AuditStatusCounts }[]`; update its test; commit.
- [ ] Rewrite features; `pnpm --filter @l2beat/frontend typecheck`; commit.

### Task 5: Sources at view time

**Files:**
- Create: `coverage/deployedFlatSources.ts` — `indexFlatSources(flat: Record<string,string>): Map<sha256, content>` (strips the header) + `getDeployedFlat(projectId, hash)` with per-project cache keyed by `contentHash`.
- Create: `coverage/auditedBlobs.ts` — `fetchAuditedBlob(repository, blob)`; `Accept: application/vnd.github.raw+json`; `Authorization: Bearer ${env.GITHUB_TOKEN}` when set; `Map` cache.
- Create: `coverage/renderUnitDiff.ts` — `renderUnitDiff(deployed: string[], audited: string[], added, removed, deployedStart, auditedStart): AuditsDiffLine[]` and `toHunks(lines, context = 3): AuditsDiffHunk[]`.
- Tests: `deployedFlatSources.test.ts` (header stripping, hash), `renderUnitDiff.test.ts` (spans → lines, hunk grouping).
- Rewrite: `getAuditsUnitDetails.ts` — params `{ projectId, flat, unitId }`; result `{ startLine, source, stale?: true, audited?: { url, startLine, source }, diff?: { added, removed, hunks } }`.
- Modify: `packages/frontend/src/env.ts` add `GITHUB_TOKEN: z.string().optional()`; `server/trpc/routers/audits.ts` async query.

- [ ] Tests, implementation, typecheck, commit.

### Task 6: Components

**Files:** `UnitRow.tsx`, `UnitDetails.tsx`, `UnitDiffView.tsx`, `ContractCoverageList.tsx`, `AuditReportsList.tsx`, `AuditsProjectPage.tsx`, `components/audits/auditStatus.ts`, `AuditsTimelineChart.tsx` (type only).

- Remove the ignored-changes toggle and counters, warnings, matched-by / similarity; show `+added −removed` from `changedLines`; kind label `function`.
- Match column: audited file link (`match.url`), tooltip lists every report of the unit; "Audit" button opens the primary report.
- `UnitDetails` sends `{ projectId, flat, unitId }`; shows "The deployed code changed since coverage was generated" when `stale`.
- `AuditReportsList` groups by `own | stack | library | other`; the context paragraph becomes one sentence naming the stack collection when present.
- `ContractCoverageList` iterates `sources` (address, role) instead of files; drops `template`.

- [ ] Edit, `pnpm --filter @l2beat/frontend typecheck && pnpm --filter @l2beat/frontend lint`, commit.

### Task 7: Data, cleanup and verification

- [ ] Generate `audit-coverage.json` for the dashboard projects: `pnpm --filter @l2beat/l2b dev audit-coverage <project>` for tornado-cash, umbra, uniswapv3, ethscriptions, facet, privacy-pools, aztecnetwork, bob, celo, optimism, roninnetwork, scroll, unichain; `pnpm --filter @l2beat/config build`; `pnpm --filter @l2beat/config test -- --grep audit-coverage`.
- [ ] Delete `packages/frontend/src/content/audits`, remove `@l2beat/audit-diff` from `packages/frontend/package.json`, delete `packages/audit-diff`, `pnpm install`.
- [ ] Run frontend tests, typecheck, lint; open `/audits/summary` and one project page in the preview; commit.
