# Ossification

Ossification measures how battle-tested the code securing a project is. The
longer the critical contracts stay unchanged while holding value, the more potential
attacks they have survived. We compare that age with the age of code that was
exploited in past incidents.

## Terms

- **Critical perimeter.** The contracts of a project whose code or
  configuration decides the safety of user funds. Research picks them, see
  [Choosing the critical perimeter](#choosing-the-critical-perimeter).
- **Critical change.** A change to a contract in the critical perimeter,
  made while it is critical:
  - a **code change**: a new implementation
  - a **state change**: a new value of a field with `severity: "HIGH"`
- **Clock reset.** What a critical change does: the clock starts again.
  Critical changes within 24 hours count as one.
- **Ossification genesis.** The start of the first clock, once per project.
- **Clock.** Runs from the ossification genesis, or from the newest critical
  change if there is one.

## Metrics

- **Ossification score (0 to 100).** The share of recorded code-bug exploits
  whose exploited code was younger than the clock. 0 while any critical
  contract is unverified. The exploit ages come from the
  `ossification-dataset` repository. `ossificationCurve.json` is a copy of
  the JSON on its website, and its `hash` names the dataset release.
- **Critical changes per year.** The critical changes of the last 3 years, or
  since the ossification genesis if that is more recent, divided by that
  time, but never by less than 30 days.
- **Battle-tested exposure.** The value secured, summed over the time since
  the clock started, in USD·years. The frontend computes it from the TVS or
  DefiLlama TVL series.
- **Contract age.** Shown per contract, not scored: since its last critical
  change, its deployment or the moment it became critical, and never before
  the ossification genesis or the module adoption.

**Ossification genesis.** The project start is set in the project config. The
genesis is the last deployment of a critical contract within 24 hours after
the project start, or the first critical change if that comes sooner.
A project without a start begins at the earliest known start of its
contracts. No clock starts before the genesis: older code only counts from
the moment this project uses it.

**New contracts do not reset the clock.** Code only takes effect when a
contract in the critical perimeter points to it, and that is a code change or
a HIGH state change already.

## Choosing the critical perimeter

A contract is critical when a change to its code or configuration can change
the security of the assets, state, availability or privacy it protects.
Include custody, verification, core protocol, escape and pause contracts, and
the contracts that upgrade or govern them.

- **Not critical:** actor containers like Safes and EOAs, which research
  handles by hand. Ethereum system contracts like the EIP-2935 history
  storage are the L1 trust root and not critical either.
- **Can be critical:** Safe modules and guards with their own logic, and
  multisigs with custom code.
- **Tokens:** critical only when the project governs the token and it is
  either the voting power of a binding upgrade path, or a natively minted
  asset counted in TVS.
- **Escrows:** critical only when the project governs and manages both the
  escrow and its L2 counterpart. Escrows controlled by external token owners
  are left out, also when they have privileged roles. This often leaves one
  or two canonical escrows per project.

Mark a contract with `critical` in a discovery template or in a
`config.jsonc` override. An override beats a template and stays valid when
discovery no longer finds the contract.

- `sinceTimestamp`: the contract is critical from then on. Its earlier
  changes do not count.
- `untilTimestamp`: the contract stops being critical, for example a verifier
  that now only accepts proofs for finalized batches. Use the onchain time it
  was detached. Its later changes do not count, and its verification status
  no longer matters. Set it on an override to keep the history of a contract
  that left without a deletion in `diffHistory.md`.

**Shared modules.** A project's critical perimeter includes the critical
contracts of the shared modules it references and can reach, with the same
reachability `ProjectDiscovery` uses for contracts and permissions. Each
module is judged by its own `config.jsonc`, templates, `diffHistory.md` and
`ossification.json`. A module's changes count from the project start. If the
project adopted the module later, pass the adoption time: the block time of
the transaction that first made a project contract depend on it.

```ts
getOssificationHistory(chainStart, { 'shared-sp1': UnixTime(…) })
```

A module whose critical contracts have all retired still adds its past
changes.

## Field severity

- **HIGH:** decides how assets or protected state can be controlled,
  validated, finalized, frozen, censored, lost, created or disclosed. For
  example role powers, thresholds, delays, controllers, modules, authority
  paths, verifiers, vkeys, program or config hashes, custody or accounting
  rules. A change resets the clock.
- **MEDIUM:** needs review but does not reset the clock. For example the pause
  state, holders of pause roles (`guardian`, `pauser`), or watched state of
  excluded escrows. A change reaches the update monitor and puts the project
  under review on the frontend.
- **LOW or unset:** who fills an unchanged role, like multisig members,
  sequencers, batch posters or operators. Leave it unset until researched.

Before you mark a field HIGH, check that it:

1. Is contract state. `opStackDA` is not: it observes recent batcher
   transactions.
2. Can change on a live system. `gasPayingToken` is fixed at genesis, so it
   only changes with an upgrade, which counts already.
3. Holds configuration, not a live counter. Derive `bufferConfig` from
   `SequencerInbox.buffer` with `"edit": ["delete", "prevBlockNumber", …]`.
4. Does not repeat a value with another severity. Making
   `UpgradeExecutor.accessControl` HIGH would also count changes to
   `EXECUTOR_ROLE.members`, which `executors` shows as LOW.

Role holders of critical contracts are MEDIUM. A new holder is reviewed, and
it resets the clock only when it changes the mechanism, not just the person.
Record such a change in `ossification.json` on the critical contract the role
controls. On a Safe, the mechanism changes with: one signer to a multisig or
back, a new threshold, crossing the Security Council bar (at least 8 members
and a 75% threshold), replacing or nesting the authority, or a module or guard
that adds or removes a path that can do more than pause. Owner swaps,
standard singleton upgrades and pause-only modules do not change it.

Put the severity in the template when it follows from the contract type. Use
a project override for untemplated contracts or deployment-specific calls,
with a comment why.

The history follows a field's current name, so renaming a field cuts off its
history. Give raw and formatted twins the same severity, for example
`getMinDelay` and `getMinDelayFormatted`. Severity applies to the past too:
raising a field to HIGH counts its old changes, lowering it stops counting
them.

## Where changes come from

From most to least precise:

| Source | Change | Time |
| --- | --- | --- |
| `ossification.json` `events` | code or state, reviewed by research | exact, from the transaction |
| `$pastUpgrades` of a critical contract | code; the first entry is the initialization, not a change | exact, onchain |
| `$pastUpgrades` entry appended in `diffHistory.md` and not known yet | code, for retired contracts and handler gaps | exact, onchain |
| `$implementation` change in `diffHistory.md`, contract without `$pastUpgrades` | code | between two discovery runs |
| change of a field that is HIGH today, in `diffHistory.md` | state | between two discovery runs, or at an upgrade in the same diff |

A change between two discovery runs is dated at the later run, so it never
looks older than it is. When the diff also changes the implementation, the
state change is dated at the newest known upgrade before the run.

**The newest change must be exact.** It starts the clock, so the score depends
on it. `ossificationUncertainty.test.ts` fails while a project's newest change
is only known to lie between two runs. Fix it with a reviewed event, or accept
the interval in `acceptedIntervals`.

## ossification.json

Manual corrections, validated by `OssificationPatch.ts`. It does not define
the critical perimeter, discovery config does. Each file only corrects the
contracts of its own discovery, so a shared module has its own file.

Add a reviewed event when discovery cannot date a change, or takes a later
upgrade for the initialization. For proxies without `$pastUpgrades`, bisect
the implementation slot or use a block number the contract records. For a
change between two runs, find its transaction. Record the transaction hash,
its block time and a reason. Link the `diffHistory.md` entry with `updateId`,
and check the link again after rediscovery. Changes after the latest
discovery come in with the next rediscovery, not as reviewed events.

- `events`: reviewed changes, each on a contract in the critical perimeter. A
  change on an excluded Safe goes on the contract the Safe controls. An event
  replaces the automatic change of its contract with the same transaction, so
  a first upgrade that was a real change is listed here as a code event. A
  transaction that upgraded several contracts needs one event per contract.
  An event with an `updateId` replaces the automatic changes of that update
  for its contract.
- `ignoredTransactions`: `$pastUpgrades` transactions that changed nothing,
  for every critical contract they touched.
- `ignoredUpdates`: `diffHistory.md` entries caused by a discovery bug.
- `acceptedIntervals`: `diffHistory.md` entries that may stay the newest
  change although only their interval is known.

Reviewed events follow the same rules as automatic changes: one before the
project start or the contract's `sinceTimestamp` does not count, and one after
its `untilTimestamp` is an error.

## Code

```
discovered.json ──┐
diffHistory.md   ─┤
config.jsonc     ─┼─ getOssificationHistory ─► OssificationHistory ─► measureOssification(now) ─► OssificationResult
templates        ─┤      (judgement)                                      (arithmetic)
ossification.json┘
```

`getOssificationHistory` (`packages/config/src/ossification/`) makes every
judgement. It has no `now`, so it only changes when its files change. The
history holds:

- `contracts`: the contracts critical today, with name, address, verification
  status, age (`ossifyingSince`) and their own change counts.
- `changes`: the critical changes, of current and retired contracts.
- `deployments`: deployments and initializations of critical contracts, to
  find the ossification genesis.
- `observedSince`: the project start, or the earliest known contract start.

`measureOssification` (`packages/shared/src/tools/ossification/`) only does
arithmetic: the genesis, the clock, the score, the rate, and one critical
update tag per `updateId`. The frontend calls it with the request time.

A project opts in with
`ossificationHistory: discovery.getOssificationHistory(chainStart)` in its
config, so ossification can be switched off per project without touching
discovery data. The build stores the history in the `ossificationHistory`
column of the config database.

- `@l2beat/discovery` parses the inputs: `parseDiffHistoryBlocks` reads
  `diffHistory.md` back into diff blocks, `getDiffHistoryChanges` types each
  watched change, and `parsePastUpgrades` reads `$pastUpgrades`. Round-trip,
  fuzz and corpus tests over every `diffHistory.md` pin them. `CriticalFlag`
  in `ColorConfig.ts` is the shape of `critical`.
- `l2b ossification <project> [--history]` prints the result, or with
  `--history` the history. For an opted-in project it uses the config build,
  with the project start and module adoptions, so build `packages/config`
  first. For any other project it derives the history from discovery without
  them.
