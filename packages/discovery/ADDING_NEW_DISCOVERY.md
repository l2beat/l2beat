# Adding a project to L2BEAT discovery

A no-fluff guide. Read this once before you start; it will save you several iterations.

## Mental model in 30 seconds

You write a `config.jsonc` (the question). The discovery engine BFS-walks the contract graph from a few seed addresses, reading every state value, following every address-typed reference, and writes a `discovered.json` (the answer). Both files live in `packages/config/src/projects/<name>/`.

Your job after the first run is to *cut noise*: stop the engine from walking into things that aren't part of your project. You do this by adding `ignoreRelatives` on specific fields, almost always inside reusable **templates** that match contracts by their flattened-source bytecode.

`discovered.json` is committed, so future runs can diff against it. That's how the L2BEAT monitoring/watcher pipeline detects upgrades.

## Recipe: zero to clean discovery

`l2b` auto-loads `packages/config/.env` from any directory inside the repo, so the commands below work from anywhere (you no longer need to `cd packages/config` first).

1. **Scaffold the project** with `l2b init`:

   ```bash
   l2b init <name> <chain> 0x...your seed contract... --max-addresses 50
   ```

   This creates `packages/config/src/projects/<name>/config.jsonc` with the right `$schema`, `import`, `name`, `maxAddresses`, and `initialAddresses`. Pass multiple seed addresses as additional positional arguments if you need them; 1 to 3 is usually enough since the BFS finds the rest. The `<chain>` argument is the long chain name (`ethereum`, `arbitrum`, `optimism`, ...); init translates it into the chain prefix on the addresses.

   - **Always pass `--max-addresses 50`** (or a similar low number, 30 to 100). The cap is a fail-fast guardrail: if your seed contract leaks into a foreign DeFi cluster, you want the run to stop fast and tell you "something exploded", not to chew through 1500 contracts before producing output. Treat the cap as a tripwire, not a budget. You'll raise it later (after cleanup) to a comfortable margin above your final entry count. Without `--max-addresses`, the engine default of 500 applies and the first cleanup loop is much slower.

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

4. **Before milestone 1, run the completeness sniff test (gotcha 4).** If your project is known to deploy multiple instances of the same contract type (several pools, vaults, markets, hubs, ...) but your first-run discovery only shows one, your seed is undersampling. Surface the missing instances via the project's central registry — factory, role-based authority, addresses provider — *before* doing any cleanup. Cleanup done against an undersampled topology has to be redone once the missing instances surface and drag in their own foreign clusters.

5. **Walk through the three milestones below in order:**
   - **Milestone 1**: cut noise (foreign protocol contracts pulled in via oracles, registries, etc.)
   - **Milestone 2**: fix `Too many values` errors and enumerate config behind mappings
   - **Milestone 3**: turn the discovery into a trust map (descriptions, severity, role/membership tracking via events, and naming + understanding every duplicated instance)

6. **When clean**, raise `maxAddresses` to a comfortable margin above the final entry count (e.g. final = 92, set to 150) so future runs hit the cap warning if a refactor accidentally pulls in noise. Don't bump it before milestone 1 is done; the low cap is what makes the cleanup loop fast.

## The gotchas that will bite you

### 1. `ignoreRelatives` lives on the SOURCE contract, not the destination

You can't say "skip USDC". You have to say "for the contract `TokenRegistry`, don't follow the field `getAllTokens` (which contains USDC)". Often the same noise address is reachable from many sources; you have to cut every path.

Use `l2b why <name> <address>` to list every contract+field that references an address, marked LEAKING vs IGNORED.

### 1a. `ignoreRelatives` is field-level, not element-level

A single field can return a *tuple* or *array* that mixes project-internal addresses and foreign addresses (e.g. `getItem(itemId)` returns `(underlyingToken, parentRegistry, ...)` — the underlying is foreign, the parent registry is project-internal). `ignoreRelatives` cuts the whole field. You can't keep walking some elements and skip others.

