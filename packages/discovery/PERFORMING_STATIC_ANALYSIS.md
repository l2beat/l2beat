# Performing static analysis on a discovered project

Step 3 in the project analysis pipeline. Read this AFTER completing the discovery milestones ([ADDING_NEW_DISCOVERY.md](./ADDING_NEW_DISCOVERY.md)) and the frontend project file ([ADDING_NEW_FRONTEND_PROJECT.md](./ADDING_NEW_FRONTEND_PROJECT.md)).

## What this guide solves

You have a clean discovery with every contract templated and named, and a rendered project page with discovery-driven contracts and permissions. Now you want to go deeper: verify the trust assumptions the discovery surfaced, find privileged operations the discovery might have missed, and produce a static analysis report that a reviewer can use to answer "who do I trust with my funds?"

Static analysis answers a different question from discovery. Discovery tells you the runtime state: which contracts exist, which roles are currently assigned, which addresses hold them. Static analysis tells you the implementation facts: which functions can write which state variables, what access control modifiers gate them, and what the code actually does regardless of the current runtime configuration.

## Tools and what each is good at

Four tools, used in order from broad to deep:

| Tool | Strength | Weakness |
|---|---|---|
| **Slither** | Broadest built-in analysis. `--print modifiers` gives the access control map. `--print vars-and-auth` shows state writes + msg.sender conditions. Trust-relevant detectors (`arbitrary-send-erc20`, `arbitrary-send-eth`, etc.) find fund-flow paths. | Analyzes one contract at a time. Can only report top-level variable names (not struct field assignments). Cannot resolve runtime access control (OZ V5 AccessManager roles, external authority checks). |
| **Wake** | `state-changes` printer traces exact struct-field assignments through function calls. Shows cross-contract call boundaries. | Detectors are noisy (hundreds of reentrancy false positives on any project using external calls). `modifiers` printer crashes without a terminal. |
| **Aderyn** | `centralization-risk` detector explicitly labels `onlyOwner`/`onlyRole`/`restricted` functions as centralization risks. Fast (Rust-based). | Heavy overlap with Slither's detectors otherwise. Many false positives from flattened source duplication ("Contract Name Reused"). |
| **Semgrep** | Pattern-matching across ALL contract instances in one pass. Custom YAML rules let you encode project-agnostic trust patterns. Confirms cross-instance consistency ("all 10 Spokes have the same access control"). | No semantic understanding: matches syntax, not behavior. Off-the-shelf Decurity rules are too narrow (match specific function names from past exploits). You need to write custom rules. |

## Prerequisites

### Solc version

Most DeFi contracts pin a specific Solidity version (`pragma solidity 0.8.28;`). Your system `solc` must match. Use `solc-select` to install and switch versions:

```bash
solc-select install 0.8.28
solc-select use 0.8.28
solc --version  # verify
```

If `solc --version` still shows the wrong version, another `solc` binary earlier in PATH is taking priority. Create a temp override:

```bash
mkdir -p /tmp/solc-bin
cp ~/.solc-select/artifacts/solc-0.8.28/solc-0.8.28 /tmp/solc-bin/solc
chmod +x /tmp/solc-bin/solc
export PATH="/tmp/solc-bin:$PATH"
```

### Contract sources

The discovery stores Etherscan-verified source code in two forms:

- `.flat/<ContractName>/` — flattened single-file sources (may have interface ordering issues that prevent compilation)
- `.code/<ContractName>/` — original multi-file sources from Etherscan (compilable but imports use `src/` prefixes)

For Slither: use the Etherscan address directly (`slither 0x... --etherscan-apikey <key>`). Slither downloads and compiles the source itself.

For Wake and Aderyn: use the `.code/` sources. Create a workspace with `src/` import resolution:

```bash
TARGET=/tmp/analysis-work/<ContractName>
mkdir -p "$TARGET/src"
# For proxy contracts, use the implementation subdirectory
cp -r .code/<ContractName>/implementation/* "$TARGET/src/"
# For immutable contracts
cp -r .code/<ContractName>/* "$TARGET/src/"
```

## Step 1: Slither (the broad map)

Run three passes per core contract. Use the implementation address for proxied contracts, not the proxy address.

### 1a. Modifier map

```bash
slither <impl-address> --etherscan-apikey <key> --print modifiers
```

Filter the output for the main contract (skip utility libraries, OZ internals):

```bash
slither <addr> ... --print modifiers 2>&1 | grep -A 100 "Contract <ContractName>"
```

