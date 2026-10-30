# Ossification

Ossification measures the maturity of the code securing a project. Code that holds value without changing has survived the potential attacks during its lifetime. The score ranks the time since the last critical change against the age of the code exploited in past incidents. Projects without working proofs are left out: their proposer decides the state, so the age of the code says nothing.

## Clock and metrics

The **critical perimeter** includes the contracts whose code or configuration decides the safety of user funds. A **critical change** to one of them, while it is critical, is a **code change** (a new implementation) or a **state change** (a new value of a `severity: "HIGH"` field). Changes within 24 hours count as one.

The **clock** starts from the newest critical change and falls back to the **genesis**. The genesis is the last deployment of a critical contract within 24 hours after the project start. Older code only counts from the moment this project uses it.

- **Ossification score (0 to 100):** the share of recorded code-bug exploits whose exploited code was younger than the clock, from the `ossification-dataset`. 0 while any critical contract is unverified.
- **Critical changes per year:** over the last 3 years, or since the genesis.
- **Battle-tested exposure:** the value secured, summed over the time on the clock, in USD·years.
- **Contract age:** per contract, not scored. It runs from its last critical change, its deployment or its entry into the perimeter, whichever is latest.

## What resets the clock

- **Additions YES:** a new implementation, verifier, authority path or HIGH value.
- **Removals NO**, even when a HIGH field changes: freezing a verifier route, unsetting a verifier, detaching a contract or renouncing a role.
- **Round-trip upgrades YES**, even when the final code equals the old code. The interim code could rewrite storage.
- **Version-only upgrades NO:** bytecode that differs only in its version string.
- **New contracts NO.** Code takes effect when a critical contract points to it, which is a code or HIGH state change already. New escrows are a judgment call: weigh their share of the TVS and their code diff to the old escrow.
- **New role holders NO**, unless they change the mechanism. On a Safe the mechanism changes with:
  - a new threshold (includes move from EOA to ms with >1 threshold)
  - crossing the Security Council bar of 8 members and a 75% threshold
  - a module or guard that changes a path beyond pausing

  Owner swaps, renounced roles, standard singleton upgrades and pause-only modules leave it unchanged.

## Critical perimeter

A contract is critical when a change to its code or configuration can change the security of the assets, state, availability or privacy it protects. This covers custody, verification, core protocol, escape and pause contracts, and the contracts that upgrade or govern them.

- **Out:** Safes and EOAs, which are actors, and Ethereum system contracts like the EIP-2935 history storage, which are the L1 trust root.
- **Can be in:** Safe modules and guards with their own logic, and multisigs with custom code.
- **Escrows and tokens:** in only when the project's core governance alone controls them and they are [canonical](./canonical_bridge.md). No issuer or other multisig may upgrade or act on them or their counterpart. Tokens count only as the voting power of a binding upgrade path or as the L2 gas token.

## Field severity

- **HIGH:** decides how assets or protected state are controlled, validated, finalized, frozen, censored, lost, created or disclosed. For example verifiers, vkeys, program hashes, thresholds, delays, authority paths, role powers and custody or accounting rules. Resets the clock.
- **MEDIUM:** needs review without a reset. For example the pause state, role holders (`owner` and `$admin` included), rate limits, the set of active verifiers, kill switches, one-way locks and watched state of excluded escrows. Reaches the update monitor and puts the project under review on the frontend.
- **LOW or unset:** multisig members and operational actors like sequencers, batch posters or operators. Unset until researched.

How to encode all of this in discovery config and `ossification.json`: [`packages/config/src/projects/AGENTS.md`](../../../../packages/config/src/projects/AGENTS.md).

## Implementation

```
discovered.json ──┐
diffHistory.md   ─┤
config.jsonc     ─┼─ getOssificationHistory ─► OssificationHistory ─► measureOssification(now) ─► OssificationResult
templates        ─┤      (judgement)                                      (arithmetic)
ossification.json┘
```

### History

`getOssificationHistory` (`packages/config/src/ossification/`) makes every judgement. It has no `now`, so it only changes when its files change. The history holds:

- `contracts`: the contracts critical today, with name, address, verification status, age (`ossifyingSince`) and their own change counts.
- `changes`: the critical changes of current and retired contracts, each with the `updateId` of the `diffHistory.md` entry that recorded it.
- `deployments`: deployments and initializations of critical contracts, to find the genesis.
- `observedSince`: the project start, or the earliest known contract start.

Module reachability is the one `ProjectDiscovery` uses for contracts and permissions. A module whose critical contracts all retired still adds its past changes. The build stores the history in the `ossificationHistory` column of the config database, except for projects listed as Others for missing proofs. They keep their config and `ossification.json`, and come back once their proofs work.

### Sources

From most to least precise:

| Source | Change | Time |
| --- | --- | --- |
| `ossification.json` `events` | code or state, reviewed | exact, from the transaction |
| `$pastUpgrades` of a critical contract | code, the first entry is the initialization | exact, onchain |
| `$pastUpgrades` entry appended in `diffHistory.md` and not known yet | code, for retired contracts and handler gaps | exact, onchain |
| `$implementation` change in `diffHistory.md`, contract without `$pastUpgrades` | code | between two discovery runs |
| change of a field that is HIGH today, in `diffHistory.md` | state | between two discovery runs, or at an upgrade in the same diff |

A change between two runs is dated at the later run, so it never looks older than it is. When the same diff changes the implementation, a state change is dated at the newest known upgrade before the run.

### Update tags

Each critical change tags the `diffHistory.md` entry that recorded it as a code or state update. An upgrade from `$pastUpgrades` tags the first entry whose interval between two runs contains it. A diff that reshapes `$pastUpgrades` shows old upgrades as appended, so the interval check matters. Ignored entries and entries without a previous run tag nothing.

### Measurement

`measureOssification` (`packages/shared/src/tools/ossification/`) only does arithmetic. The frontend calls it with the request time.

- Genesis: the last deployment within 24 hours after `observedSince`, or the first critical change if that comes sooner.
- Clock: from the genesis or the newest change, whichever is later.
- Score: the exploit age percentile of the clock, from `ossificationCurve.json`. That is a copy of the JSON on the `ossification-dataset` website, and its `hash` names the dataset release.
- Rate: changes clustered within 24 hours, over at most 3 years since the genesis, divided by at least 30 days.
- Critical updates: one tag per `updateId`, `code` if any of its changes is a code change.
- Contract age: `ossifyingSince`, never before the genesis.

The frontend computes battle-tested exposure from the TVS without restricted RWA, or the DefiLlama TVL series.

### Parsing

`@l2beat/discovery` parses the inputs: `parseDiffHistoryBlocks` reads `diffHistory.md` back into diff blocks, `getDiffHistoryChanges` types each watched change, and `parsePastUpgrades` reads `$pastUpgrades`. Round-trip, fuzz and corpus tests over every `diffHistory.md` pin them. `CriticalFlag` in `ColorConfig.ts` is the shape of `critical`. `OssificationPatch.ts` validates `ossification.json`.
