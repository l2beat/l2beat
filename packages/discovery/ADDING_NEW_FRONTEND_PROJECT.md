# Adding a project to the L2BEAT frontend

A guide for the second half of adding a project: turning a clean discovery into a rendered project page. Read this AFTER finishing milestones 1-3 in [ADDING_NEW_DISCOVERY.md](./ADDING_NEW_DISCOVERY.md).

## What this guide solves

You finished the discovery loop. `discovered.json` is committed, every contract has a template assignment, the AccessManager's gated targets are walked, and the multi-instance contracts have meaningful names from the `names` block in `config.jsonc`. Now you need a project page on the L2BEAT frontend that shows the contracts, the permissions, and a description.

This guide is the shortest path from "discovery is clean" to "page renders at /scaling/projects/<slug>".

## The single hard fact

**There is no DeFi project type.** L2BEAT routes project pages by category: scaling, data-availability, interop, zk-catalog, ecosystems. None of these is "DeFi" or "applications". The frontend's project page components are hardwired to the category they belong to and select category-specific fields.

If your project doesn't fit any existing category, you have to host it under the most permissive route, which is the **scaling project page** at `/scaling/projects/<slug>`. It's the only page whose `select` includes contracts + permissions + discoveryInfo at the same time.

The cost: you have to set `isScaling: true` and a minimal `scalingInfo` block with `type: 'Other'` and a custom `reasonsForBeingOther`. Don't waste time looking for an alternative — there isn't one yet.

## Recipe: zero to rendered page

1. **Create `packages/config/src/projects/<name>/<name>.ts`.** Use `BaseProject` directly (not `ScalingProject` from `internalTypes.ts`). The internal `ScalingProject` type is for true L2/L3 rollups built on a stack template.

2. **Three discovery wires do all the heavy lifting:**

   ```ts
   const discovery = new ProjectDiscovery('<name>')

   export const project: BaseProject = {
     // ...metadata...
     contracts: {
       addresses: discovery.getDiscoveredContracts(),
       risks: [/* protocol-level "funds can be lost if" entries */],
     },
     permissions: discovery.getDiscoveredPermissions(),
     discoveryInfo: getDiscoveryInfo([discovery]),
   }
   ```

   The Contracts and Permissions tabs are now sourced entirely from `discovered.json`. No per-address bookkeeping in this file. Per-contract descriptions live in the templates (see gotcha 6).

3. **Add the minimal scaling fields to satisfy the page select.** See the boilerplate at the bottom of this file. If any of `display | statuses | scalingInfo | scalingRisks | scalingStage | scalingTechnology | tvsInfo` is missing, the page returns 404 with no error message.

4. **Register in `packages/config/src/processing/refactored.ts`.** Add the import alphabetically and append to the array. There's no other registration step.

5. **Rebuild the config sqlite.** `cd packages/config && pnpm build`. This regenerates `build/db.sqlite`, which is what the frontend reads at runtime, NOT your `<name>.ts` file directly.

6. **Restart the frontend dev server.** `cd packages/frontend && MOCK=true pnpm dev`. The watcher only watches `dist/server`, not `packages/config/build/`, so a config rebuild alone is invisible to a running dev process.

7. **Open `http://localhost:3000/scaling/projects/<slug>`.**

## Boilerplate `<name>.ts`

Copy this and edit. The fields below are the minimum to satisfy the scaling project page select; only adjust the prose, not the structure.

```ts
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('<name>')

export const myproject: BaseProject = {
  id: ProjectId('<name>'),
  slug: '<name>',
  name: '<Pretty Name>',
  shortName: undefined,
  addedAt: UnixTime(<unix>),
  isScaling: true, // route hack: only the scaling project page renders contracts+permissions
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: 'inReview',
    unverifiedContracts: [],
  },
  display: {
    description:
      'One sentence about what users do with this protocol, in plain language.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      socialMedia: [],
    },
    badges: [],
  },
  scalingInfo: {
    layer: 'layer2',
    type: 'Other',
    capability: 'appchain',
    reasonsForBeingOther: [
      {
        label: '<Category>',
        shortDescription:
          '<X> is a <DeFi/whatever> protocol, not a scaling solution.',
        description:
          '<one paragraph explaining why this lives under "Other">',
      },
    ],
    hostChain: {
      id: ProjectId.ETHEREUM,
      slug: 'ethereum',
      name: 'Ethereum',
      shortName: undefined,
    },
    stacks: undefined,
    raas: undefined,
    infrastructure: undefined,
    vm: ['EVM'],
    daLayer: ['Ethereum (calldata)'],
    stage: 'Not applicable',
    purposes: ['Lending'], // pick from ProjectScalingPurpose
    scopeOfAssessment: undefined,
    proofSystem: undefined,
  },
  scalingStage: { stage: 'NotApplicable' },
  scalingRisks: {
    self: {
      stateValidation: { value: 'N/A', sentiment: 'neutral' },
      dataAvailability: { value: 'N/A', sentiment: 'neutral' },
      exitWindow: { value: 'N/A', sentiment: 'neutral' },
      sequencerFailure: { value: 'N/A', sentiment: 'neutral' },
      proposerFailure: { value: 'N/A', sentiment: 'neutral' },
    },
    host: undefined,
    stacked: undefined,
  },
  scalingTechnology: {
    detailedDescription: `