Before cutting a field, check whether any relative it emits is project-internal. If so:

- **Preferred**: reach the project-internal address through a *different* field on a *different* contract. Use `l2b why <name> <project-internal-address>` to confirm there's another LEAKING entry to it. If yes, the cut is safe.
- **Fallback**: if the only path to the project-internal address is through this field, add the project-internal address as an additional `initialAddresses` entry in `config.jsonc`. The BFS will seed it directly and not rely on the cut field.

Cutting a field that's the only path to a project-internal contract silently removes that contract (and everything reachable through it) from the discovery, with no warning. The summary will look fine. This is the most common way to lose half a project's templates in one edit.

### 1b. Cut at the leaf, not at the source, when the source mixes project + foreign relatives

Same setup as 1a, but a different fix: instead of cutting the source field, **template the foreign destination contract and cut the leaks there**.

For example, an oracle's `getSources` returns N price feeds — some are project-internal cap adapters, some are external Chainlink feeds. Cutting `getSources` on the oracle loses the cap adapters. The better move is to write a template for the foreign Chainlink feed contract that cuts everything dangerous (`aggregator`, `owner`, `accessController`, `proposedAggregator`). Then leave `getSources` walked: the cap adapters are discovered, the Chainlink feeds are walked one hop and stopped at the leaf.

Rule of thumb: **cut where the foreign cluster begins, not where it's referenced**. If a field returns N addresses and only some are foreign, prefer templating the foreign contract types with their own `ignoreRelatives` rather than cutting the field that references them. The latter loses the project addresses too.

**Exception**: if the foreign relatives are not contracts whose source you would read while doing a trust analysis of *this* project (deposit assets, generic ERC20s the project just holds in a balance — see gotcha 5), invert this rule. Cut the field on the source and route the project-internal relatives via `initialAddresses` or another field. Templating dozens of unrelated assets as leaves bloats `discovered.json` without adding any trust signal, even if the leaves are technically "cut."

### 2. `ignoreRelatives` does NOT remove the field value from output

The field's value still appears in the entry's `values` in `discovered.json`. It just isn't followed by the BFS. Don't be confused when USDC still shows up inside some `getAllTokens` array; what matters is whether USDC itself is in `entries`.

### 2b. Multiple field names can return the same address; cut all of them

A common Solidity pattern is to expose the same stored address through both a camelCase getter and a SCREAMING_CASE immutable/constant (e.g. `foo()` and `FOO`), or to keep an old name as an alias when a contract is renamed. `ignoreRelatives` filters by *field name*, so cutting one of them is not enough — the other getter still emits the same address as a relative. After adding cuts, check the entry's `values` in `discovered.json` for any address that appears in two fields with different names; if so, add both names to `ignoreRelatives`.

### 3. `maxAddresses` is a strict cap, and that is a feature

Default is 500. If discovery hits it, the run still completes but the cap-skipped addresses are reported in `WARNING: N addresses skipped due to maxAddresses cap`. Counterintuitively, the right reaction during the cleanup loop is usually to *lower* the cap, not raise it: keep the cap below the explosion threshold so each iteration is fast, fix the cuts, and only raise it once cap warnings stop appearing. The cap is strict (no parallel overshoot), so the entry count will never exceed the value you set.

Concretely: if you bumped the cap to 2000 to "see the real picture" and each run now takes minutes downloading sources you're about to throw away, you're doing it wrong. Drop the cap back to ~50, use the BFS log (next section) to identify the boundary contract, cut at the boundary, re-run, repeat. Each iteration becomes seconds.

### 4. Multi-instance projects: enumerate the registry before milestone 1

If your project deploys several instances of the same contract type (multiple pools, vaults, markets, hubs, ...) and the seed you scaffolded with only references one of them, the BFS will only discover that one instance. Milestone 1 will then run against a fundamentally incomplete topology and any cleanup you do may have to be redone once the missing instances surface and bring their own foreign clusters with them.

