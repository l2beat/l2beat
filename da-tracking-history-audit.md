# DA Tracking History Audit — removed/re-keyed configs across all projects

Date: 2026-07-31. Scope: every project with a `daTracking` identity (196 identities / 166 projects
in `src/snapshots/daTracking/snapshot.json`), traced through git history since the DA module start
(2025-02-12, `dabce19233`). The identity-hash guard only exists since 2026-07-29 (`be8875e906`), so
everything before that could be (and was) silently re-keyed.

Method:
- **File sweep**: every historical version of the 34 explicit-`daTracking` project files, the 20
  celestia/avail template-var files, and the DA-layer customer lists (`avail.ts`, `celestia.ts`,
  `eigenda.ts`), parsing identity fields (inbox/sequencers/namespace/appIds/customerId).
- **Discovery sweep**: for the 33 template-derived projects (no `nonTemplateDaTracking` override),
  the history of `discovered.json` identity inputs — opStack: `SystemConfig.sequencerInbox` +
  `batcherHash`; orbit: `SequencerInbox` address + `batchPosters`; zkStack: `ValidatorTimelock`
  address + `validatorsVTL`.
- Also checked: deleted project files (none carried daTracking), celestia/avail template projects
  for hidden earlier ethereum-blob eras (none), and DA-layer switches.

Dates below are **commit dates of the discovery update**; the on-chain rotation is slightly
earlier. Every restoration needs on-chain boundary verification (last tx of old era / first tx of
new era) before writing since/until blocks.

## A. Wiped history that needs restoring (no override exists)

These are template-derived projects where the identity re-keyed while tracking was live. The wipe
is effectively permanent for ethereum-type tracking: the new identity only scans the new
sequencer/inbox, so the old era is never re-indexed. Fix = snapshot full history into
`nonTemplateDaTracking` (current era byte-identical to what the template derives), like `ink` and
`zksync2` already have.

### opStack (batcher rotation and/or inbox change)

| project | wiped era (inbox \| batcher) | live until | current era since |
|---|---|---|---|
| arenaz | `0x00f9bCee08DcE4f0e7906c1f6CFb10C77802eEd0` \| `0x2b8733e8c60a928b19bb7db1d79b918e8e09ac8c` | 2026-04-07 `1b75a189a3` | batcher `0x47827645ba78eb18c3d64fe2146efde66f74894b` |
| hemi | `0xff00…0254` \| `0xde794bec196832474f2f218135bfd0f7ca7fb038` | 2025-06-23 `7c2a365088` | inbox `0xff00…43111` \| batcher `0x65115c6d…` |
| mint | `0x4e31448a098393727B786e25B54e59DcA1B77FE1` \| `0x68bdfece01535090c8f3c27ec3b1ae97e83fa4aa` | 2025-12-11 `21947a46fe` | batcher `0x560afa9cf6b39d8c83938c77036e80807a56da16` |
| r0ar | `0x0004cb44C80B6FBF8CEb1d80AF688C9F7c0b2Ab5` \| `0x9391791f7cb74f8bfda65edc0749efd964311b55` (since 2025-01-22) | 2025-04-04 `defc50d87b` | inbox `0xff00…193939` \| batcher `0xf263a0aa…` |
| snaxchain | 3 eras: `0xff00…01111111`\|`0x5bef09f1…` → 2025-02-21; `0x3276053c…`\|`0x5c89b56b…` → 2025-03-31; `0x8612014a…`\|`0xa9b074b2…` → 2025-04-04 | see left | inbox `0xfec57bd3729a5f930d4ee8ac5992fdc8988426e4` \| batcher `0x060b915c…` |
| superseed | 2 eras: `0xff00…01111111`\|`0x5bef09f1…` → 2025-02-21; `0x3276053c…`\|`0x5c89b56b…` → 2025-03-31 | see left | inbox `0x8612014a343089f1ddbacfd42baf4afbf9133593` \| batcher `0xa9b074b2…` |

⚠️ **snaxchain and superseed had byte-identical inbox+batcher values until 2025-04** — two chains
cannot share these on-chain, so one project's early discovered.json was wrong (likely cloned) and
its "eras" are fictitious / misattributed. Verify on-chain which chain those contracts actually
belong to before restoring either. Similarly the 2025-01-08 values for r0ar/unichain/phala were
identical to ink's genuine inbox (`0x005969bf…`) — early discovery data was cloned; treat any
pre-Feb-2025 "era" with suspicion (harmless anyway: pre-module).

### orbit (batchPosters / SequencerInbox changes)

