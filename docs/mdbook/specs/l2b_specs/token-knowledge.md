# Token Knowledge

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Background: TokenDB](#background-tokendb)
- [Motivation](#motivation)
- [Token Knowledge: Core Idea](#token-knowledge-core-idea)
  - [Facts](#facts)
  - [Rules](#rules)
  - [Inference](#inference)
- [Worked Example: Inferring Token Identity via Canonical Bridging](#worked-example-inferring-token-identity-via-canonical-bridging)
- [Technology Choice](#technology-choice)
- [Implementation Details](#implementation-details)
  - [Fact Storage](#fact-storage)
  - [Transfer Facts](#transfer-facts)
  - [Importing Transfers into Facts](#importing-transfers-into-facts)
- [User Interface](#user-interface)
- [Relationship to Existing Packages](#relationship-to-existing-packages)
- [Open Questions](#open-questions)
- [Future Directions](#future-directions)
- [Scope](#scope)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Background: TokenDB

The monorepo currently contains a package called `token-backend` (internally referred to as TokenDB). It serves as a manually maintained registry of blockchain tokens, organized around two core concepts:

- **Abstract tokens** represent the idea of a token, independent of any particular chain. For example, "USDC" or "Ether" are abstract tokens. Each record carries metadata such as a symbol, issuer, Coingecko ID, and category.
- **Deployed tokens** represent concrete smart contract instances of a token at a specific address on a specific chain. A single abstract token may have many deployed tokens across different L2s and L1.

The relationship between abstract and deployed tokens is entered manually through a dedicated UI. Researchers browse suggestions surfaced by the interop pipeline, decide which deployed tokens belong to which abstract tokens, and write those associations into the database.

TokenDB works, but the workflow is labor-intensive: humans spend most of their time verifying relationships that the system already has enough information to derive on its own.

## Motivation

The interop pipeline already captures cross-chain token transfers from 60+ bridge protocols. From that data we can observe:

- which token addresses exist,
- how they move between chains,
- which bridges were used,
- specifics about the transfer, e.g. whether a transfer was canonical, meaning both sides represent the same abstract token.

In practice, the TokenDB population workflow has converged to: the interop pipeline discovers a relationship, a human reviews the suggestion in the UI, and the human writes it into the database. The human has become a rubber stamp for knowledge that is already implicit in the data.

Beyond the manual-curation overhead, the "Abstract Token" model itself has proven too simplistic. In TokenDB, abstract tokens are primarily distinguished by issuer: if a token is minted by a bridge rather than the original issuer, the bridge becomes the issuer, and the bridged token may be classified as a separate abstract token. While this heuristic works in many cases, it breaks down in others, particularly in the interop project, which consumes TokenDB data to classify transfers. There are scenarios where two tokens should be considered "the same" for interop purposes despite having different issuers, and the rigid issuer-based splitting cannot express this.

Token Knowledge addresses both problems. Rather than baking in a fixed concept of abstract tokens, it operates purely on facts and rules. Groupings like "abstract token" can still be expressed as derived facts when needed, but the criteria for grouping can evolve freely—without restructuring the underlying data model.

This suggests a different architecture. Instead of building up a persistent database through manual edits, we should **infer** the token catalog from a set of known facts and declarative rules. Manual input should only be needed for the small number of facts that cannot be derived automatically.

## Token Knowledge: Core Idea

`token-knowledge` is a new package that replaces the persistent, manually-curated TokenDB with a system built on three primitives: **facts**, **rules**, and **inference**.

The key design principle is that the output (the full token catalog: which abstract tokens exist, which deployed tokens belong to them, and what metadata they carry) is never stored as a primary artifact. It is always derived from the current set of facts and rules. When facts change or rules are updated, the derived catalog changes immediately.

```text
facts (automatic + manual)  +  rules  -->  [inference engine]  --> *virtual* token catalog
```

This also allows to freely change the meaning or even existence of **abstract token** category in the future.

### Facts

A fact is an atomic statement about the world. Facts come from two sources:

**Automatic facts** are extracted from the interop database. These are statements that the system can observe directly from on-chain data. Examples:

- `transferred_canonically(usdc, ethereum, 0xA0b8..., base, 0x833...)`
  "USDC at address 0xA0b8... on Ethereum was canonically transferred to address 0x833... on Base."
- `transferred_via_bridge(weth, arbitrum, 0x82aF..., optimism, 0x4200..., hop)`
  "WETH at 0x82aF... on Arbitrum was transferred to 0x4200... on Optimism through the Hop bridge."

**Manual facts** are entered by humans for information that cannot be observed on-chain. Examples:

- `issuer(ethereum, 0xA0b8..., circle)`
  "The token at 0xA0b8... on Ethereum is issued by Circle."
- `coingecko_id(ethereum, 0xA0b8..., usd-coin)`
  "The token at 0xA0b8... on Ethereum has Coingecko ID 'usd-coin'."
- `abstract_token(ethereum, 0xA0b8..., usdc)`
  "The token at 0xA0b8... on Ethereum belongs to abstract token USDC."

**Persistence.** The interop pipeline retains transfer data for only 24 hours before discarding it. This means automatic facts cannot be re-derived on demand from the interop database - once the source transfers are purged, the opportunity to extract facts from them is lost. To address this, token-knowledge persists all facts (both automatic and manual) in its own database table. This provides two benefits: facts survive the interop retention window, and token-knowledge becomes independent of the interop pipeline's operational lifecycle, making it possible to decouple the two systems in the future.

### Rules

A rule is a declarative statement that derives new facts from existing ones. Rules encode domain knowledge about what can be inferred from observed relationships. Examples:

- **Canonical bridging propagates identity.** If token A is canonically transferred to token B, and token A belongs to abstract token X, then token B also belongs to abstract token X.

  ```text
  abstract_token(C2, Addr2, T) :-
    transferred_canonically(T, C1, Addr1, C2, Addr2),
    abstract_token(C1, Addr1, T).
  ```

- **Metadata propagates along canonical bridges.** If a token has a known Coingecko ID and is canonically bridged to another address, the destination inherits the same Coingecko ID.

  ```text
  coingecko_id(C2, Addr2, Id) :-
    transferred_canonically(_, C1, Addr1, C2, Addr2),
    coingecko_id(C1, Addr1, Id).
  ```

- **Issuer propagates along canonical bridges.**

  ```text
  issuer(C2, Addr2, I) :-
    transferred_canonically(_, C1, Addr1, C2, Addr2),
    issuer(C1, Addr1, I).
  ```

Rules are transitive by nature. If token A is canonically bridged to token B, and token B is canonically bridged to token C, then a single manual fact assigning A to an abstract token is enough to propagate that assignment through B to C.

### Inference

The inference engine takes the union of all facts (automatic + manual) and all rules, and produces the complete derived token catalog. The output can include:

- the full set of abstract tokens and their metadata,
- the full set of deployed tokens and their associations to abstract tokens,
- any derived metadata (Coingecko IDs, issuers, categories) propagated by rules.

This output is conceptually a virtual view, not a persistent table. It can be recomputed at any time from the current inputs. Persistence may be introduced later as a caching optimization, but it is not a design goal.

## Worked Example: Inferring Token Identity via Canonical Bridging

Suppose the system starts with the following inputs:

**Manual facts:**
```text
abstract_token(ethereum, 0xA0b8..., usdc).
issuer(ethereum, 0xA0b8..., circle).
coingecko_id(ethereum, 0xA0b8..., usd-coin).
```

**Automatic facts** (from interop):
```text
transferred_canonically(usdc, ethereum, 0xA0b8..., base, 0x833...).
transferred_canonically(usdc, base, 0x833..., zora, 0xCccB...).
```

**Rules:**
```text
abstract_token(C2, Addr2, T) :-
  transferred_canonically(T, C1, Addr1, C2, Addr2),
  abstract_token(C1, Addr1, T).

coingecko_id(C2, Addr2, Id) :-
  transferred_canonically(_, C1, Addr1, C2, Addr2),
  coingecko_id(C1, Addr1, Id).

issuer(C2, Addr2, I) :-
  transferred_canonically(_, C1, Addr1, C2, Addr2),
  issuer(C1, Addr1, I).
```

**Inferred output:**
```text
abstract_token(base, 0x833..., usdc).        % from Ethereum -> Base transfer
abstract_token(zora, 0xCccB..., usdc).       % chained: Base -> Zora transfer
coingecko_id(base, 0x833..., usd-coin).      % propagated from Ethereum
coingecko_id(zora, 0xCccB..., usd-coin).     % chained propagation
issuer(base, 0x833..., circle).              % propagated from Ethereum
issuer(zora, 0xCccB..., circle).             % chained propagation
```

From three manual facts and two automatic facts, the system derives six new facts. No human intervention was needed for the Base and Zora tokens.

## Technology Choice

The inference model described above (facts + rules producing derived facts through transitive application) maps directly to **Answer Set Programming** (ASP), specifically the kind of logic programming supported by [Clingo](https://potassco.org/clingo/).

Clingo is the initial technology choice for the prototype because:

- The fact-and-rule model is a native fit for Clingo's input language.
- Transitive inference (chaining rules across multiple hops) works out of the box.
- Clingo is a mature, well-documented solver.

That said, the architecture does not depend on Clingo specifically. Other candidates include:

- **Z3 Prover** for constraint-based reasoning if the rules become more complex.
- **Datalog** engines (e.g., Souffle) if performance on large fact sets becomes critical.
- A custom TypeScript inference engine if the rule set stays small and we want to avoid external dependencies.

The prototype should use Clingo to validate the approach. The inference engine can be swapped later without changing the fact/rule model.

## Implementation Details

This section describes the concrete implementation approach for the prototype.

### Fact Storage

All facts are stored in a single database table `token-facts-input` with two columns:

- **`name`** — the predicate name (e.g., `transferred`, `issuer`, `coingecko_id`).
- **`arguments`** — a string containing the predicate's arguments in Clingo syntax (e.g., `"ethereum","0xA0b8","base","0x833","hop","lockAndMint"`).

This deliberately minimal schema keeps the prototype simple. The inference engine reads all facts from this table, concatenates `name(arguments).` for each row to produce a valid Clingo program, runs the solver, and returns the derived catalog.

### Transfer Facts

One of the first automatic fact types is the **transfer fact**, which records that a token at one address was bridged to a token at another address by a specific protocol. Its arguments are:

| Argument   | Description |
|------------|-------------|
| `tokenA`   | Address (and chain) of the first/source token. |
| `tokenB`   | Address (and chain) of the second/destination token. |
| `protocol` | The bridge protocol that performed the transfer. |
| `proof`    | A human-readable string documenting the evidence, typically referencing the deposit and withdrawal transaction hashes. |

The `proof` field exists for auditability - it lets a human verify why the system believes this fact is true - but it plays no role in inference.

Note that the interop pipeline may record thousands of individual transfers for the same token pair through the same bridge. Token-knowledge only needs **one fact** per unique combination of `(tokenA, tokenB, protocol)`. This is a key reason the facts table stays small even though the underlying transfer volume is large.

### Importing Transfers into Facts

The import process converts interop transfers into facts and works as follows:

1. **Load existing facts.** Read all transfer facts from the database into an in-memory set keyed by `(tokenA, tokenB, protocol)`.
2. **Poll for new transfers.** Fetch recent transfers from the interop database.
3. **Deduplicate.** For each transfer, check whether a fact for that `(tokenA, tokenB, protocol)` tuple already exists in the in-memory set. If it does, skip it.
4. **Create new facts.** If no matching fact exists, insert a new row into the facts table with `name` set to the transfer predicate and `arguments` containing `tokenA`, `tokenB`, `protocol`, and a `proof` string referencing the deposit and withdrawal transaction hashes. Add the tuple to the in-memory set so subsequent transfers in the same batch are also deduplicated.

This ensures that the facts table grows only when genuinely new token relationships are discovered, regardless of how many individual transfers occur.

## User Interface

Token Knowledge requires a UI for the following tasks:

- **Browsing the inferred catalog.** Users should be able to see the full derived token catalog: abstract tokens, deployed tokens, their associations, and propagated metadata. Each entry should indicate whether it was derived from a rule or entered manually, and which facts contributed to it.
- **Entering and editing manual facts.** Researchers need to add facts that cannot be derived automatically (issuers, Coingecko IDs, initial abstract token assignments). The UI should make it easy to add, modify, and remove manual facts.
- **Entering and editing rules.** Advanced users need to add or modify inference rules. This could start as a text editor for Clingo-syntax rules and evolve into a more structured interface over time.
- **Inspecting derivation chains.** When a user sees a derived fact, they should be able to trace back through the chain of rules and source facts that produced it. This is essential for debugging and for building trust in the system's output.

### Logs Panel

The `token-knowledge-ui` package renders a **read-only logs panel** that looks like a terminal-style output box but is not editable. Messages are appended programmatically, each prefixed with a local time stamp, and the panel auto-scrolls as new entries arrive.

Entries are written from the tRPC action callbacks across the UI — one line per action on both the success and error paths. Typical shapes:

- `Imported N new facts, skipped M duplicates.` / `Import error: <message>`
- `Cleared N facts.` / `Clear error: <message>`
- `Running inference...` / `Inferred N facts from M inputs.` / `Inference error: <message>`

When the user refers to "logs from the UI", they mean the text rendered in this read-only panel — **not** browser console logs. The error messages in it are typically composed from the `Error.message` string surfaced by a failing tRPC call on the server, so they are the quickest way to see what the server-side code threw.

## Relationship to Existing Packages

- **`token-backend` (TokenDB):** Token Knowledge is intended to supersede TokenDB. During the transition, both systems may coexist. The manual facts in Token Knowledge will initially be seeded from the existing TokenDB data. Once Token Knowledge is validated, TokenDB can be deprecated.
- **`backend` (interop module):** The interop pipeline is the primary source of automatic facts. Token Knowledge reads from the interop database (transfers, bridge types, token addresses) but does not modify it.
- **`token-ui`:** The existing token UI will need to be adapted or replaced to support the new fact/rule editing workflow and catalog browsing.

## Open Questions

The following design questions are not yet resolved and will be addressed as the prototype evolves:

- **Incorrect automatic facts.** If the interop pipeline produces an incorrect fact (e.g., due to a bug in a bridge plugin), how should it be corrected? Options include: removing the fact at the interop source, introducing a negating manual fact (e.g., `not_transferred_canonically(...)`), or maintaining a manual override layer. The initial approach is to treat automatic facts as immutable inputs and only intervene at the source.
- **Conflict resolution.** What happens when two rules or fact chains produce contradictory conclusions (e.g., two different abstract tokens assigned to the same deployed token)? The system needs a conflict detection and resolution strategy.
- **Performance.** Running Clingo on the full fact set may become slow as the number of tokens and transfers grows. Incremental inference (only recomputing affected parts of the catalog when a fact changes) or caching the output may be necessary.
- **Persistence as optimization.** While the design is fully inferrable, persisting the derived catalog as a cache could improve API response times. This should not change the semantics (the cache is always rebuildable from facts + rules) but adds operational complexity.
- **Granularity of automatic facts.** The interop database contains rich transfer data. Deciding which fields to extract as facts (and at what granularity) will require iteration. Starting with canonical transfer relationships is the minimum viable set.
- **Rule versioning.** As rules evolve, the derived catalog will change. Should the system support versioned rule sets or point-in-time snapshots of the catalog?

## Future Directions

Ideas that are out of scope for the prototype but worth revisiting later:

- **Indexed fact columns.** The current single-table schema stores all arguments in a JSON blob, which makes querying for facts about a specific token expensive (requires scanning every row). A future optimization could add a small number of indexed columns (`index1`, `index2`, `index3`) alongside the JSON arguments - similar to how Ethereum event logs use indexed topics. Each fact type would declare which of its arguments map to which indexed column, enabling efficient lookups such as "all facts mentioning token address X" via a standard SQL `WHERE` clause. This pattern extends naturally to inferred facts as well.
- **Persisted inferred facts.** The prototype keeps inferred facts in memory only. If the derived catalog grows large or API latency matters, inferred facts could also be written to a database table (potentially with the same indexed-column scheme), treated as a rebuildable cache.