**Run the completeness sniff test before entering milestone 1:** read the first-run discovery and ask "is this the full protocol, or just the slice my seed reaches?". If the project is known to deploy N of something but you only see one, the seed is undersampling. Find the registry that lists all instances and enumerate it:

- A factory or registry contract with a `getAllPools` / `getAllVaults` / `instances()` getter: enumerate via an `array` handler with explicit `length` (see milestone 2 for the pattern). The new instances are then walked by the BFS and matched by shape.
- An OZ V5 `AccessManager` (or any role-based authority where every gated contract is registered as a *target*): enumerate via an `event` handler. Such authorities typically emit one log per gated target — for OZ V5 the event is `TargetFunctionRoleUpdated(address indexed target, bytes4 selector, uint64 indexed roleId)`. Add a flat helper field to the authority's template:

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

- A governance executor or proxy admin that owns every instance via its proxy: walk the upgrade authority's history (event handler on `Upgraded` / `OwnershipTransferred`).

If no on-chain registry exists and the address book is purely off-chain (deployment scripts, the team's documentation), add the missing instance addresses directly to `initialAddresses` in `config.jsonc`.

**Treat under-sampling as a higher-priority bug than any leak.** A leaky discovery wastes time. An undersampled discovery is silently *wrong*: the trust map omits whole sub-systems and the watcher will never alert on changes to them. The diagnostic is simple: if you see ONE entry of a contract type that you know the protocol deploys multiple of, fix it before doing anything else.

### 5. Templates are for contracts whose source you would read

Not every foreign contract reachable from your project belongs in `discovered.json`. Before deciding how to handle one, ask: **would I open this contract's source while doing a trust analysis of *this* project?**

- **Yes** — an oracle the project consults for prices, a governance contract that controls upgrades, a parent-protocol registry the project depends on for state, a bridge endpoint that gates funds: template it as a leaf with admin-chain cuts. The contract appears in the discovery as one node so a reviewer can see what the project trusts. This is the "foreign trust roots are leaves" case from the recurring principles.

- **No** — a deposit or collateral asset the project just holds in a balance, a generic ERC20 whose `transfer()` is the only function the project ever calls, a yield-bearing token whose redemption ratio the project reads but whose admin chain is not part of *your* project's trust assumption: cut the field on the source contract that returns it. The asset's address still appears in the source's `values` block (because `ignoreRelatives` doesn't drop the value, see gotcha 2), so a reviewer can still see what's listed, but the BFS never walks into it and you never need a template for it. A reviewer auditing your project never opens that contract's source, so it does not belong in your discovery.

The **asset list cut** pattern goes in the template of the contract that holds the registry:

```jsonc
{
  "ignoreRelatives": ["getReserveList", "getSupportedAssets", "underlyingAssets"]
}
```

Before applying it, run the gotcha 1a check: does the field also return project-internal addresses (a paired strategy contract, an interest rate model, a treasury)? If yes, route those internals via a different field on the same contract, a different contract, or `initialAddresses`. If no — the field is purely a list of foreign deposit assets — the cut is safe.

**Bias toward a smaller `discovered.json`.** A complete discovery contains every contract a reviewer needs to read. One that contains many contracts whose source no reviewer will ever open is worse, not better: it inflates the watcher diff surface and forces template work that adds no trust signal. Templating is documentation effort; do not invest it in contracts that are not part of *your* project's surface area.

### Templates vs `config.jsonc` overrides

Templates match contracts by **implementation bytecode hash** (proxies are auto-resolved by `add-shape`) and apply across every project that imports the same source code, so they're how knowledge accumulates. Overrides are per-project, per-address deviations with precedence over templates.

- **Use a template** when the fact is true wherever the bytecode appears (this field is runtime state, this field leaks into a foreign cluster, this is what the contract does).
- **Use a `config.jsonc` override** when *this specific deployment in this specific project* needs different treatment (different `category`, a project-specific `description` clarification, an extra `ignoreInWatchMode` entry).

