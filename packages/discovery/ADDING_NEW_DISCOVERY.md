# Adding a project to L2BEAT discovery

A no-fluff guide. Read this once before you start; it will save you several iterations.

## Mental model in 30 seconds

You write a `config.jsonc` (the question). The discovery engine BFS-walks the contract graph from a few seed addresses, reading every state value, following every address-typed reference, and writes a `discovered.json` (the answer). Both files live in `packages/config/src/projects/<name>/`.

Your job after the first run is to *cut noise*: stop the engine from walking into things that aren't part of your project. You do this by adding `ignoreRelatives` on specific fields, almost always inside reusable **templates** that match contracts by the hash of their flattened source (see "Templates vs `config.jsonc` overrides" in milestone 1).

`discovered.json` is committed, so future runs can diff against it. That's how the L2BEAT monitoring/watcher pipeline detects upgrades.

## Recipe: zero to clean discovery

`l2b` auto-loads `packages/config/.env` from any directory inside the repo, so the commands below work from anywhere (you no longer need to `cd packages/config` first).

1. **Scaffold the project** with `l2b init`:

   ```bash
   l2b init <name> <chain> 0x...your seed contract... --max-addresses 50
   ```

   This creates `packages/config/src/projects/<name>/config.jsonc` with the right `$schema`, `import`, `name`, `maxAddresses`, and `initialAddresses`. Pass multiple seed addresses as additional positional arguments if you need them; 1 to 3 is usually enough since the BFS finds the rest. The `<chain>` argument is the long chain name (`ethereum`, `arbitrum`, `optimism`, ...); init translates it into the chain prefix on the addresses. You can find all the supported chains inside `packages/shared-pure/src/types/ChainSpecificAddress.ts`.

   - **Always pass `--max-addresses 50`**. It's a fail-fast tripwire, not a budget — see `maxAddresses` is a strict cap in Milestone 1 for why. You'll raise it later, after cleanup.

2. **First run** (downloads sources from Etherscan, slow on cold cache):

   ```bash
   l2b discover <name>
   ```

   **Use `--analyze-timeout` on unfamiliar protocols.** Some chains have buggy contracts that cause the JSON-RPC to return errors that trigger long retry loops in the engine. Pass `--analyze-timeout` to bound this. Timed-out addresses are reported in the summary so you can see what was lost. Use `60000` (60s) for cold-cache runs:

   ```bash
   l2b discover <name> --analyze-timeout 60000
   ```

3. **From now on, use `--dev`** for iteration. It re-uses the saved block and the SQLite cache and runs in seconds:

   ```bash
   l2b discover <name> --dev
   ```

   With `--dev`, drop the timeout an order of magnitude (`--analyze-timeout 5000`). A 60-second per-contract budget masks the difference between "the run is genuinely working" and "an RPC call is stuck", which defeats the point of the fast iteration loop.

4. **Read the contracts.** The first run downloaded every verified contract's flattened source to `.flat/<ContractName>/`. Read it before continuing: the engine reads on-chain state, you bring understanding, and every later step (cuts, handler choice, descriptions, permissions) depends on knowing what the code does. Use that reading to sanity-check the entries: if the project deploys multiple pools / vaults / markets and only one appears, the seed is undersampling. Fix it now (see "Multi-instance projects" below).

5. **Walk through the three milestones below in order:**
   - **Milestone 1**: cut noise (foreign protocol contracts pulled in via oracles, registries, etc.)
   - **Milestone 2**: fix `Too many values` errors and enumerate config behind mappings
   - **Milestone 3**: turn the discovery into a trust map (descriptions, severity, role/membership tracking via events, and naming + understanding every duplicated instance)

6. **When clean**, raise `maxAddresses` to a comfortable margin above the final entry count (e.g. final = 92, set to 150) so future runs hit the cap warning if a refactor accidentally pulls in noise. Don't bump it before milestone 1 is done; the low cap is what makes the cleanup loop fast.

## Milestone 1: cleanup loop (cut noise)

### First, confirm topology completeness

If the sniff test in recipe step 4 surfaced missing instances, fix the seed before any cleanup. Find the registry that lists all instances and enumerate it:

- **Factory or central registry with a list getter** (`getAllPools` / `getAllVaults` / `instances()`): enumerate via an `array` handler with explicit `length` (see milestone 2 for the pattern). The new instances are then walked by the BFS and matched by shape.
- **OZ V5 `AccessManager`** (or any role-based authority where every gated contract is registered as a *target*): enumerate via an `event` handler. Such authorities typically emit one log per gated target — for OZ V5 the event is `TargetFunctionRoleUpdated(address indexed target, bytes4 selector, uint64 indexed roleId)`. Add a flat helper field to the authority's template:

  ```jsonc
  "$gatedTargets": {
    "description": "Internal: deduped flat list of every gated target address (so the BFS picks them up).",
    "handler": {
      "type": "event",
      "select": "target",
      "add": { "event": "TargetFunctionRoleUpdated" }
    }
  }
  ```

  Leading `$` is convention for "helper field". The absence of `groupBy` is deliberate: `groupBy` keys are not walked by the BFS, so you need a flat field for the target addresses to surface as discovery entries (subtlety 2 in milestone 3).