## What is <Project>

<Lead with what users do, what flows the protocol enables. Two or three
paragraphs of plain language. Don't open with architecture.>

## User flows

<Document the main user-facing functions: what to call, on which contract,
with what parameters, and what happens internally. For each flow (e.g.,
supply, borrow, withdraw, repay, liquidation), describe: the function
signature, what tokens move where, what state changes, and what access
control gates it. This section lets a reviewer trace exactly what happens
when a user interacts with the protocol.>

## Architecture

<Contract topology only after the user-facing intro and user flows.>

## Trust map

<Who can change what; the governance chain; how upgrades work. Name the
actual end actors (multisigs, governance contracts) and what each can do.>
`,
    otherConsiderations: [
      // optional named sections, each is { name, description, references, risks }
    ],
  },
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [
      {
        category: 'Funds can be lost if',
        text: '<the realistic upgrade-authority risk>',
      },
    ],
  },
  permissions: discovery.getDiscoveredPermissions(),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
```

## Things I wish I knew on day one

### 1. The frontend reads sqlite, not your .ts file

`packages/config/build/db.sqlite` is regenerated by `pnpm build` (`tsc + node build/build.js`). The frontend dev server reads from this sqlite at runtime. After every edit to your project file, the cycle is:

- `cd packages/config && pnpm build`
- restart `pnpm dev` in `packages/frontend/` (kill the old process; the watcher does NOT watch `packages/config/build/`)

If you skip the rebuild or skip the restart, you'll see stale or 404 content and waste an hour chasing a non-bug.

### 2. Don't go hunting for a "DeFi" project type

There isn't one. There isn't an "applications" page either, or a generic "project page" route. The available routes are scaling, data-availability, interop, zk-catalog, ecosystems. The only one that renders both contracts and permissions out of the box is **scaling**. Reuse it.

### 3. The select is pass-or-fail

`packages/frontend/src/pages/scaling/project/getScalingProjectData.ts` calls `ps.getProject({ select: [...required...] })`. Internally that becomes a SQL `WHERE field IS NOT NULL` for every required field. Drop ANY of `display | statuses | scalingInfo | scalingRisks | scalingStage | scalingTechnology | tvsInfo` and you get `undefined`, which the route turns into a 404 with body `Not found`. There's no error log line. If the page 404s, fill in the missing field rather than guessing about the route.

### 4. `discovery.getContracts()` vs `discovery.getDiscoveredContracts()`

These are NOT the same. They have different return types and different uses:

- `getDiscoveredContracts()` → `Record<chain, ProjectContract[]>`. The right input for `contracts.addresses`. Strips most of the discovery metadata.
- `getContracts()` → `EntryParameters[]`. The raw discovery entries with `template`, `address`, all the values. The right thing to use for filtering / counting / introspection inside your .ts file.

If you want to embed live numbers in the prose (e.g. "there are 3 Hubs and 10 Spokes"), use `getContracts()`, filter on `template`, drop the count into a template literal:

```ts
const NUM_SPOKES = discovery.getContracts()
  .filter((c) => c.template === '<name>/SpokeInstance').length
```

### 5. Lead with the user, not the architecture

The first thing a reader sees is `display.description` and the start of `scalingTechnology.detailedDescription`. If either opens with "X is a hub-and-spoke protocol with a central registry" you've already lost the reader. Open with what the protocol does for users: what flows happen, what they get back, what risk they take. Then document the user flows (function signatures, parameters, what happens internally). Architecture and trust map come after.

The two descriptions render adjacently, so they have to share a tone. Don't make `display.description` technical and `detailedDescription` user-friendly. Readers see two different writers and bounce.