What to look for:
- Functions with `restricted` (OZ V5 AccessManager gating), `onlyOwner`, `onlyRole`, or any custom access control modifier. These are the privileged surface.
- Functions with `nonReentrant` only (no access control). These are permissionless state-changing functions. Most are by design (liquidation, price refresh), but any unexpected entry here is a finding.
- Functions with NO modifier at all that write state. These need investigation: is the access control inline (`require(msg.sender == ...)`) or truly missing?

### 1b. State writes + auth conditions

```bash
slither <impl-address> --etherscan-apikey <key> --print vars-and-auth
```

Filter for state-changing functions only (exclude rows where both columns are `[]`):

```bash
slither <addr> ... --print vars-and-auth 2>&1 | grep -A 200 "Contract <Name>" | grep -E "^\| " | grep -v "\[\].*\[\]"
```

What to look for:
- Functions that write critical state (`_reserves`, `_authority`, `_oracle`, `_feeReceiver`, `_owner`) combined with the modifier from step 1a. This is the "who can change what" matrix.
- The `AccessManagedStorageLocation` pattern: if a function writes this, it's gated by the OZ V5 AccessManager `restricted` modifier. Slither shows the msg.sender condition as empty because the role check happens in the external AccessManager contract at runtime, not inline. This is NOT a missing access control; it's a limitation of static analysis.

### 1c. Trust-relevant detectors

```bash
slither <impl-address> --etherscan-apikey <key> \
  --detect arbitrary-send-erc20,arbitrary-send-eth,suicidal,tx-origin,missing-zero-check,unprotected-upgrade,controlled-delegatecall,events-access
```

What each detector finds:

| Detector | What it catches | Common false positives |
|---|---|---|
| `arbitrary-send-erc20` | `transferFrom` with a non-msg.sender `from`. Finds fund-flow paths where tokens can be moved on behalf of others. | Liquidation flows where the liquidator's address is passed as `from` (by design, the liquidator spends their own approved tokens). |
| `arbitrary-send-eth` | Functions that send ETH to a caller-controlled address. | Withdrawal functions where the recipient is the user themselves. |
| `suicidal` | Unprotected `selfdestruct`. The ultimate access control failure. | Extremely rare in modern contracts. |
| `tx-origin` | `tx.origin` used for authentication. Spoofable in delegatecall contexts. | Legitimate uses for anti-phishing checks (rare). |
| `missing-zero-check` | `address(0)` assignments to admin/role/owner variables. | Assignments that are validated by the calling function before reaching the internal setter. |
| `unprotected-upgrade` | Upgrade functions without access control on the implementation contract. | Proxy patterns where the access control is on the proxy, not the implementation. |
| `controlled-delegatecall` | Delegatecall to a caller-controlled target. | Governance executors that deliberately allow arbitrary delegatecall (by design, gated by onlyOwner). |
| `events-access` | Admin/access-control functions that don't emit events. | Functions where the event is emitted by the called contract, not the calling function. |

### Other Slither tools worth trying

- **`slither-check-upgradeability <impl-address>`**: checks proxy upgrade safety (function selector collisions between proxy and implementation, storage layout mismatches, missing initializer protection). Useful for any project with upgradeable proxies.
- **`slither-read-storage <address> --rpc-url <rpc>`**: reads live contract storage to verify role assignments directly from onchain state. Useful for spot-checking whether AccessManager roles match what the discovery's event handlers report.
- **`--print entry-points`**: shows storage layout, inheritance chain, and which contract each function is inherited from. Useful for understanding complex inheritance hierarchies.
- **`--print not-pausable`**: lists functions that do NOT use a `whenNotPaused` modifier. Useful if the project uses OpenZeppelin's Pausable pattern. Not useful if the project uses a different mechanism (per-reserve freeze flags, custom halt logic).
- **`--print call-graph`**: exports function call relationships as a dot file. Useful for visualizing indirect authority flow in complex contracts.

## Step 2: Wake (the deep dive)

Wake's `state-changes` printer is the one feature worth using. It traces exact struct-field assignments through function calls, shows emitted events, and marks cross-contract call boundaries.

```bash
cd /tmp/analysis-work/<ContractName>
wake print state-changes --no-links -n <function1> -n <function2> -n <function3>
```

Target the critical functions identified in step 1 (those with access control modifiers that write important state). Don't run it without `-n` flags on a large contract; the output will be thousands of lines of noise from internal helpers.

