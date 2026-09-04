# L2B-14851 — spike findings: the pipeline works end to end

Code: `spike/queryable-facts/` on this branch (README explains how to run it). Everything below was
measured, not estimated.

## What was built

| Stage | Where | Notes |
| --- | --- | --- |
| pragma → exact solc → standard JSON (`ast` + `storageLayout` + `evm.methodIdentifiers`) | `src/compile.ts` | Reuses the sourcify compiler helper that `packages/l2b` already uses; prefers a cached compiler that satisfies the pragma (like analyze's `resolve_solc`), otherwise the newest matching release; verifies the binary's sha256 against `list.json`. Offline fallback: the solc-js build already in `node_modules`. |
| AST + storage layout → 31 base relations, one TSV per relation | `src/extract.ts` (~1400 lines) | Single-pass truths only. Anything the walker does not model becomes an `unhandled` row, never silence. |
| rule library | `rules/lib.dl` (~270 lines) | structure → call graph (with virtual dispatch through the linearization) → writes (direct, storage references, `using for`, call-returned references, assembly slots) → a syntactic, explicitly *heuristic* `guardedBy`. |
| report in the storage-writers analyzer's shape + mechanical diff | `src/report.ts`, `src/compare.ts`, `corpus.sh` | So old and new could be diffed over a corpus, not eyeballed. |

The hello world from the issue runs verbatim on the facts:

```
writes(F, V) :- writesDirect(F, V).
writes(F, V) :- calls(F, G, _), writes(G, V).
```

## Parity with the Python `storage-writers` analyzer

Fixtures: `StorageWriters.sol` (analyze's golden fixture: base constructor, modifiers, internal
chains, library storage params, storage pointers, four inline-assembly forms, delegatecall) and the
attached `ClaimSemanticsPlayground.sol`: **identical tables**, including the opaque-write section.

Corpus: 23 flattened files from the zora discovery output (`packages/config/src/projects/zora/.flat`),
solc 0.5.14 → 0.8.25, 2 KB to 313 KB. Every file compiled, extracted and ran through Soufflé;
the Python analyzer ran on the same files through `l2analyze`.

| Flattened file | solc | src KB | fact rows | facts KiB | compile + extract + Soufflé (ms) | Python analyzer (ms) | Verdict |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `OptimismPortal2/OptimismPortal2.sol` | 0.8.15 | 207 | 7156 | 1376 | 554 + 124 + 102 = 780 | 3511 | match |
| `L1StandardBridge/L1StandardBridge.sol` | 0.8.15 | 115 | 3723 | 764 | 304 + 73 + 94 = 471 | 1858 | match |
| `L1CrossDomainMessenger/L1CrossDomainMessenger.sol` | 0.8.15 | 152 | 5225 | 1140 | 412 + 91 + 93 = 596 | 2282 | match |
| `SystemConfig/SystemConfig.sol` | 0.8.15 | 101 | 3573 | 640 | 246 + 62 + 92 = 400 | 1677 | match |
| `DisputeGameFactory/DisputeGameFactory.sol` | 0.8.15 | 114 | 2595 | 564 | 189 + 73 + 90 = 352 | 1614 | match |
| `DelayedWETH/DelayedWETH.sol` | 0.8.15 | 48 | 1805 | 324 | 133 + 40 + 91 = 264 | 1163 | match |
| `SuperchainConfig/SuperchainConfig.sol` | 0.8.15 | 36 | 1215 | 268 | 96 + 31 + 94 = 221 | 1084 | match |
| `OptimismMintableERC20Factory/OptimismMintableERC20Factory.sol` | 0.8.15 | 313 | 3255 | 800 | 235 + 65 + 97 = 397 | 1931 | analyzer gaps: 1 missed write |
| `PermissionedDisputeGame.sol` | 0.8.15 | 246 | 9020 | 1528 | 697 + 150 + 112 = 959 | 6616 | analyzer gaps: 1 over-attributed |
| `SaferSafes.sol` | 0.8.15 | 218 | 5588 | 876 | 488 + 114 + 101 = 703 | 3847 | analyzer gaps: 5 asm delegatecall, 3 asm sstore, 1 missed write |
| `AnchorStateRegistry/AnchorStateRegistry.sol` | 0.8.15 | 71 | 2572 | 548 | 192 + 52 + 91 = 335 | 1306 | match |
| `L1ERC721Bridge/L1ERC721Bridge.sol` | 0.8.15 | 78 | 2667 | 504 | 213 + 50 + 92 = 355 | 1435 | match |
| `LivenessGuard.sol` | 0.8.15 | 67 | 2748 | 524 | 221 + 55 + 104 = 380 | 1725 | analyzer gaps: 6 asm delegatecall, 3 asm sstore |
| `LivenessModule.sol` | 0.8.15 | 58 | 2347 | 456 | 191 + 49 + 96 = 336 | 1643 | analyzer gaps: 6 asm delegatecall, 3 asm sstore |
| `ProxyAdmin.sol` | 0.8.15 | 15 | 655 | 132 | 61 + 20 + 88 = 169 | 976 | match |
| `OptimismPortal2/Proxy.p.sol` | 0.8.15 | 7 | 250 | 100 | 34 + 12 + 87 = 133 | 791 | analyzer gaps: 7 asm delegatecall, 4 asm sstore |
| `L1StandardBridge/L1ChugSplashProxy.p.sol` | 0.8.15 | 11 | 341 | 124 | 39 + 16 + 86 = 141 | 810 | analyzer gaps: 7 asm delegatecall, 3 asm sstore |
| `L1CrossDomainMessenger/ResolvedDelegateProxy.p.sol` | 0.8.15 | 7 | 273 | 116 | 37 + 13 + 85 = 135 | 817 | match |
| `DeputyPauseModule.sol` | 0.8.25 | 100 | 4254 | 720 | 342 + 86 + 96 = 524 | 2663 | analyzer gaps: 6 asm delegatecall, 3 asm sstore, 2 missed write |
| `SuperchainProxyAdminOwner/GnosisSafe.sol` | 0.7.6 | 44 | 1847 | 448 | 158 + 45 + 98 = 301 | 1416 | analyzer gaps: 6 asm delegatecall, 3 asm sstore |
| `OpFoundationUpgradeSafe/Safe.sol` | 0.7.6 | 53 | 1897 | 428 | 170 + 44 + 92 = 306 | 1444 | analyzer gaps: 5 asm delegatecall, 3 asm sstore |
| `SuperchainProxyAdminOwner/GnosisSafeProxy.p.sol` | 0.7.6 | 2 | 36 | 68 | 25 + 8 + 86 = 119 | 758 | analyzer gaps: 1 asm delegatecall |
| `OpFoundationOperationsSafe/Proxy.p.sol` | 0.5.14 | 2 | 34 | 64 | 24 + 7 + 85 = 116 | 767 | analyzer blind: assembly without Yul AST (solc 0.5) |

Verdict legend — *match*: identical storage-writers tables (variables, slots, writers, opaque sites).
*analyzer gaps*: every remaining row is present only on the Soufflé side and was checked by hand:
"asm delegatecall" = a `delegatecall` inside inline assembly the Python analyzer does not see;
"asm sstore" = an `sstore` to an EIP-1967-style constant slot the Python analyzer drops;
"missed write" = a real write the Python analyzer does not attribute; "over-attributed" = a writer the
Python analyzer lists that does not write. Empty sections that exist on one side only (abstract
contracts, storage-less proxies) are not counted. Per-file details: `./corpus.sh` + `src/compare.ts`.

Every difference was read to a verdict:

| Verdict | Where | What |
| --- | --- | --- |
| **Python analyzer misses a write** (false negative) | `ERC20Permit._nonces` (OptimismMintableERC20) | `Counters.Counter storage nonce = _nonces[owner]; nonce.increment();` — a *local* storage pointer passed as a library receiver. The analyzer's library-storage-param detector only accepts state variables or references that point straight at one. |
| **Python analyzer misses a write** | `TimelockGuard._safeStates` (SaferSafes), `EIP712._nameFallback/_versionFallback` (DeputyPauseModule) | Writes through a storage reference *returned by a function* (`_currentSafeState(safe).timelockDelay = ...`, OpenZeppelin's `StorageSlot.getStringSlot(store).value = ...` whose body is `r.slot := store.slot`). Soufflé gets these from `returnsRef` + `callResult` facts and one alias rule. |
| **Python analyzer misses a write** | `Executor.execute`, `StorageAccessible.simulateAndRevert` (Safe, GnosisSafe), OP `Proxy._doProxyCall` | `delegatecall` *inside inline assembly* — how every Safe module transaction and every OP proxy call executes. The analyzer only sees Solidity-level `.delegatecall`. Soufflé reports it as an opaque write (`asmCall`). |
| **Python analyzer drops a write** | `FallbackManager.internalSetFallbackHandler`, `GuardManager.setGuard` (Safe), OP `Proxy._setImplementation/_changeAdmin` | `sstore(slot, x)` where the slot is an EIP-1967-style *constant*. The analyzer credits the constant as "written", then filters constants out of the table, so the write vanishes. Soufflé reports "sstore to an unresolved slot". |
| **Python analyzer over-attributes** (false positive) | `FaultDisputeGame.claimData` ← `addLocalData` (PermissionedDisputeGame) | `addLocalData` only *reads* through storage pointers (`ClaimData storage claim = claimData[i]`); Slither counts the pointer assignment as a write. Soufflé lists no write. |
| Definition choice, documented | `ISignatureValidator`, `Burner`, `Proxy` sections | The analyzer prints a section for every contract nobody inherits from, including *abstract* ones and ones with zero storage variables. The spike's `deployable` excludes abstract contracts. Empty sections carry no claims; `compare.ts` reports them as notes. |
| Label only, fixed | `address payable` in signatures | Slither prints `address`; the extractor now normalises signature labels the same way (the `param` facts keep the real type). |
| Soufflé right, analyzer blind | 0.5.14 `Proxy.p.sol` | solc < 0.6 emits inline assembly as *text only* (no Yul AST). The extractor emits `assembly(A, F, HasYul=0)` and the rules turn that into "effects unknown"; the analyzer says nothing. |

Net: on this corpus the Datalog side found **every** write the Python analyzer found except one that
was a false positive, plus a dozen real writes and delegatecalls the Python analyzer silently
missed — and it did so with rules, not detectors. The analyzer's own README predicted the
"never-missing-things" category would be the interesting one; it was.

## Speed and size

| | Spike pipeline (compile + extract + Soufflé) | Python analyzer (`l2analyze`, warm solc cache) |
| --- | --- | --- |
| two fixtures (2–3 KB) | 128 ms | 0.8–1.3 s |
| 23-file zora corpus, median | 336 ms | 1.4 s |
| 23-file zora corpus, max (`PermissionedDisputeGame.sol`, 246 KB, 5.7k lines) | 959 ms (697 solc + 150 extract + 112 Soufflé) | 6.6 s |
| Soufflé alone, interpreter, single thread | 85–112 ms, of which ~80 ms is start-up | — |
| fact files, whole corpus (2.0 MB of source) | 63k rows, 12.2 MiB TSV (5–7× source; ids and `sourceLoc` dominate) | — |
| first use of a solc version | one download (~14 MB) + sha256 check, then cached | solc-select, same idea |

Wall-clock per `tsx` invocation adds ~1.5–2 s of TypeScript start-up that a compiled CLI would not pay.

The compile → extract → Soufflé loop stays under a second even for the largest flattened
contract; the Python analyzer is 1–7 s per file (Slither + interpreter start). Soufflé's interpreter
has a fixed ~80 ms start-up; rule evaluation itself is negligible at this scale. Fact files are
~5–7× the source size, dominated by `sourceLoc` rows and long readable ids — cheap, and `sourceLoc`
is the bridge back to code a human can check.

## Answers to the practical questions

**Installing and shipping Soufflé.** No static tarball, no pip/npm package. The official 2.5
release ships `.deb` (Ubuntu 22.04/24.04) and `.rpm` (Fedora/Oracle) plus a `sha512sum.txt`.
`dpkg-deb -x` into `~/.local/opt` and a symlink works without root; interpreter mode needs only
`libffi8 libsqlite3-0 libgomp1 libncurses6 libtinfo6 zlib1g libstdc++6`, all present on stock
Debian/Ubuntu images. The `.deb`'s declared dependencies (`g++`, `mcpp`, `*-dev`) are for compiled
mode only. Consequences:

- `mcr.microsoft.com/devcontainers/*:trixie` (our devcontainer, glibc 2.41): the 24.04 `.deb`
  works as-is. `node:22-bookworm-slim` (analyze's Docker image, glibc 2.36): use the 22.04 `.deb`
  (the 24.04 one needs glibc ≥ 2.38 and libstdc++ ≥ 13). Both are one `RUN curl … && dpkg -i` line plus the six
  runtime libs. Not verified inside the images (no Docker on this machine) — verified by
  checking the `.deb` metadata and library versions.
- Avoid `#include` in `.dl` files unless `mcpp` is installed; the spike concatenates
  `rules/*.dl` itself and runs `souffle --no-preprocessor`.
- Ad-hoc questions (the LLM/MCP use case) need the interpreter; for a shipped rule library,
  Soufflé can also compile rules to a standalone C++ binary that reads the same TSVs — the
  Gigahorse approach. Both are available from the same `.dl` files.
- Verdict: **not painful to ship.** Nothing fundamental blocks the plan.

**Stable ids.** `<unit>:<Contract>.<member>(<paramTypes>)` for declarations,
`<function>/<name>@<offset>` for locals, `<function>@<offset>:<length>` for sites, `<unit>` = the
flattened file. Readable, collision-free across files, independent of the solc version (AST node ids
are not: they change between compilers and after any edit; byte offsets only change when the code
unit itself changes, in which case it is a different unit anyway). Two things the schema issue must
decide: what `<unit>` becomes (a codehash so identical deployments share facts; the file name is a
stopgap), and that ids are long — 1.3 MiB of facts for a 211 KB file is mostly id text. Soufflé
interns symbols, so it does not care; disk does a little.

**Anything surprising in the AST.** Yes, several, all now handled:

1. Builtins (`require`, `msg`, `super`, …) have negative declaration ids inside solc but the
   compact JSON prints them as **uint32** (`require` = 4294967278). In solc < 0.6 they are small
   *positive* ids pointing at declarations that do not exist in the AST. Detect builtins by name
   as the fallback.
2. `src` offsets are **bytes**, JavaScript strings are UTF-16: slice the UTF-8 buffer, or every
   text after the first non-ASCII comment is shifted.
3. Inline assembly: `x.slot` appears in the Yul AST as an identifier literally named `x.slot`;
   `externalReferences` maps it (by `src`) to the Solidity declaration with `suffix: "slot"`
   (older compilers: `isSlot`). solc < 0.6 has no Yul AST at all, only `operations` text.
4. The storage layout is **per contract**, not per variable — `Owned.owner` has a slot in
   `Owned`'s layout and in `StorageWriters`'s. `storageSlot(C, V, Slot, Offset)` must be keyed by
   the deployable contract; constants and immutables are absent from it, which is a convenient
   definition of "storage variable".
5. Modifiers are `modifiers[]` entries on the function with `modifierName.referencedDeclaration`;
   base-constructor calls (`constructor() Base(1)`) live in the same list and resolve to a
   `ContractDefinition` (kind `baseConstructorSpecifier`, absent before 0.8). Arguments given at
   the inheritance specifier (`contract A is B(1)`) are on `baseContracts[].arguments`.
6. Inheritance: `linearizedBaseContracts` is handed to us, but every call reference is **static**
   (`referencedDeclaration` points at the definition the source names). Virtual dispatch is a rule
   (`dispatch`), which means derived relations are contract-qualified — `writesIn(C, F, V)`, not
   `writes(F, V)` — because the same inherited function can write different slots or call
   different overrides in different deployables. Public getters are not in the AST at all
   (only `functionSelector` on the variable).
7. `using X for T` is `UsingForDirective` with `libraryName` (or `functionList` since 0.8.13);
   a bound call `libData.bump()` is a `MemberAccess` whose `referencedDeclaration` is the library
   function and whose base is not the library — the receiver becomes parameter 0.
8. Storage pointers flow through more than locals and params: they are **returned from functions**
   (`ClaimData storage x = _find(...)`, `f(...).field = v`, tuple returns) and **re-pointed in
   assembly** (`r.slot := store.slot`). Both are common in production code (dispute games, OZ
   `StorageSlot`). Modelled with `returnsRef`/`callResult` facts and two alias rules.
9. Slither prints `address` for `address payable`; harmless, but it is the kind of thing a
   parity diff surfaces first.

## What the schema issue (L2B-14852) must take into account

- **Facts about values, not just references.** `bytes32 slot = CONSTANT; assembly { sstore(slot, v) }`
  is resolvable only with a value-flow fact for locals (`localInit(L, X)`) and constants' literal
  values (`initializer` exists already). Without it these stay "unresolved slot", which is honest
  but weaker than the analyzer README's "with the slot number".
- **Call results are first-class.** `callResult(X, K, Index)` + `returnsRef(F, Index, X)` make
  returned storage references, tuple returns and `f().x = v` fall out of the same alias rule.
- **Statement tree plus condition structure.** `stmt(S, F, Kind, Parent, Index)` was enough for
  "unconditional" / "before" / "always reverts"; `condShape` (simple/and/or/not) was enough to flag
  `require(open || msg.sender == owner)`. A real `guardedBy` wants the condition's expression tree
  (CodeQL-style), or CFG facts from the second extractor.
- **Context.** Reachability, writes and dispatch are per deployable contract. Decide whether facts
  stay per code unit and rules add the contract, or the extractor already emits per-contract facts.
- **Trust labels.** The spike puts a `Trust` column on derived claims ("sound" for what follows
  from the AST alone, e.g. dead writes; "heuristic" for every syntactic guard claim). It worked as
  a column; whether base facts also need one is open — v1 base facts are all "sound", except that
  `assembly` with `HasYul = 0` and `unhandled` rows are the honest edge of soundness.
- **Never drop.** The `unhandled` relation, `assembly(A, F, HasYul)`, `opaqueWrite` for writes
  through references that resolve to nothing, and `asmCall` for Yul-level `delegatecall`/`call`
  are what made the corpus comparison trustworthy. Keep all four in v1.
- **Text.** Whitespace-collapsed, tab-free, 200-char cap worked for TSV. Byte offsets everywhere.
- Not yet modelled, needed soon: events and emits (present as `callSite` kind `emit` only), free
  functions' visibility, `try/catch` clauses beyond statement kinds, transient storage
  (`tstore` is recorded as an `asmCall`).

## The claim-semantics playground

The attached contract is twelve variations on "is this write guarded by the owner?". The syntactic
rule set gets eleven of them right and is honest about the twelfth:

| Function | Claim from the rules | Correct? |
| --- | --- | --- |
| `unguardedWrite` | unguarded: no `msg.sender` check | yes |
| `ownerWrite` | guarded: sender always checked against `owner` | yes |
| `conditionalGuard` | conditionally guarded: check only on some paths | yes |
| `guardAfterWrite` | guarded (a `require` *after* the write still reverts it) | yes |
| `returnBeforeWrite` | guarded: early return precedes every write | yes |
| `returnAfterWrite` | **unguarded**: the early return comes after the write, which persists | yes |
| `ownerOrGuardian` | conditionally guarded against `owner`; conditionally guarded against `guardian` | honest but imprecise: all paths *are* guarded, by different principals. Needs path sensitivity (L2B-14860). |
| `openOrOwner` | weakly guarded: the sender check is one side of an OR (`open \|\| msg.sender == owner`) | yes — and `writes(setOpen, open)` is one join away |
| `setOpen` | guarded against `owner` | yes |
| `deadWrite` | dead write: function always reverts (labelled *sound*) | yes |
| `ownerDelegate` | opaque write to any slot via `delegatecall`, guarded against `owner` | yes |
| `constructor` | writes `owner`, `guardian` (deployment pseudo entry point) | yes |

The distinction the playground is built around — a *check* (`require`/`revert`) protects a whole
function regardless of order because a revert undoes earlier writes, while a *gate* (`if (...)
return`) protects only what comes after it — is two rules in `lib.dl` (`senderCheck` vs
`senderGate` + `gatedWrite`). It is exactly the kind of semantic subtlety that is easier to state
declaratively than to get right in a worklist.

## Recommendation

Proceed to the schema issue. Nothing fundamental is broken; the two things that would have
changed the plan — Soufflé being hard to ship, or the solc AST being an unfaithful base — both
came out fine. The corpus diff should become a permanent fixture of steps 3 and 5: it found five
real analyzer bugs in an afternoon.
