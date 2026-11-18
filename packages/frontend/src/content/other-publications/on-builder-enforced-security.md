---
title: "On builder-enforced security"
description: "Ethereum block builders are looking to provide apps with enhanced security through oracle-based onchain reverts. But can that be achieved without additional trust in intermediaries?"
publishedOn: "2026-11-18"
authorId: l2beat_research
tag: Research
---

Ethereum block builders are looking to provide apps with enhanced security through oracle-based onchain reverts. But can that be achieved without additional trust in intermediaries?

Titan, Ethereum's largest block builder (~50% market share), has launched circuit breakers with [Phylax](https://x.com/phylaxsystems), with [Lighter](https://x.com/Lighter_xyz) and [Derive](https://x.com/DeriveXYZ) as the first named customers.

## How it works

1. The app and the builder (i.e. Titan) agree on off-chain checks.
2. The app adds an on-chain check to its contract, for example:

   ```solidity
   modifier credible(uint256 deadline) {
       require(block.number <= deadline, "test attempt expired");
       require(registry.isCredibleBlock(), "marker missing"); // the stamp check
       _;
   }

   function withdraw(uint256 amount, uint256 deadline) external controlled credible(deadline) { ... }
   ```

3. The builder runs the checks while it builds the block. If the block contains a call to a gated contract, the builder, acting as an off-chain oracle, adds an attestation (a stamp transaction) that approves the block, placed before that call.

## Potential risks

A stamp is an oracle attestation, a builder's claim that it ran the checks. The rules run off-chain and the chain only checks the stamp. Thus whoever controls the oracle decides which transactions get through.

**Rule management.** Each protected contract has a rule manager that can add or remove its rules. Today, Phylax controls every registry and can upgrade the registry instantly.

**Transaction censorship.** For functions behind a gate, other builders' blocks cannot run the call. This worsens censorship resistance, limiting transaction execution to permissioned block builders. Liveness also worsens: if the stamping builder goes offline, the function is offline until the app upgrades or a new stamper is approved (by Phylax, in this case). FOCIL doesn't help, as the transaction would get included but then revert at the stamp check.

## Stage 1 impact

A stamp check on an exit path (e.g., forced transactions, the escape hatch, withdrawal claims) fails the Stage 1 principle and two of its requirements:

- **Principle:** "Compromising ≥75% of the Security Council is the only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal)…"
- **"Users are able to exit without the help of the permissioned operators."** Every exit could need the stamping builder, a permissioned party.
- **"In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit."** A rule change on an exit path works like an upgrade, and it should satisfy the exit window.

## Design improvements

**Constrain rules, away from exits.** Put the stamp check only on functions users don't need to leave, for example rate limits on trading or borrowing. Forced transactions, escape hatches and withdrawal claims must work in any builder's block.

**Expiring onchain pause.** When checks fire, the monitor pauses risky functions. The pause expires on its own, cannot be renewed back to back, and spares the forced-exit path. Many L2 bridges already pause this way.

**Verifiable checks.** Let the attestation carry evidence that the rules passed (e.g., a validity proof, TEE attestation), and bind it to the onchain rule hash. Then any builder could attest, not only approved ones, so one builder's refusal stops being final. The onchain rule registry should be changeable only through the app's upgrade path (at least 7 days to exit for Stage 1).

**Liveness fallback mechanism.** If a builder goes offline for X amount of blocks, the stamp requirement could be lifted to ensure long-term liveness.

## User benefits

Well-designed rules can minimise risks and increase user protection. For instance, rules can be designed so that forced withdrawal requests can't be erased (as a malicious upgrade could do), and so that the escape hatch, once open, stays open. During regular operation, outflow rate-limit checks could help mitigate the magnitude of hacks. Moreover, off-chain checks could provide more sophisticated types of protection through the risk modeling of system anomalies and off-chain information and compute.

Until checks are verifiable and/or restricted to non-exit functions, stamp checks add a permissioned intermediary, and users and apps using these services would need to trust the builder that runs them.
