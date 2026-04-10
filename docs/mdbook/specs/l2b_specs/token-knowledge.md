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
- [User Interface](#user-interface)
- [Relationship to Existing Packages](#relationship-to-existing-packages)
- [Open Questions](#open-questions)
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

## User Interface

Token Knowledge requires a UI for the following tasks:

- **Browsing the inferred catalog.** Users should be able to see the full derived token catalog: abstract tokens, deployed tokens, their associations, and propagated metadata. Each entry should indicate whether it was derived from a rule or entered manually, and which facts contributed to it.
- **Entering and editing manual facts.** Researchers need to add facts that cannot be derived automatically (issuers, Coingecko IDs, initial abstract token assignments). The UI should make it easy to add, modify, and remove manual facts.
- **Entering and editing rules.** Advanced users need to add or modify inference rules. This could start as a text editor for Clingo-syntax rules and evolve into a more structured interface over time.
- **Inspecting derivation chains.** When a user sees a derived fact, they should be able to trace back through the chain of rules and source facts that produced it. This is essential for debugging and for building trust in the system's output.

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

## Scope

This document describes a **prototype** that should validate the core idea: that a useful token catalog can be fully inferred from facts and rules, eliminating most manual curation.

The prototype should:

- define the fact schema for automatic facts (extracted from interop) and manual facts,
- define an initial set of inference rules covering canonical bridging and metadata propagation,
- integrate Clingo (or an equivalent engine) to produce the derived catalog,
- provide a minimal UI for entering manual facts and viewing the output,
- demonstrate end-to-end inference on real data from the existing interop database.

The prototype should **not** attempt to:

- fully replace TokenDB in production (that happens after validation),
- handle all edge cases around incorrect facts or conflicts,
- optimize for performance at scale,
- build a polished rule-editing interface.

If the prototype validates the approach, the next steps would be to formalize the fact extraction pipeline, expand the rule set, build the production UI, and plan the migration from TokenDB.