What Wake adds over Slither:
- **Struct field precision**: where Slither says "writes `_reserves`", Wake says "writes `_reserves[id] = Reserve({ underlying: ..., flags: { paused: ..., frozen: ..., borrowable: ... } })`". This precision lets you write trust statements like "governance can individually freeze each reserve" rather than the vague "governance can modify reserves".
- **Cross-contract call boundaries**: Wake marks calls to other contracts as `CALLS UNIMPLEMENTED NONPAYABLE FUNCTION <interface>.method(...)`. This shows where the trust boundary is: the function reaches into another contract's state, and static analysis can't trace further.
- **Event emission**: shows which events are emitted by each function. Useful for verifying that every privileged action emits an auditable event.

Wake's detectors are not useful for trust analysis. They produce hundreds of reentrancy findings (any external call triggers the detector) and unchecked-return-value noise.

## Step 3: Aderyn (centralization labeling)

Run Aderyn on each core contract's source directory:

```bash
cd /tmp/analysis-work/<ContractName>
aderyn . --src src --skip-update-check -o report.md
```

The one detector worth reading is `centralization-risk`. It explicitly flags every function gated by `onlyOwner`, `onlyRole`, `restricted`, or similar modifiers as a centralization risk, listing the exact function signature and file location. This is the same data Slither's `--print modifiers` gives you, but framed in trust language ("Contracts have owners with privileged rights to perform admin tasks and need to be trusted to not perform malicious updates or drain funds").

Other Aderyn detectors overlap with Slither and produce the same findings. The `arbitrary-transfer-from`, `unprotected-initializer`, and `delegate-call-in-loop` detectors are worth skimming for confirmation, but they won't surface anything Slither missed.

Common false positives in Aderyn:
- "Contract Name Reused in Different Files" — artifact of duplicated sources in the workspace. Ignore.
- "Missing checks for address(0)" on internal setter functions — check whether the public entry point validates before calling the internal setter. If it does, the finding is a false positive.

## Step 4: Semgrep (cross-instance consistency)

Semgrep's value is scanning ALL contract instances in one pass and confirming that the trust surface is uniform. When a project deploys N instances of the same contract (N market Spokes, N Oracles, N Vaults), Semgrep can verify that all N have the same access control pattern.

### Off-the-shelf rules

The Decurity rules (`github.com/Decurity/semgrep-smart-contracts`) match specific function names from past exploits. They're worth running once, but expect zero or low hit rate on modern protocols that use different naming conventions.

```bash
git clone --depth 1 https://github.com/Decurity/semgrep-smart-contracts.git /tmp/semgrep-rules
semgrep --config /tmp/semgrep-rules/solidity/security/ .code/ --no-git-ignore
```

### Custom L2BEAT trust rules

Write YAML rules that match the trust patterns you care about. A starter set of protocol-agnostic rules is included in this repo at `packages/config/src/projects/aave-v4/semgrep-trust-rules.yaml`. The patterns to encode:

| Pattern | What it catches |
|---|---|
| `restricted` function whose name contains oracle/price/source | Privileged oracle replacement |
| `restricted` function whose name contains pause/freeze/halt/deactivate | Privileged emergency controls |
| `restricted` function whose name contains fee/treasury/receiver/collector | Privileged fee redirection |
| `restricted` function whose name contains cap/limit/reset | Privileged position limit changes |
| `restricted` function whose name contains rate/strategy/interest | Privileged interest rate changes |
| `onlyOwner` function that calls `safeTransfer` or `transfer` | Owner drain path |
| `onlyOwner` function whose name contains withdraw | Owner withdrawal path |
| Function named `setAuthority` | Authority swap (governance replacement) |
| Liquidation/repay function with no access control modifier | Permissionless liquidation (expected, confirm by design) |

Run against the full `.code/` directory (not a single contract):

```bash
semgrep --config custom-trust-rules.yaml .code/ --no-git-ignore
```

What to look for in the output:
- **Consistency**: if rule X fires on 9 out of 10 instances of the same contract, the 10th is either missing a modifier or uses a different pattern. Investigate.
- **Completeness**: if a rule fires on a Configurator but not on the underlying contract (or vice versa), the trust path may have an extra hop you didn't account for in the discovery.
- **Zero findings on a rule you expected to fire**: the function names in the protocol don't match your regex. Adjust the rule's `metavariable-regex` and re-run.

## Writing the report

The output of the static analysis is a `STATIC_ANALYSIS_REPORT.md` in the project directory. The report should have:

1. **Methodology**: which tools were run, on which contracts, with which detectors/printers. Include the solc version used.