**Never reference internal tooling in user-facing content.** Don't write "Static analysis confirmed..." or "the discovery surfaces..." in `display.description`, `detailedDescription`, `otherConsiderations`, or `contracts.risks`. State facts directly: "All admin functions carry the restricted modifier", not "Static analysis confirmed 9 admin functions carry the restricted modifier." The reader is a reviewer assessing the protocol, not an auditor reviewing your process.

### 6. How template annotations map to the rendered project page

The project page has two discovery-driven sections: **Smart contracts** and **Permissions**. Both are populated entirely from the template annotations you wrote in milestone 3 of the discovery guide. Understanding what feeds what saves you from debugging an empty section.

**Smart contracts section** (fed by `discovery.getDiscoveredContracts()`):
- Each contract's `description` from its template shows as the body text
- `category` determines grouping
- `severity` and `type` on fields control how changes are highlighted by the watcher
- `names` overrides from `config.jsonc` replace raw hex addresses with meaningful names (MainSpoke, EthenaHub, etc.)

**Permissions section** (fed by `discovery.getDiscoveredPermissions()`):
- Populated by `permissions` arrays on address-typed fields in templates (see the discovery guide, milestone 3, "Defining permissions on address-typed fields")
- Each `permissions` entry with `type` ("interact", "upgrade", "act", "guard") and `description` renders as a bullet point under "Can interact with <ContractName>". Use ONE entry per operation (not one blob listing everything). The rendered output should look like a scannable list of capabilities, not a paragraph
- Without `permissions` arrays, this section only shows auto-detected proxy-admin relationships (who can upgrade what) and misses every protocol-specific trust relationship (who can swap oracles, who can drain the treasury, who can pause markets)

**The Permissions section should only show end actors**: EOAs, multisigs, DAOs/governors. These are the actual trusted parties in the system. Intermediary contracts (access managers, configurators, timelocks, proxy admins, executors) should NOT appear as actors; they should only appear in the "via" chains that connect an end actor to the contracts it can act on. If you see an intermediary contract showing as an actor, its template is missing `canActIndependently: false`. See the discovery guide, milestone 3, for the full pattern.

**If the Permissions section looks empty**, go back to the templates and add `permissions` arrays to role member extraction fields. Don't add permissions to `authority` or `accessManager` references on target contracts (that makes the intermediary show as an actor). Instead, extract the role holders on the access control contract itself and put permissions on those extracted fields.

**If the Permissions section shows intermediary contracts as actors**, add `canActIndependently: false` to those contracts' templates. Common intermediaries that need this: AccessManager, ACLManager, ProxyAdmin (already set in the global template), UpgradeExecutor, HubConfigurator, SpokeConfigurator, timelocks.

**Double-check the output** after every change to permissions. Build the config (`pnpm build`) and run:
```bash
node -e "
const { ProjectDiscovery } = require('./build/discovery/ProjectDiscovery');
const d = new ProjectDiscovery('<name>');
const perms = d.getDiscoveredPermissions();
for (const a of perms.ethereum?.actors || []) {
  const types = [...new Set(a.accounts.map(acc => acc.type))];
  console.log(a.name, '(' + types.join(',') + ')');
}
"
```
Every actor should be an EOA or a multisig. If a `Contract` type appears that isn't a multisig or DAO, investigate.

Do NOT write per-contract documentation in your `<name>.ts`. Put `description`, `category`, `severity`, `permissions`, and field-level annotations in `_templates/<project>/<Template>/template.jsonc`.

The .ts file is for protocol-level prose only. Keeping per-contract content in templates lets you avoid two sources of truth and keeps the .ts file short.

### 7. Names overrides are a UX requirement, not a polish step

Without `names` overrides in `config.jsonc`, the Smart contracts section shows raw hex addresses everywhere because the same template is used by N instances of the same shape. With them, the section reads as a trust map (MainSpoke, EthenaIsolatedOracle, AaveGovV3Executor, ...).

Treat the names block as **required** for any project with multi-instance templates, not an optional milestone-3 nicety. The discovery guide already covers this in milestone 3, but it's worth re-emphasizing here because the difference between "named" and "raw hex" is the difference between a useful page and a useless one.

### 8. `MOCK=true` skips the backend; the page still renders

Use `MOCK=true pnpm dev` from `packages/frontend/`. The TVS, activity, and liveness widgets are mocked but the project page (description + contracts + permissions) renders correctly. Without `MOCK=true` you'd need a populated backend (postgres + the backend service) to load any project page at all.

### 9. The `template` typing trap