Default to templates. At the end of a clean cleanup loop, `config.jsonc` should be back to roughly what you started with (name, imports, `initialAddresses`, `maxAddresses`, plus possibly a `names` block from milestone 3) — pruning logic should have migrated into templates.

### Protocol-on-protocol: when your project reuses another project's contracts

You're discovering project B, but B reuses contracts originally deployed for project A. Walking them naively pulls in A's entire stack. The fix: keep the *immediate* shared contracts visible (so the trust analysis can show "B is governed by A") but cut the chain that leads deeper into A.

- **Template the shared contracts under `_templates/<parent-project>/...`** even if only B's discovery exists today. The boundary cuts become reusable when A's discovery is added later.
- **Cut at A's central registry, not at B's reference to A.** Most A-side contracts have a field like `getRegistry()` / `ADDRESSES_PROVIDER` / `getController()` that points to A's hub — cut that single field on the shared template. Don't cut the field on B's side that brings the shared contract into B's discovery; that walk is exactly how B's trust on A becomes visible.

The mental model: B's discovery shows the *seam* where B trusts A; A's internals belong in A's discovery.

## Milestone 1: cleanup loop (cut noise)

After your first run, look at `discovered.json` and ask "what's in here that isn't part of my project?". The fastest way to find the cuts you need is `l2b leaks`:

1. **Run** `l2b leaks <name> --top 10`. The top entries are your *boundary contracts*: the ones whose outgoing fields walk into foreign clusters. Each target is marked with its template assignment, so templated leaves (already cut downstream) are visible at a glance versus untemplated explosions waiting to happen.

2. **For each foreign destination contract** that needs to become a leaf (a foreign token, a foreign oracle, an unrelated registry), run `l2b leaks <name> --address <addr>` to dump that entry's full outgoing-field breakdown. Copy the field names you want to cut.

   Common culprit shapes: a generic registry getter (`*.getAll...`, `*.list...`), a per-item getter that returns the underlying token (`*.UNDERLYING`, `*.token`, `*.asset`), an oracle source list (`*.getSource`, `*.feed`), or a proxy admin slot (`$admin`).

3. **Template the foreign contract in one command:**

   ```bash
   l2b add-shape <project> <addressOrName> \
     --template <parent-project>/<ContractName> \
     --description "What this contract is. One sentence." \
     --ignore-relatives "field1,field2,$admin"
   ```

   `add-shape` auto-resolves proxies, creates the template if missing, and writes the shape + description + `ignoreRelatives` in one shot (insert-only — if either field exists, edit by hand). For protocol-on-protocol cases, set `<parent-project>` to the parent's name even if no discovery exists for it yet (see "Protocol-on-protocol" above).

4. **Re-run** `l2b discover <name> --dev` and `l2b leaks` to verify the explosion fronts have collapsed. Each round usually removes a whole downstream subtree.

### One subtlety: the proxy `$admin` slot

Proxy detection records the proxy admin address as a top-level `$admin` value on the entry. Unlike `$implementation` and `$pastUpgrades` (which are auto-filtered as ignored addresses), `$admin` is walked by the BFS as a normal relative. If you don't want the proxy admin chain followed from a foreign template, add `$admin` to that template's `ignoreRelatives` alongside the contract methods. `l2b inspect` and `l2b leaks` both surface `$admin` with a `[LEAKING]` marker so this is easy to spot.

### Batching cuts: read leaks once, edit many

Don't iterate cut-by-cut. The topology you need is already in `discovered.json`, and `l2b leaks` reads it directly without re-running discovery. The fast loop is:

1. `l2b leaks <name> --top 20` to get the global picture.
2. For each high-rank entry that's a foreign destination, `l2b leaks <name> --address <addr>` to read the field names.
3. Run all the `l2b add-shape ... --description ... --ignore-relatives ...` commands in one batch.
4. `l2b discover <name> --dev` once.
5. `l2b leaks <name> --top 20` again to see what survived.