2. **Trust root**: identify the single contract or role that is the root of trust for the protocol. For OZ V5 AccessManager-based protocols, this is the ADMIN_ROLE. For Ownable protocols, this is the owner. For multi-sig-gated protocols, this is the multi-sig. State who currently holds this role (from the discovery's runtime data).

3. **Per-contract findings**: for each core contract, list:
   - Privileged functions (modifier, state written, trust implication)
   - User functions (auth pattern, what they modify)
   - Permissionless functions (anything without a modifier that writes state)
   - Cross-contract call boundaries (where trust flows to another contract)

4. **Detector findings**: list every trust-relevant detector finding, classified as true positive (by design), true positive (concern), or false positive (with explanation).

5. **Struct-field-level detail** (from Wake): for the most critical privileged functions, show the exact struct fields that are modified. This supports precise trust statements.

6. **Cross-instance consistency** (from Semgrep): confirm that all instances of duplicated contracts (N Spokes, N Oracles, etc.) have the same access control pattern.

7. **Trust summary**: a compact table of "what governance can do" with the contract path and impact. This is the table a reviewer reads first.

8. **Gaps**: what static analysis cannot tell you and where the discovery's runtime data fills in (role assignments, time delays, governance lifecycle).

## Feeding findings back into the discovery and frontend

The report is not the only output. Static analysis will surface trust relationships, privileged operations, and risk details that weren't captured during the initial discovery (step 1) and frontend project file (step 2). Go back and update both.

### Update discovery templates

- **Template descriptions**: make them more precise. Replace vague statements ("governance can modify reserves") with specific ones ("governance can individually toggle each reserve's pause, freeze, borrow, and collateral flags via `updateReserveConfig`"). State facts about the contracts directly; don't reference the tools you used to find them ("Static analysis confirmed..." or "Slither showed..." has no place in a template description).
- **Permissions on address-typed fields**: static analysis gives you the exact list of what each privileged address can do. If a template's `authority` or `owner` field doesn't have a `permissions` array yet, add one now with the operations you confirmed. This is what populates the Permissions section on the project page. See the discovery guide (milestone 3, "Defining permissions on address-typed fields").
- **Severity and type**: if static analysis revealed that a field you marked `"LOW"` actually controls a critical trust path (e.g., an ACLManager that gates discount rate changes on price adapters), upgrade it.
- **Descriptions that mention separate trust paths**: if static analysis confirmed multiple independent access control systems (e.g., an OZ V5 AccessManager AND a legacy ACLManager), make sure each template description names which system gates it.

### Update the frontend project file

- **`contracts.risks`**: replace generic risk entries with specific ones that name the function, the contract path, and the gating mechanism. "Funds can be lost if the position manager is changed to a malicious contract via updatePositionManager (gated by AccessManager roles)" is actionable; "Funds can be lost if a malicious upgrade is pushed" is not.
- **`scalingTechnology.detailedDescription`**: the Trust map section should name the most dangerous privileged operations and the specific actors who can perform them.
- **`scalingTechnology.otherConsiderations`**: add sections for structural findings (e.g., "Two independent access control systems", cross-instance consistency).

The goal: by the time the report, templates, and frontend file are all updated, a reviewer reading any one of them gets a consistent, precise picture of who they trust and what those trusted parties can do. The static analysis report documents the methodology and evidence; the templates and frontend file present the conclusions as facts about the protocol, without referencing the tools used.

## Common pitfalls

### "Everything shows as no access control"

If Slither's `vars-and-auth` shows empty `Conditions on msg.sender` for functions you know are privileged: the protocol uses an external access control contract (OZ V5 AccessManager, a custom authority, or a role registry). The runtime role check happens in the external contract, not inline. Check the `modifiers` output: if the function has `restricted`, `onlyRole`, or a similar modifier, the access control is there but not visible to `vars-and-auth`.

### Solc version mismatch

If Slither or Wake fail with "Source file requires different compiler version": the system `solc` doesn't match the contract's pragma. See the Prerequisites section. The error is always about the first `solc` found in PATH; use `which -a solc` to find all instances.

### "No such file or directory" in Aderyn reports

Aderyn crashes when trying to read source snippets from duplicated paths (common when `src/` symlinks create circular references). Use the copy-to-temp-workspace approach instead of symlinks.

### Wake modifiers printer crashes

Wake's `modifiers` printer calls `get_terminal_size()` which fails when run without a terminal (in scripts, CI, piped output). Use Slither's `--print modifiers` instead; it gives the same data without the terminal dependency.

### Semgrep zero findings

The off-the-shelf Decurity rules match specific function names from past exploits. If the protocol uses different naming conventions (which most modern protocols do), zero rules will fire. Write custom rules targeting the patterns in the protocol you're analyzing. Start with the rule template in this guide and adjust the `metavariable-regex` patterns to match the protocol's naming.