- **Governance executor or proxy admin that owns every instance**: walk the upgrade authority's history (event handler on `Upgraded` / `OwnershipTransferred`).
- **No on-chain registry, address book is offchain only** (deployment scripts, the team's documentation): add the missing instance addresses to `initialAddresses` as a last resort. This is the one legitimate exception to "keep `initialAddresses` minimal" — the orphan-rot risk described in "When a source field returns mixed project + foreign relatives" still applies long-term, so revisit periodically.

Treat under-sampling as a higher-priority bug than any leak. A leaky discovery wastes time. An undersampled discovery is silently *wrong*: the trust map omits whole sub-systems and the watcher will never alert on changes to them.

### The cleanup loop

After your first run, look at `discovered.json` and ask "what's in here that isn't part of my project?". The fastest way to find the cuts you need is `l2b leaks`:

1. **Run** `l2b leaks <name> --top 10`. This ranks contracts by how many address-typed fields the BFS still walks out of them ("leaks" here means *fields BFS walks*, not *fields leaking into foreign code*). Early in cleanup the top entries are typically boundary contracts walking into foreign clusters — that's where to cut. Once cleanup is done they're usually your project's central registries pointing at peer contracts, which is fine. Each target is annotated with its template assignment so you can see at a glance which targets are already known versus unidentified.

2. **For each high-rank target, decide: is this contract part of your project?** Did your team deploy and control it? Foreign dependencies — Chainlink price feeds, Lido stETH, an external oracle the project consults, generic ERC20s the project just holds, a parent protocol the project is built on — are NOT part of your project no matter how trust-critical. Common culprit shapes to look for: generic registry getter (`*.getAll...`, `*.list...`), per-item getter that returns the underlying token (`*.UNDERLYING`, `*.token`, `*.asset`), oracle source list (`*.getSource`, `*.feed`), proxy admin slot (`$admin`). In doubt → assume yours.

3. **For each foreign destination, add `ignoreDiscovery: true`** to your project's `config.jsonc` `overrides` block:

   ```jsonc
   "overrides": {
     "<chain>:0xForeignAddress": { "ignoreDiscovery": true }
   }
   ```

   The address still appears in source contracts' `values` (the seam where your project depends on it stays visible), but no entry is created in `discovered.json` and the BFS stops walking. Project-scoped: doesn't affect any other project's discovery, and the foreign project gets its own discovery later if a researcher needs its internals. For project-internal contracts at this stage, no action is needed — handler tuning is Milestone 2, descriptions and templates are Milestone 3.

4. **Re-run** `l2b discover <name> --dev` and `l2b leaks` to verify the foreign clusters have collapsed.

### One subtlety: the proxy `$admin` slot

Proxy detection records the proxy admin address as a top-level `$admin` value on the entry. Unlike `$implementation` and `$pastUpgrades` (which are auto-filtered as ignored addresses), `$admin` is walked by the BFS as a normal relative. If `$admin` resolves to a foreign address (e.g. a multisig owned by a parent protocol), apply `ignoreDiscovery: true` on the admin's address in the same way as any other foreign destination. `l2b inspect` and `l2b leaks` both surface `$admin` with a `[LEAKING]` marker so this is easy to spot.

### Batching cuts: read leaks once, edit many

Don't iterate cut-by-cut. The topology you need is already in `discovered.json`, and `l2b leaks` reads it directly without re-running discovery. The fast loop is:

1. `l2b leaks <name> --top 20` to get the global picture.
2. Walk the list and decide foreign-or-yours per target. For ambiguous ones, `l2b leaks <name> --address <addr>` shows the entry's outgoing-field breakdown to help recognise it.
3. Add all the `ignoreDiscovery: true` entries for the foreign targets to `config.jsonc` in one batch.
4. `l2b discover <name> --dev` once.
5. `l2b leaks <name> --top 20` again to see what survived.

### When `l2b leaks` isn't enough: trace one address with `l2b why`

Use `l2b why <name> <address>` when the leaks output names a target you don't recognize and you want to know *which fields on which contracts* reference it. `why` lists every reference, marked LEAKING or IGNORED, and with `--root` it prints the shortest non-ignored path from any seed to the target — useful for finding the single boundary contract that pulls in a foreign cluster you didn't expect.

### How `ignoreRelatives` works

You add `ignoreRelatives` on the SOURCE contract that walks into the foreign address — there is no "skip USDC" knob. When the same noise address is reachable from N different sources, every source needs its cut; use `l2b why <name> <address>` to list every contract+field that references it.

The cut blocks BFS traversal but leaves the field's value in `discovered.json`. Don't be confused when USDC still shows up inside `getAllTokens`; what matters is whether USDC itself has its own entry.

A common trap: the same stored address is exposed through both a camelCase getter and a SCREAMING_CASE constant (e.g. `foo()` and `FOO`), or kept as an alias when a contract is renamed. `ignoreRelatives` filters by *field name*, so cutting one is not enough — scan the entry's `values` for the same address appearing under multiple keys, and cut all of them.

### When a source field returns mixed project + foreign relatives

`ignoreRelatives` is field-level, not element-level. A single field can return a tuple or array that mixes project-internal and foreign addresses (e.g. `getItem(itemId)` returns `(underlyingToken, parentRegistry, ...)` — underlying foreign, parent registry project-internal). Cutting it wipes both. Cutting a field that is the only path to a project-internal contract silently removes that contract and everything below it; the summary will look fine. This is the most common way to lose half a project's templates in one edit.

Several options, in order of preference:

- **Skip the foreign side entirely.** `ignoreDiscovery` on each foreign address — the standard rule from "Is this contract part of your project?" below. The source field stays walked, project-internal addresses come through, foreign addresses don't get entries.
- **Reroute the project-internal address through a different field** so you can cut the source via `ignoreRelatives`. Use `l2b why <name> <project-internal-address>` to find another LEAKING entry on a different contract.
- **Last resort: a `copy` + `edit` helper field** on the same contract that re-extracts only the project-internal addresses from the source field, using the same `edit` DSL that Milestone 3 uses for access-control role extraction. The BFS walks the helper, the original mixed field can then be safely cut. A hack, but localized.

**Don't add the project-internal address to `initialAddresses` as a workaround.** `initialAddresses` is the seed list for the BFS, not a routing escape hatch. Padded entries are discovered independently of the contract graph, so when the project evolves and the entry loses its natural on-chain link, it becomes an orphan node — silently disconnected from the rest, but still in the discovery. Over time you end up with two unrelated subgraphs in one `discovered.json`.

### Is this contract part of your project?

Every address the BFS reaches falls into one of two buckets, decided by **deployment and control**, not by trust-relevance:

- **Yours** — your team deployed it and your team controls it. Walk it. Templates and descriptions for it happen in Milestone 3.
- **Foreign** — anyone else deployed it. This includes contracts your project critically depends on (Chainlink price feeds, Lido stETH, an external oracle the project consults, a bridge endpoint that gates your funds, a parent protocol you're built on top of). It does not matter how trust-critical the dependency is: the foreign contract's internals belong in the foreign project's own discovery, not in yours. Add `ignoreDiscovery: true` to your `config.jsonc` `overrides` block; the address still appears in your source contracts' `values` (so the seam where your project depends on it stays visible), but no entry is created. Use a `names` entry in `config.jsonc` if you want the foreign address to render with a meaningful label.
- **In doubt** — assume yours and keep walking. Better to over-discover (caught fast by `maxAddresses` and a re-evaluation pass) than to silently exclude a project-internal contract.

**Why no foreign templates?** Templates match by flattened-source hash (see "Templates vs `config.jsonc` overrides" below) and apply globally, so cuts on a foreign template would silently apply when the foreign project gets its own discovery and would strip facts that *that* project's reviewer needs. The discoveries compose instead: project A's discovery describes A; if B depends on A, B's discovery shows the seam in source `values` and `ignoreDiscovery` keeps A's internals out.

If a single field on one of your contracts returns many foreign addresses (a deposit asset list, a registered-tokens array), the per-address `ignoreDiscovery` becomes verbose. In that case, the **asset list cut** pattern via `ignoreRelatives` on the field is more compact:

```jsonc
{
  "ignoreRelatives": ["getReserveList", "getSupportedAssets", "underlyingAssets"]
}
```

Goes in your project-internal template for the contract that holds the registry. Check first that the field returns *only* foreign addresses; if it's mixed, see "When a source field returns mixed project + foreign relatives" above.

**Bias toward a smaller `discovered.json`.** A complete discovery contains every contract a reviewer needs to read about *your* project. One that contains foreign internals is both noisy (inflates the watcher diff surface) and presumptuous (you've decided what the foreign reviewer should see). Keep your project's discovery focused on your project's contracts.

### `maxAddresses` is a strict cap

Default is 500. If discovery hits it, the run still completes but the cap-skipped addresses are reported in `WARNING: N addresses skipped due to maxAddresses cap`. **During the cleanup loop, lower the cap, don't raise it.** Keep it below the explosion threshold so each iteration is fast; only raise it once cap warnings stop appearing. The cap is strict (no parallel overshoot), so the entry count will never exceed the value you set.

If you bumped the cap to 2000 to "see the real picture" and each run now takes minutes downloading sources you're about to throw away, drop it back to ~50, use `l2b leaks` to identify the boundary contract, cut at the boundary, re-run, repeat. Each iteration becomes seconds.

### Templates vs `config.jsonc` overrides

Templates match contracts by hashing their **flattened source**. After the first discovery, every verified contract's source is fetched from Etherscan and run through L2BEAT's flattener, which inlines every imported file into a single `.sol` file under `.flat/<ContractName>/`. The hash of that flat file is the contract's *shape*: two deployments with the same flattened source produce the same shape and match the same template, no matter where they're deployed. (It is *not* a hash of the deployed bytecode — there is no compilation step involved.)

Use templates for facts that are true wherever the shape matches (this field is runtime state, this is what the contract does, this is the access-control map). Use `config.jsonc` overrides for anything that depends on *who's discovering* (`names`, per-project `category`, `ignoreInWatchMode`, and the foreign-destination cuts covered above). Putting project-perspective state in a template silently re-applies it the next time the same shape shows up under a different project.

## Milestone 2: fix errors, fetch hidden config

When the noise is gone you'll see an `Errors during discovery: N` block with `Too many values. Update configuration to explore fully` on a bunch of fields. These come from the engine's default 5-item probe for any `function getX(uint256) view returns (...)`: if all 5 calls succeed it gives up. Two fixes per field:

**Only act on fields that errored.** `ignoreMethods` and the `array` handler exist to fix engine errors, not to tidy up `discovered.json`. A field that returns successfully stays as-is even if it looks like noise — leaving it is free. Reach for `ignoreMethods` only when the engine actually trips over the call.

### Field is runtime state → `ignoreMethods`

If the field is a current balance, an accumulated counter, an accrued fee, an interest index — anything that changes every block — don't call it at all:

```jsonc
{
  "ignoreMethods": [
    "getItemBalance",
    "getItemAccruedFees",
    "getItemIndex"
  ]
}
```

### Field is config → `array` handler with explicit length

If the field is per-item risk parameters, a registered list of components, role enumerations — anything you want monitored — tell the engine how to enumerate it via an `array` handler. `length` is a `{{ ... }}` reference to another field on the **same contract** (typically a count getter):

```jsonc
{
  "fields": {
    "getItem": {
      "handler": {
        "type": "array",
        "method": "getItem",
        "length": "{{ getItemCount }}"
      }
    }
  }
}
```

The handler calls `getItem(0)..getItem(N-1)` and stores the result as one array.

### When the count lives on another contract: cross-contract length

A common pattern: contract A has a per-item getter, but the item count lives on a paired registry contract B that A points to. The `call` handler supports cross-contract calls via two tricks:

- `address: "{{ field }}"` resolves to another contract's address (the value of a field on the *current* contract)
- a `method` containing a space is parsed as a full function signature inline (no local-ABI lookup needed)

Combine them via a hidden helper field, then reference it as the array length:

```jsonc
{
  "fields": {
    "_itemCount": {
      "handler": {
        "type": "call",
        "method": "function getItemCount() view returns (uint256)",
        "args": [],
        "address": "{{ registry }}"
      }
    },
    "getItemSource": {
      "handler": {
        "type": "array",
        "method": "getItemSource",
        "length": "{{ _itemCount }}"
      }
    }
  }
}
```

Leading `_` is convention for "hidden helper field". Reusable for any hub-and-spoke, registry-and-instance, or factory-and-product architecture.

**Field references in `{{ ... }}` are case-sensitive and must match the field name as it appears in `discovered.json`.** Solidity has no canonical naming convention: a contract may expose its registry via `registry` (camelCase getter), `REGISTRY` (immutable/constant), or even `Registry` (legacy). Copy the name exactly from the entry's `values` block, not from the contract source — the discovered name is what the engine resolves against.

### Avoid `maxLength` on mapping-style getters

The `array` handler also accepts `maxLength: N` which iterates `0..N-1` and breaks on the first `Execution reverted`. **This only works if the method actually reverts on out-of-bounds access.** If it's a mapping read like `return _sources[itemId];`, Solidity returns the zero value of the return type for missing keys instead of reverting, so the handler collects N zeros and errors. The error message will tell you so. Always set `length` explicitly for mapping-style getters.

### Decision tree

For each "Too many values" field:

```
Is the value runtime state (changes every block)?
  yes → ignoreMethods
  no  → Does this contract have a count getter for the underlying array?
    yes → array handler with length: "{{ countField }}"
    no  → Does another contract (referenced by this one) have the count?
      yes → cross-contract length: hidden _count field via call handler
      no  → Does the method revert on out-of-bounds (not a mapping read)?
        yes → array handler with maxLength: <safe upper bound>
        no  → ignoreMethods (can't safely enumerate)
```

### Expect a milestone-1 cycle-back

Enumerating an array that previously returned only its first 5 elements typically expands the discovery: if the registry had 50 items and you only saw 5, you now walk all 50, and each new item may reach into a new cluster of foreign contracts you hadn't seen before. The cap-skipped count usually jumps after the first milestone-2 round.

This is normal. After re-running discovery, run `l2b leaks <name> --top 20` again and treat the new top entries as a fresh milestone-1 pass: `ignoreDiscovery` the new foreign destinations, batch the edits, re-discover. Don't bump `maxAddresses` to "see the real picture"; keep the cap low and let it tell you when you're done.

## Milestone 3: trust analysis (descriptions, fields, events)

After milestones 1 and 2 the discovery is structurally clean and complete. Milestone 3 turns it into a **trust map**: a future reader of `discovered.json` should be able to answer "who can move my funds?" without ever opening the contract source.

### Per-template annotations

For each template, edit `template.jsonc` and add:

1. **`category`**: `"core"` (protocol-critical), `"gov"` (admin/access-control), or `"shared"` (libraries, helpers).
2. **`description`** capturing what the contract does AND the trust assumption: *"if you trust this contract, you trust X to do Y"*. Mention the upgrade path explicitly for proxies.
3. **`fields.<name>.description`** for every critical field (anything you'd flag with HIGH severity per bullet 4), and for any non-critical field whose meaning isn't obvious from its name and type — if a reader would have to open the source to understand it, write the description. Skip self-explanatory fields (`name`, `symbol`, `decimals`, `paused`).
4. **`fields.<name>.severity: "HIGH"`** on any field whose change is a meaningful risk event (oracle source, role admin, fee receiver, liquidation parameters, anything controlling upgrades or pauses). Use `"LOW"` for cosmetic / metadata fields.
5. **`fields.<name>.type`** to classify it: `"PERMISSION"` (grants rights), `"RISK_PARAMETER"` (tunable risk knob), `"CODE_CHANGE"` (upgrade pointer), `"L2"` / `"EXTERNAL"`.

These show up in the L2BEAT UI and feed the watcher's diff filtering.

**Description discipline.** Every description must come from the `.flat` source — never from the contract's name, the field's name, or what the contract probably does by analogy to similar protocols. If you can't point at a line of source that justifies the claim, omit the claim or omit the description entirely. A missing description is fine; a confidently wrong one misleads the reader. Keep the prose contract-facing, not tool-facing: write "All admin functions carry the restricted modifier", not "Static analysis confirmed 9 admin functions carry the restricted modifier" — the reader doesn't need to know what tools you used to verify the facts.

### Defining permissions on address-typed fields

A `permissions: [...]` array on an address-typed field declares what the addresses that field points to can do on this contract. Each entry has:

- **`type`** — one of three values:
  - **`act`** — receiver can act *through* this contract. This is the chaining glue: if A acts through B and B has any permission on C, A transitively inherits B's permission on C. Use it for ownership and control relationships (multisig owns ProxyAdmin; ProxyAdmin admins a proxy → the multisig transitively can upgrade the proxy).
  - **`interact`** — receiver can call privileged functions on this contract. Terminal: it does not chain further. Use it for the operations that should render as trust-map bullets.
  - **`upgrade`** — receiver can upgrade the implementation. Auto-emitted from each entry's `$admin` slot, so you rarely write it explicitly. Terminal.
- **`description`** — a plain-language sentence describing ONE operation. Used as the bullet text in the rendered output.
- **`delay`** (optional, seconds) — delays sum along an `act`-chain. A multisig acting through a 7-day timelock that holds an `interact` permission on a registry renders with `delay = 7 days` on that interact.

**One entry per operation, not one entry for all of them.** Each entry renders as a separate bullet. Bad:

```jsonc
"permissions": [{
  "type": "interact",
  "description": "reconfigure the entire permission system, change all parameters, upgrade contracts, and do everything else."
}]
```

Good:

```jsonc
"permissions": [
  { "type": "interact", "description": "swap oracle price sources on any Spoke." },
  { "type": "interact", "description": "pause/freeze individual reserves or entire markets." },
  { "type": "interact", "description": "list/delist assets on any Hub." },
  { "type": "interact", "description": "grant/revoke any AccessManager role." }
]
```

#### End actors vs intermediary contracts

The trust map should surface **end actors** — EOAs, multisigs, DAOs/governors — not the contracts that route trust between them. The resolver does this automatically for any intermediary that emits an `act` permission to its controller: a ProxyAdmin whose `owner` field has `permissions: [{type: "act"}]` is skipped, and the multisig that owns it ends up as the actor. Wire `act` correctly on the field that points at the controller and you usually don't need to do anything else. Set `canActIndependently: false` on a template only when you see an intermediary still showing as an actor in the rendered output (e.g. "ProxyAdmin can upgrade Contract") — it's an override for cases the auto-rule misses, not a default to apply preventively.

#### Role-based access control: extract the actual holders

For contracts that manage roles (OpenZeppelin AccessControl, AccessManager, custom role registries), don't put `permissions` on the `authority` reference on the target contract (that would make the access control contract itself show as an actor). Instead:

1. Extract specific role members into named fields using `copy`/`edit` (for event-handler-produced grouped data) or `pickRoleMembers` (for the built-in `accessControl` handler).
2. Put `permissions` on those extracted fields with `"type": "interact"` and a description of what that role can do.

Example for an OZ V5 AccessManager — use the `accessManagerV5` handler. It automatically decodes function selectors into human-readable signatures and labels roles by name instead of numeric ID:

```jsonc
{
  "fields": {
    "accessControl": {
      "handler": { "type": "accessManagerV5" }
    },
    "adminRoleMembers": {
      "copy": "accessControl",
      "edit": ["pipe", ["get", "roles", "ADMIN_ROLE", "members"], ["map", ["get", "member"]]],
      "permissions": [
        { "type": "interact", "description": "swap oracle price sources on any Spoke." },
        { "type": "interact", "description": "pause/freeze individual reserves or entire markets." },
        { "type": "interact", "description": "grant/revoke any role and change role-to-function mappings." }
      ]
    }
  }
}
```

**Prefer `accessManagerV5` over manual event handlers for OZ V5 AccessManager contracts.** The `accessManagerV5` handler decodes the `TargetFunctionRoleUpdated` event's 4-byte selectors against the target contract's ABI, producing output like `addAsset(address,address,...)` instead of `0xa7aeae20`. It also labels roles by their `RoleLabel` event names. The decoded output is dramatically more useful for reviewers than raw hex. The `copy`/`edit` pattern then extracts per-role members from the handler's structured output.

Example for an OZ legacy AccessControl (bytes32 roles):

```jsonc
{
  "ignoreRelatives": ["accessControl", "riskAdmins", "poolAdmins"],
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl", "roleNames": { "0x12ad...": "POOL_ADMIN", "0x8aa8...": "RISK_ADMIN" } }
    },
    "poolAdmins": {
      "handler": { "type": "accessControl", "roleNames": { "0x12ad...": "POOL_ADMIN" }, "pickRoleMembers": "POOL_ADMIN" },
      "permissions": [{ "type": "interact", "description": "change discount rates on price adapters, affecting liquidation thresholds." }]
    }
  }
}
```

Note the `ignoreRelatives` on the role member fields: this prevents the BFS from walking every role holder (which can include flash borrower contracts, automation agents, etc. that would explode the discovery). The addresses still appear in the field values and in the permissions output, but don't get BFS-walked. If a role holder turns out to be an important actor you want fully discovered, add it to `initialAddresses` explicitly.

#### Simple owner pattern

For contracts with a single `owner` field (not role-based), put `permissions` directly on it — the owner is the end actor.

```jsonc
"fields": {
  "owner": {
    "severity": "HIGH",
    "type": "PERMISSION",
    "permissions": [{ "type": "interact", "description": "transfer any ERC20 out of the contract, withdraw from any Hub, and transfer ownership. No timelock." }]
  }
}
```

#### Verifying the permissions output

After setting up permissions, run `l2b model-permissions <project>` and then `l2b show-permissions <project>`. The output prints every actor with its account type, participant count, and the resolved capability bullets (with `act`-chain delays and `via:` paths). Check three things:

1. **Only end actors appear.** Anything flagged `[SUSPECT — Contract with no participants]` is most likely an intermediary that escaped the auto-rule — add `canActIndependently: false` to its template and re-run.
2. **Every trust path is represented.** A path described in the project but absent from the output means a missing role-extraction field.
3. **Each actor's bullets match its actual privileges.** A missing bullet means a missing `permissions: [...]` entry on the relevant template.

Pass `--short` to skip the bullets when you only want the identity check.

**Don't skip this step.** A project with `severity: "HIGH"` and `type: "PERMISSION"` on every trust-critical field but no `permissions` arrays captures the contract topology but not the trust relationships. Getting this wrong means the rendered page either shows an empty permissions section (missing `permissions` arrays) or shows intermediary contracts as actors (auto-rule miss — apply `canActIndependently: false` to that specific template), both of which mislead the reader.

### Fetching state behind events with the `event` handler

Solidity mappings can't be enumerated via RPC the way fields or arrays can. Each value sits at `keccak256(key, slot)`, but the mapping itself stores no length and no key list — without an external side index, there's no way to read all of it from outside. The workaround: read the contract's source, find the function that writes to the mapping, and check whether it emits an event with the key as a topic. If it does, you can replay the event log to reconstruct the mapping's current state. The `event` handler does exactly that — query logs by topic, fold them with `set` or `add`/`remove` semantics, expose the result as a discovery field.

Anything mapping-backed is fair game: role members (`RoleGranted` / `RoleRevoked`), whitelisted tokens (`TokenAdded` / `TokenRemoved`), approved operators, per-asset risk config, per-cycle Merkle roots, snapshotted price submitters, etc. The role-membership case shown below is just the most common.

Two modes:

- **`set:`** keeps only the LATEST matching event. Use for "current value of X".
- **`add:` / `remove:`** maintains a deduped set: each `add:` event adds, each `remove:` removes. Use for membership tracking.

Both support:

- **`groupBy: "fieldName"`** — bucket the result into a `{key: ...}` map keyed by an event field.
- **`select: "field"` or `["a", "b"]`** — pick which event fields to keep.
- **`where: ["=", "#fieldName", value]`** — blip-language filter on event fields.
- **`ignoreRelative: true`** — don't follow address values as BFS relatives. Off by default. Set only when you have inspected the values and confirmed they are not worth walking (e.g. a mass-membership role full of EOAs). See subtlety 1 below.

#### Example: track role membership via events

```jsonc
"roleMembers": {
  "severity": "HIGH",
  "type": "PERMISSION",
  "description": "Per-role membership keyed by roleId, derived from RoleGranted/RoleRevoked events.",
  "handler": {
    "type": "event",
    "groupBy": "roleId",
    "select": "account",
    "add": {
      "event": "RoleGranted",
      "where": ["=", "#newMember", true]
    },
    "remove": {
      "event": "RoleRevoked"
    }
  }
}
```

This produces `{0: [adminAddr1, adminAddr2], 100: [...], ...}` on the next discovery run, derived live from on-chain logs. Note the absence of `ignoreRelative: true`: the contracts that hold ADMIN_ROLE are exactly what the trust analysis needs to walk. Read subtlety 1 below before adding it.

### Two relative-walking subtleties

1. **Address values get walked by default, and that is usually what you want.** Event handler `select` results that contain addresses are queued as BFS relatives. For high-stakes fields (admin role members, upgrade authorities, configurators) walking them is the entire point of milestone 3: the holders' internal ownership chain IS the trust analysis.

   Setting `ignoreRelative: true` defensively is dangerous: if a critical contract is reachable ONLY through the event handler, the address appears as an opaque value in `discovered.json`, the summary looks complete, and the trust analysis silently misses the contract's upgrade path and admin chain. The failure is invisible. Only set it when you have inspected the values and confirmed they are not worth walking — appropriate for a `MINTER_ROLE` full of EOAs, a `PUBLIC_ROLE`, a `KEEPER` allowlist; *not* appropriate for anything called "admin", "owner", or "guardian", or any role gating upgrades, fees, or pause. When in doubt, leave it off and cut noise at the boundary contract via `ignoreRelatives` on a template (milestone 1 style).

2. **`groupBy` keys are NOT walked.** Only `Object.values` of a grouped result is recursed by the engine. If you `groupBy: "target"`, the target addresses are *keys* and won't be discovered. Add a separate **flat helper field** with the same `select` and the leading `$` convention so the BFS picks them up. The full pattern (`$gatedTargets`) is in Milestone 1's "First, confirm topology completeness" — for any `AccessManager`-style authority you should already have it from cleanup.

### Distinct vs duplicate instances: research and disambiguate

Templates dedupe by shape, so once shape match has run you will often see N copies of the same template in the discovery. Two instances of the same shape are almost never interchangeable in practice: they are usually paired with different assets, markets, chains, or risk parameters. If there are N of something there is a reason, and the trust analysis is wrong until you know what it is. The dedup is a feature for *matching*, not a license to treat the instances as identical.

Three things must happen, in order, before milestone 3 is done:

1. **Read the per-instance state.** For each duplicated template, dump the fields that distinguish one instance from another. The discriminating field depends on the protocol: an asset list, a paired parent contract, a chain id, a market id, a validator set, an oracle source list. Whatever it is, look at it directly:

   ```bash
   jq -r '.entries[]
     | select(.template == "<project>/<TemplateName>")
     | "=== \(.address) ===\n\(.values.<discriminating_field>)"' \
     packages/config/src/projects/<project>/discovered.json
   ```

2. **Research what makes each instance unique.** For each duplicated template you must be able to answer in one sentence: *"what does this specific instance do that the others do not?"* Acceptable answers are concrete (a market it serves, an asset cluster it holds, a chain it bridges to, a version generation it belongs to). Unacceptable answers are evasive ("it's another one of those", "I don't know", "they look the same"). If you cannot answer, dig: read the contract source, resolve token symbols with `cast call <addr> "symbol()(string)"`, check deployment timestamps and `$pastUpgrades`, read the team's docs, trace which addresses interact with each instance. The point of the trust analysis is to surface structural facts about the protocol, and the existence of N parallel instances IS one of those facts.

3. **Apply `names` overrides in `config.jsonc`.** Once you know what each instance is, give it a meaningful name with the project-level `names` field:

   ```jsonc
   {
     "$schema": "../../../../discovery/schemas/config.v2.schema.json",
     "name": "<project>",
     "import": ["../globalConfig.jsonc"],
     "initialAddresses": ["eth:0x..."],
     "names": {
       "eth:0xaaaa...": "<MeaningfulName1>",
       "eth:0xbbbb...": "<MeaningfulName2>"
     }
   }
   ```

   Names are global to the project: every reference (an oracle source list, a role member, a paired parent contract) prints the name instead of the raw hex. When several contract types are correlated one-to-one (one adapter paired with one validator per chain, one strategy paired with one accountant per market), use a parallel naming convention so the pairing is visible at a glance.

The engine cannot tell whether N copies of a template are deliberate parallel deployments or one walked accidentally — only you can. Skipping this step produces a `discovered.json` that *looks* complete but is silently misleading: a watcher diff that says "parameter changed at 3 of 10 instances" is meaningless if no one knows which 3. **Treat any `× N` count in the templated set as a flag: stop, read the per-instance data, write a one-sentence rationale for each, then name them.**

### Other handlers worth knowing

In addition to `array`, `call`, and `event`:

- **`storage`** — read raw storage slots when state has no public getter. Slot can be a literal or a path of values for nested mappings.
- **`accessControl`** — built-in for OpenZeppelin's *legacy* `AccessControl` (bytes32 roles). For the V5 `AccessManager` (uint64 roles) use the generic `event` handler instead.
- **`eventCount`** — number of matching logs. Useful as freshness signal ("how many proposals", "how many upgrades").
- **`constructorArgs`** — decodes constructor args from the deployment tx. For immutable values that have no view getter.
- **`hardcoded`** — embed a literal value when nothing on-chain works.

## Useful commands

| Command | Use |
|---|---|
| `l2b discover <project>` | Run discovery (cold cache, slow) |
| `l2b discover <project> --dev` | Re-run on the saved block, fast iteration |
| `l2b discover <project> --analyze-timeout <ms>` | Hard timeout per-contract analyze. Aborts and marks the address as timed-out instead of letting a stuck RPC retry hang the whole run. |
| `l2b discover <project> -t` | Verbose templatization breakdown |
| `l2b discover <project> --dry-run` | Run twice (now and 24h ago), print diff |
| `l2b discover <project> --stats` | Print RPC call counts per provider |
| `l2b inspect <project> <addressOrName>` | Pretty-print a single entry: name, type, template, proxy info, all values, with addresses cross-referenced against the rest of the entries. Address-typed fields are tagged `[LEAKING]` / `[IGNORED via template]` / `[IGNORED via override]` / `[IGNORED via proxy]` so you can see which fields the BFS would walk without re-running discovery. |
| `l2b leaks <project>` | Rank the project's entries by leaking-target count and print the leaking fields for each. The fastest way to find boundary contracts during the milestone-1 cleanup loop. Use `--top N` for the top N entries (default 10), `--all` for the full list, `--address <addr>` to dump the full outgoing-field breakdown for a single entry, `--show-ignored` to also include fields already covered by `ignoreRelatives`. |
| `l2b why <project> <address>` | Trace why an address is in the discovery (every contract+field referencing it, marked LEAKING or IGNORED). |
| `l2b why --root <project> <address>` | Same, plus the shortest non-ignored path from any seed to the target. |
| `l2b add-shape <project> <addressOrName>` | Look up the contract in `discovered.json`, auto-resolve proxies, create the template (default `<project>/<contractName>`) if missing, and add the shape. Use `--template <path>` and `--name <fileName>` to add multiple impls to one template under different keys. Pass `--description "..."` and `--ignore-relatives "field1,field2,..."` to populate the template in one shot (insert-only; errors out if either field is already set so you never silently clobber existing edits). |
| `l2b init <project> <chain> <addr> [<addr> ...]` | Scaffold a new project's `config.jsonc` with `$schema`, `import`, `name`, and `initialAddresses`. Pass `--max-addresses N` to set the cap up front (recommended: 50). |
| `l2b init-template <name>` | Create an empty template (rarely needed; `add-shape` does this) |
| `l2b model-permissions <project>` | (Re)resolve the project's permissions through the Clingo modeller. Run after editing any `permissions: [...]`, `canActIndependently`, or related fields in templates / config.jsonc. |
| `l2b show-permissions <project>` | Print the resolved trust map: each actor with type, participant count, and the capability bullets (`act`-chain delays and `via:` paths included). Flags Contract actors that don't look like multisigs. `--short` skips the bullets. |

## File anatomy

```
packages/config/src/projects/<name>/
├── config.jsonc              human input
├── discovered.json           generated, committed
├── diffHistory.md            generated, committed (changelog)
├── .flat/                    generated, committed (flattened sources)
└── <name>.ts                 human (bridges discovery into the L2BEAT model)

packages/config/src/projects/_templates/<project>/<TemplateName>/
├── template.jsonc            human (the spec, including ignoreRelatives)
├── shapes.json               generated by add-shape (flattened-source hashes)
└── (criteria.json, model.lp if needed)
```

A template can have many entries in `shapes.json` (one per distinct flattened-source hash), all matching the same `template.jsonc`.

### Minimal `config.jsonc`

```jsonc
{
  "$schema": "../../../../discovery/schemas/config.v2.schema.json",
  "name": "<name>",
  "import": ["../globalConfig.jsonc"],
  "initialAddresses": ["eth:0x..."]
}
```

### Minimal `template.jsonc`

```jsonc
{
  "$schema": "../../../../../../discovery/schemas/contract.v2.schema.json",
  "displayName": "MyContract",
  "description": "What it does, in one line.",
  "ignoreRelatives": ["fieldThatLeaksNoise"]
}
```

## Common errors and what they mean

| Error | What to do |
|---|---|
| `Too many values. Update configuration to explore fully` | See the milestone 2 decision tree (`ignoreMethods` for runtime state, `array` handler for config). |
| `Too many values. The last result is the zero value...` (mapping read hint) | Your `maxLength`-based handler hit a mapping read that returns zero on missing keys. Set `length` explicitly via a `{{ field }}` reference; raising `maxLength` won't help. |
| `Execution reverted` on `proxiableUUID` etc. | UUPS view method that reverts outside delegatecall. Add to `ignoreMethods` — almost always safe. |
| `Max calls per sec rate limit reached (3/sec)` | Hit Etherscan free-tier limit. Set `ETHERSCAN_API_KEY` in `.env`, or wait. |
| `Chain [ethereum] has not been configured` | CLI couldn't find a `.env` from your cwd. Run from inside the repo (CLI walks up to find `packages/config/.env`), or set `ETHEREUM_RPC_URL_FOR_DISCOVERY` directly. |
| Run hangs forever on a single contract | RPC stuck retrying a buggy contract. Re-run with `--analyze-timeout 60000` to bound it. |
| `Template '<x>' already covers this implementation under shape entry '<y>'` | Nothing to do; the contract is already covered. |

## Recurring principles

A few rules apply across many projects. Internalize these and most boundary decisions become mechanical.

- **Foreign code stays a black box.** Anything your team didn't deploy and doesn't control gets `ignoreDiscovery: true` in your `config.jsonc`, no matter how trust-critical the dependency. The seam stays visible in source `values`; the foreign contract's internals belong in the foreign project's own discovery. When a single field returns many foreign addresses, `ignoreRelatives` on the field is the compact shortcut. A whole foreign protocol suddenly showing up usually means one such field on one of your contracts — one cut at the right place collapses the entire downstream graph.

- **Unnamed EOAs are usually multisig signers.** Tons of EOAs in your discovery normally means a multisig's `$members`. Leave them; they're discoveries, not noise.

- **Standard interface helpers are usually not state.** When a contract implements a standard interface (a token standard, a vault standard, a generic access-control library), the view methods defined by the standard that take a key or index argument are typically pure math, per-element lookups, or historical reads. Add them to `ignoreMethods` rather than trying to enumerate them. The 5-item probe trips on them every time.

- **Don't template what's auto-detected.** The engine has built-in detectors for common proxy types (EIP-1967, EIP-2535 Diamond, Gnosis Safe, transparent proxies, etc.). These produce proxy values like `$implementation`, `$admin`, `$members`, `$threshold` automatically and dispatch the implementation through shape match. You don't need to template the proxy wrapper itself — only the implementation behind it.

- **Mapping-backed state is read via events, not RPC.** A mapping has no length and no enumerable key list (one value per `keccak256(key, slot)`). If the contract emits an event when it writes to the mapping, replay the event log with the `event` handler. If you `groupBy` an address-typed field that you want walked (e.g. you bucket gated targets by `target` address), add a parallel flat helper field with the same `select` so the BFS picks the addresses up — `groupBy` keys are not walked (subtlety 2 in milestone 3).

## When you're done

Commit everything in `packages/config/src/projects/<name>/` and `packages/config/src/projects/_templates/<name>/`. Future runs will diff against the committed `discovered.json`, and the L2BEAT monitoring pipeline will alert on any change.