If the same template needs to cover multiple contract addresses with the same bytecode, `add-shape` reports "no new shape needed" on the second call (not an error). For multiple distinct implementations of the same logical contract, call `add-shape` again with a different address plus `--name` to distinguish the shape entries.

### When `l2b leaks` isn't enough: trace one address with `l2b why`

Use `l2b why <name> <address>` when the leaks output names a target you don't recognize and you want to know *which fields on which contracts* reference it. `why` lists every reference, marked LEAKING or IGNORED, and with `--root` it prints the shortest non-ignored path from any seed to the target — useful for finding the single boundary contract that pulls in a foreign cluster you didn't expect.

## Milestone 2: fix errors, fetch hidden config

When the noise is gone you'll see an `Errors during discovery: N` block with `Too many values. Update configuration to explore fully` on a bunch of fields. These come from the engine's default 5-item probe for any `function getX(uint256) view returns (...)`: if all 5 calls succeed it gives up. Two fixes per field:

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

This is normal. After re-running discovery, run `l2b leaks <name> --top 20` again and treat the new top entries as a fresh milestone-1 pass: template the new foreign destinations, batch the cuts, re-discover. Don't bump `maxAddresses` to "see the real picture"; keep the cap low and let it tell you when you're done.

## Milestone 3: trust analysis (descriptions, fields, events)

After milestones 1 and 2 the discovery is structurally clean and complete. Milestone 3 turns it into a **trust map**: a future reader of `discovered.json` should be able to answer "who can move my funds?" without ever opening the contract source.

### Per-template annotations

For each template, edit `template.jsonc` and add:

1. **`category`**: `"core"` (protocol-critical), `"gov"` (admin/access-control), or `"shared"` (libraries, helpers).
2. **`description`** capturing what the contract does AND the trust assumption: *"if you trust this contract, you trust X to do Y"*. Mention the upgrade path explicitly for proxies.
3. **`fields.<name>.description`** for every important value or relative.
4. **`fields.<name>.severity: "HIGH"`** on any field whose change is a meaningful risk event (oracle source, role admin, fee receiver, liquidation parameters, anything controlling upgrades or pauses). Use `"LOW"` for cosmetic / metadata fields.
5. **`fields.<name>.type`** to classify it: `"PERMISSION"` (grants rights), `"RISK_PARAMETER"` (tunable risk knob), `"CODE_CHANGE"` (upgrade pointer), `"L2"` / `"EXTERNAL"`.

These show up in the L2BEAT UI and feed the watcher's diff filtering.

**Never reference internal tooling in descriptions.** Template descriptions and field descriptions are user-facing content. Don't write "Static analysis confirmed 9 admin functions carry the restricted modifier" or "the discovery surfaces 3 Hubs." State facts about the contracts directly: "All admin functions carry the restricted modifier" or "There are 3 Hubs." The reader doesn't need to know what tools you used to verify the facts.

### Defining permissions on address-typed fields

The `permissions` array on address-typed fields declares "address X can do Y" in a machine-readable way. Without it, the trust map captures what contracts exist and what state they hold, but not what each privileged address is empowered to do.

#### End actors vs intermediary contracts

The permissions system should surface **end actors**: EOAs, multisigs, DAOs/governors, and other entities that are the actual trusted parties. Intermediary contracts (access managers, configurators, timelocks, executors, proxy admins) should NOT appear as actors. They are the plumbing through which trust flows, not the source of trust.

To achieve this:

- **Intermediary contracts** (anything that delegates authority but isn't the final trust root) get `"canActIndependently": false` at the template level. This tells the system not to show them as actors. Examples: AccessManager, ProxyAdmin, HubConfigurator, SpokeConfigurator, timelocks.
- **End actor fields** (the addresses that ARE the trusted parties) get `"permissions": [{ "type": "act" }]` or `"permissions": [{ "type": "interact", "description": "..." }]`. Examples: multisig owners, role members extracted via `copy`/`edit`, guardian addresses.

The system then auto-resolves the "via" chain: if a multisig is the owner of a ProxyAdmin (`type: "act"`) which is the admin of a proxy, the rendered output shows "Multisig can upgrade Contract via ProxyAdmin".

#### Role-based access control: extract the actual holders

For contracts that manage roles (OpenZeppelin AccessControl, AccessManager, custom role registries), don't put `permissions` on the `authority` reference on the target contract (that would make the access control contract itself show as an actor). Instead:

1. On the access control contract's template, add `"canActIndependently": false`.
2. Extract specific role members into named fields using `copy`/`edit` (for event-handler-produced grouped data) or `pickRoleMembers` (for the built-in `accessControl` handler).
3. Put `permissions` on those extracted fields with `"type": "interact"` and a description of what that role can do.

Example for an OZ V5 AccessManager — use the `accessManagerV5` handler. It automatically decodes function selectors into human-readable signatures and labels roles by name instead of numeric ID:

```jsonc
{
  "canActIndependently": false,
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
  "canActIndependently": false,
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

#### Simple owner/guardian patterns

For contracts with a single `owner` or `guardian` (not role-based), put `permissions` directly on the owner field. The owner IS the end actor.

```jsonc
{
  "fields": {
    "owner": {
      "severity": "HIGH",
      "type": "PERMISSION",
      "permissions": [{ "type": "interact", "description": "transfer any ERC20 out of the contract, withdraw from any Hub, and transfer ownership. No timelock." }]
    }
  }
}
```

Each permission entry has:
- **`type`**: `"interact"` (can call privileged functions), `"upgrade"` (can upgrade the implementation), `"act"` (can act through this contract as a proxy/intermediary), or `"guard"` (guardian role, can cancel/pause).
- **`description`**: a plain-language sentence describing ONE specific operation. Not a comma-separated list of everything.

**Use one permission entry per operation, not one entry for all operations.** The rendered output shows each entry as a separate bullet point under "Can interact with <ContractName>". Compare:

Bad (one blob):
```jsonc
"permissions": [{
  "type": "interact",
  "description": "reconfigure the entire permission system, change all parameters, upgrade contracts, and do everything else."
}]
```

Good (one per operation):
```jsonc
"permissions": [
  { "type": "interact", "description": "swap oracle price sources on any Spoke." },
  { "type": "interact", "description": "activate/deactivate position managers that can act on behalf of all users." },
  { "type": "interact", "description": "pause/freeze individual reserves or entire markets." },
  { "type": "interact", "description": "list/delist assets on any Hub." },
  { "type": "interact", "description": "swap interest rate strategies." },
  { "type": "interact", "description": "redirect protocol fee receivers." },
  { "type": "interact", "description": "grant/revoke any AccessManager role." }
]
```

The rendered output for the good version shows each operation as a separate bullet point, making it trivial for a reviewer to scan what each actor can do. The bad version forces the reviewer to parse a run-on sentence.

#### Verifying the permissions output

After setting up permissions, always verify the output before committing. Check two things:

1. **Only end actors appear.** Run `getDiscoveredPermissions()` and confirm that every actor is an EOA, multisig, or DAO/governor. If you see an intermediary contract (an AccessManager, a ProxyAdmin, a Configurator, a Timelock) showing as an actor, it's missing `canActIndependently: false` on its template.

2. **Every trust path is represented.** If the protocol has N separate access control systems (e.g., an OZ V5 AccessManager AND a legacy ACLManager), every system's role holders must show as actors. If a trust path is described in the project description but doesn't appear in the permissions output, you're missing a role extraction field.

```bash
# Quick check: list actors and their types
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

If any actor shows type `Contract` and it's an intermediary (not a multisig or DAO), investigate.

**Don't skip this step.** A project with `severity: "HIGH"` and `type: "PERMISSION"` on every trust-critical field but no properly configured `permissions` and `canActIndependently` annotations captures the contract topology but not the trust relationships. The permissions system turns raw address references into "who do I trust" statements. Getting this wrong means the rendered project page either shows an empty permissions section (missing permissions arrays) or shows intermediary contracts as actors (missing `canActIndependently: false`), both of which mislead the reader.

### Fetching state behind events with the `event` handler

Many contracts only expose state through events (e.g. OpenZeppelin's V5 `AccessManager` uses `RoleGranted` / `RoleRevoked` instead of an enumerable mapping). The `event` handler reads logs and reconstructs state from them.

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

2. **`groupBy` keys are NOT walked.** Only `Object.values` of a grouped result is recursed by the engine. If you `groupBy: "target"`, the target addresses are *keys* and won't be discovered. Add a separate **flat helper field** with the same `select` and the leading `$` convention so the BFS picks them up. The full pattern (`$gatedTargets`) is in gotcha 4 — for any `AccessManager`-style authority you should already have it from milestone 1.

### Distinct vs duplicate instances: research and disambiguate

Templates dedupe by implementation bytecode, so once shape match has run you will often see N copies of the same template in the discovery. Two instances of the same bytecode are almost never interchangeable in practice: they are usually paired with different assets, markets, chains, or risk parameters. If there are N of something there is a reason, and the trust analysis is wrong until you know what it is. The dedup is a feature for *matching*, not a license to treat the instances as identical.

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
├── shapes.json               generated by add-shape (impl bytecode hashes)
└── (criteria.json, model.lp if needed)
```

A template can have many entries in `shapes.json` (one per distinct implementation bytecode), all matching the same `template.jsonc`.

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

- **Foreign trust roots are leaves.** When a contract is the trust root for an external system (a price feed proxy, a parent project's admin contract, a bridge endpoint), keep it visible as a single node and cut its outgoing fields that walk deeper. The trust analysis question is "what does my project trust?", not "what does the external system look like internally?". The internals belong in the external system's own discovery.

- **Foreign assets the project doesn't depend on are not walked at all.** A deposit or collateral asset the project just holds in a balance is not a trust root in any meaningful sense — the project's correctness does not depend on the asset's behavior beyond "it is an ERC20", and a reviewer would never open the asset's source. Cut the field on the source contract that returns the asset list (gotcha 5); do not template each asset as a leaf. The asset address still appears in the source's `values` so reviewers can see what's listed.

- **Unnamed EOAs are usually multisig signers.** Tons of EOAs in your discovery normally means a multisig's `$members`. Leave them; they're discoveries, not noise.

- **A whole foreign protocol showing up** means a single field is leaking an oracle source, an underlying token, or a rewards controller. Usually one `ignoreRelatives` near your project's edge collapses the entire downstream graph.

- **Standard interface helpers are usually not state.** When a contract implements a standard interface (a token standard, a vault standard, a generic access-control library), the view methods defined by the standard that take a key or index argument are typically pure math, per-element lookups, or historical reads. Add them to `ignoreMethods` rather than trying to enumerate them. The 5-item probe trips on them every time.

- **Don't template what's auto-detected.** The engine has built-in detectors for common proxy types (EIP-1967, EIP-2535 Diamond, Gnosis Safe, transparent proxies, etc.). These produce proxy values like `$implementation`, `$admin`, `$members`, `$threshold` automatically and dispatch the implementation through shape match. You don't need to template the proxy wrapper itself — only the implementation behind it.

- **State that's only in events needs an event handler with a flat helper.** If a contract's role/membership/registration state is emitted via events but has no enumerable getter, use the `event` handler. If you `groupBy` an address-typed field that you want walked (e.g. you bucket gated targets by `target` address), add a parallel flat helper field with the same `select` so the BFS picks the addresses up — `groupBy` keys are not walked (subtlety 2 in milestone 3).

## When you're done

Commit everything in `packages/config/src/projects/<name>/` and `packages/config/src/projects/_templates/<name>/`. Future runs will diff against the committed `discovered.json`, and the L2BEAT monitoring pipeline will alert on any change.