| project | what was lost |
|---|---|
| powerloom | Inbox changed twice while live: era `0x47861e0419be83d0175818a09221b6df2efd7793` (posters incl. original `0x74978411…`, removed 2025-07-11) until 2025-07-15; era `0x661b39a5eb200dfcbb436d98453bdbf88da02aa1` until 2025-09-10; current inbox `0x903af716aa8c7c27fd785f453d5a59c20e06bdec`. Poster set (9 addrs) unchanged since 2025-06-20. |
| robinhood | Era `0x4ad144ea249a98f77e0b78104d3b6eb6cd3a76da` \| poster `0x9298413c…` (poster dropped 2025-07-22 → that era wiped), then full inbox+poster change 2026-07-03 `167aafe84e` → everything before wiped again. Current: `0xbd0d173eeb87d57a09521c24388a12789f33ba96` \| `0xdaa52608…`. |

### zkStack

| project | what was lost |
|---|---|
| lachain | validatorsVTL rotated 2025-05-28 `9ecb994231`: `0x0f9b807d…`,`0x479b7c95…` → `0xb66d4af4…`,`0xdac93613…` (disjoint) on inbox `0x8c0bfc04ada21fd496c55b8c50331f904306f564`. Era between zk-tracking enablement (2025-04-22, #7540) and 2025-05-28 wiped. |

### Explicit config files

| project | what was lost |
|---|---|
| taiko | Pre-Shasta era: inbox `0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a`, topics BlockProposedV2+BatchProposed, replaced in-place by `e48cbe39b8` (2026-04-10). Verified boundaries: first proposeBlock block 19945276, Shasta MainnetInbox (`0x6f21C543…`) activation block 24792175 (ts 1775135903); last old-inbox BatchProposed at 24792119. |
| morph | Sequencer `0x34e387b37d3adeaa6d5b92ce3059d5c66c1e5e19`-era wiped ~2025-12-30 `af64ce9071` when `sequencers` was emptied on inbox `0x759894ced0e6af42c26668076ffa84d02e3cef60` (disjoint identity change). |
| megaeth | eigen-da customer `0xcd1161b78f01da838ce0d42ec750891ec8708f1d` (added 2025-10-22 #9722) dropped 2025-10-24 in the EigenDA-V2 refactor `e314998832`; re-added 2026-01-19 `4c65833eee` with a *different* id `0x42b5ea5238752cc6f70d93fa4249feae480a0b39` and sinceTimestamp 2025-11-13. Verify which id is correct and whether Oct–Nov 2025 has a hole. |

### Low severity — superset re-keys (full re-download, self-healing)

- **arbitrum**: batchPoster `0x0237e0ea…` added 2025-06-04 (superset) → re-key + re-download only.
- **robinhood** 2025-06-28 poster addition — same.
- **adi**: sequencers grew 2→4 (superset) since creation — same.

## B. Transient gaps (removed then restored; wiped at removal, re-synced after)

Verify backfill actually completed for each:
- **mantle** eigen-da `0x24f0a3716805e8973bf48eb908d6d4a2f34af785`: absent 2026-04-21 → 2026-05-06.
- **karak** celestia namespace `AAAA…JBA=`: absent 2026-07-07 → 2026-07-09.
- **aevo** celestia namespace `AAAA…DBuw7+PjGs8=`: absent for one commit on 2025-10-24.

## C. Intentional / already handled — no action

- **zksync2**: multi-era `nonTemplateDaTracking` restored by the team 2026-07-29..31 (#12409/#12417/#12425).
- **ink**: batcher rotated 2026-07-31; guard caught it; two-era override committed same day (#12411). This is the model fix.
- **avail appId→appIds migration** (2025-08-22 #8971): re-keyed every Avail customer; data re-synced from Avail. Includes **sophon**: sophon-mainnet-2/3/4 merged into sophon appIds `[17,36,37,38]`.
- **space-and-time**: deliberately delisted (tracking removed 2026-01-05 #10417, project deleted 2026-06-30 #12174).
- **rise**: eigen-da entry moved eigenda.ts → rise.ts with identical customerId — identity preserved.
- **aevo** eigen-da `0x24f0…` (2025-10-22, one day): misassigned id, actually mantle's.
- **base, blast, bob, dbk, ethernity, kinto, lambda, lisk, metal, mode, optopia, polynomial, race, shape, soneium*, superlumio, swan, syndicate, thebinaryholdings, treasure*, worldchain, zora, phala*, unichain***: no identity change while tracking was live (*changes were pre-module / pre-enablement; unichain changed 2025-02-11, one day before module start).
- All 20 celestia/avail template projects: namespaces/appIds stable; none ever had an ethereum-blob era.

## Structural risk that remains

Template-derived projects still re-key silently on the *next* rotation (the guard turns it into a
test failure, which is the point). Per the config skill: once a project has any era transition,
snapshot the full history into `nonTemplateDaTracking` — which is exactly the fix needed for every
project in section A.

Raw data: `/tmp/da_audit/` (classification.json, file_findings.json, discovery_findings.json).