`template` is a property on `EntryParameters` (the raw discovery type), NOT on `ProjectContract` (the rendered type). If you see `Property 'template' does not exist on type 'ProjectContract'`, you're calling `getDiscoveredContracts()` when you wanted `getContracts()`. See gotcha 4.

### 10. `stage` is a string, `scalingStage` is an object

Confusing but real, and tsc will catch it for you:

- `scalingInfo.stage`: a `ProjectStageName` literal string. For an "Other" project: `'Not applicable'`.
- top-level `scalingStage`: a `ProjectScalingStage` object. For an "Other" project: `{ stage: 'NotApplicable' }`.

Note the casing: `'Not applicable'` (with space) for the string, `'NotApplicable'` (no space) inside the object. Both must be set.

### 11. Port collisions are common

`pnpm dev` starts the server on port 3000 by default. If something else is on that port (mdbook, an orphan dev process, another service), the dev server fails silently and falls into a "waiting for file changes" loop. Set `PORT=3xxx` to dodge it: `PORT=3007 MOCK=true pnpm dev`.

To check what's on 3000: `lsof -nP -iTCP:3000 -sTCP:LISTEN`.

### 12. Type-check is fast and worth doing first

`cd packages/config && pnpm exec tsc --noEmit` runs in seconds and surfaces every type error in the file. Run it after every edit; it's the fastest feedback loop you have. Don't bother starting the dev server until tsc is clean.

### 13. The `isScaling: true` blast radius

You're tagging your DeFi project as "scaling", which means it might leak into scaling-related catalogs and tables. To minimize the damage:

- `stage: 'Not applicable'` and `scalingStage: { stage: 'NotApplicable' }` keep it out of the scaling stage tables
- `tvsInfo.associatedTokens: []` keeps it out of TVS rankings
- `scalingRisks.self.*` set to `'N/A'` keeps it out of risk-by-stage filters
- `reasonsForBeingOther` with a custom entry sends it to the "Others" filter rather than a real category

This makes the project visible at its URL but minimally polluting elsewhere. If you find it showing up in a place it shouldn't, check whether there's a `select` or filter that needs additional `whereNot` to exclude it.

## File anatomy

```
packages/config/src/projects/<name>/
├── config.jsonc              from milestone 1 (discovery)
├── discovered.json           from milestone 1 (discovery)
├── diffHistory.md            from milestone 1 (discovery)
├── .flat/                    from milestone 1 (discovery)
└── <name>.ts                 ← THIS GUIDE

packages/config/src/processing/refactored.ts   ← register your project
packages/config/build/db.sqlite                ← regenerate via pnpm build
packages/frontend/                              ← run dev server here
```

## What to do AFTER the page renders

- **Contracts panel**: every entry should have a template assignment. Bare addresses indicate a missing template; go back to milestone 3 of the discovery guide and add them.
- **Permissions panel**: roles should have descriptions. If they're empty, the AccessManager (or equivalent) template needs richer field annotations on the role-tracking event handlers.
- **Duplicate names**: every contract in the panel should be uniquely named. Two contracts showing as the same display name means you're missing a `names` override.
- **Description vibe**: re-read your `display.description` and `detailedDescription` together. They render side by side; if they don't share a tone, the page reads like two articles glued together.
- **Iterate on `detailedDescription`**: this is the longest-lived prose on the page; make it answer "what does this protocol do" and "what's the trust assumption" clearly enough that a reader can decide whether they care.

## Common errors and what they mean

| Symptom | Cause | Fix |
|---|---|---|
| Page returns `404 Not found` | Missing field in the page's select | Check `display`, `statuses`, `scalingInfo`, `scalingRisks`, `scalingStage`, `scalingTechnology`, `tvsInfo` are all set |
| Contracts/Permissions panel empty | Frontend is reading stale sqlite | `cd packages/config && pnpm build`, then restart `pnpm dev` |
| `Property 'template' does not exist on type 'ProjectContract'` | Calling `getDiscoveredContracts` instead of `getContracts` | Use `getContracts()` for filtering/counting |
| `Type '{ stage: string }' is not assignable to type 'ProjectStageName'` | Mixed up the two stage fields | `scalingInfo.stage` is a string; top-level `scalingStage` is an object |
| `Port 3000 is already in use` followed by `Failed running 'dist/server/index.js'` | Another process is on 3000 (often mdbook) | `PORT=3007 MOCK=true pnpm dev` |
| `compdef:153: _comps: assignment to invalid subscript range` | Harmless zsh warning from completions | Ignore |
