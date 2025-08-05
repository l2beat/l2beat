---
lastUpdated: '2025-07-23'
---

## 1. The Stages Framework

This document is to be considered the source of truth for the latest version of the Stages Framework, which was first introduced [here](https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe). A changelog can be found at the bottom of the document.

# Specification

## Stage 0 requirements

**Does the project call itself a rollup?**
To be considered a rollup, the project must self-identify as such. This requirement is straightforward and helps distinguish rollups from other scaling solution, such as Optimiums, Validiums or other types of bridges.

**Are L2 state roots posted on L1?**
Posting state roots on L1 is a key characteristic of rollups that allows for withdrawals. If a rollup does not post state roots on L1, it falls short of a fundamental component of a bridged rollup.

**Does the project provide** **Data Availability (DA) on L1?**
Ensuring data availability on L1 is essential for the security and reliability of a rollup. This means that all data necessary to reconstruct the L2 state must be available on L1, enhancing the system’s transparency and auditability.

**Is software capable of reconstructing the rollup’s state source available?**
A rollup node software capable of reconstructing the L2 state from L1 data should be available, contributing significantly to transparency and trust. This allows anyone to review, audit, and run the software, enabling users and external observers to independently validate the proposed state roots against published data.

**Does the project use a proper proof system?**
The proof system is used to adjudicate whether the proposed state root is correct or not. In the case of a fraud proof system, it allows invalid roots to be rejected. For zk rollups, the proof system is required to accept a proposed state root. If state diffs are used for data availability, the proof system must also ensure that all state changes are included in the diff.

**Are there at least 5 external actors that can submit a fraud proof?**
A fraud proof system requires at least one honest actor to verify the correctness of proposed state roots and potentially dispute them. The fraud proof system must allow a minimum of 5 external actors to perform this task.

## Stage 1 requirements

➡️ The only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal) or push an invalid L2→L1 message (e.g. an invalid withdrawal) is by compromising ≥75% of the Security Council.

> ⚠️ **Assumption**: if the proposer set is open to anyone with enough resources, we assume at least one live proposer at any time (i.e. 1-of-N assumption with unbounded N). We don’t assume it to be non-censoring.

Please refer to [this forum post](https://forum.l2beat.com/t/stages-update-a-high-level-guiding-principle-for-stage-1/338?u=donnoh) for a detailed explanation of the requirement and some examples.

## Stage 2 requirements

**Is the fraud proof system permissionless?**
In this stage, the fraud proof system should be fully decentralized and open to everyone. This means that anyone, not just a set of allowlisted actors, should be able to submit fraud proofs. This is a key requirement to ensure that the system is not controlled by a limited set of entities and instead is subject to the collective scrutiny of the entire community.

**Do users have at least 30 days to exit in case of unwanted upgrades?**
Users should be provided with at least 30 days to exit the system in case of unwanted upgrades, including upgrades initiated by a DAO. This ample time frame allows users to react to significant changes in the system that they may not agree with and withdraw their assets if needed. One exception that we make is given the existence of a onchain bug detection system (e.g. two valid contradicting zk proofs), instant upgrades are allowed for detected bugs.

**Is the Security Council restricted to act only due to errors detected on chain?**
In the final stage of rollup development, the power of the Security Council, if present, should be highly limited. It should only be able to promptly intervene in the case of adjudicable onchain bugs, which are serious flaws in the system that could cause significant harm if not addressed. By restricting the council’s emergency actions to these types of errors, the system becomes more decentralized and the trust placed in the Security Council is reduced. This moves the rollup further towards the ideal of trust minimization, where the code itself is the ultimate authority. An example of this feature is present in the Polygon zkEVM contracts, where the rollup goes in “Emergency Mode” if two different valid proofs can be submitted using the same batches.

# Changelog

* 31 July, 2025: Updated the Stage 1 requirement following the [new definition](https://forum.l2beat.com/t/stages-update-a-high-level-guiding-principle-for-stage-1/338?u=donnoh) that was announced 6 months prior.

* 20 June, 2025: Updated Stage 0 requirements following the recent [Recategorization](https://medium.com/l2beat/framework-update-l2-projects-recategorization-5d43b0d1fe50). In particular, the 5 external challenger requirement has been moved from Stage 1 to Stage 0.

* 4 March, 2025: Clarified how the Security Council size and threshold are assessed for Stages 1 and 2.

* Dec 7, 2023: Updated the requirements for the Security Councils, rationale [here](https://medium.com/l2beat/stages-update-security-council-requirements-4c79cea8ef52).

* Aug 25, 2023: Renamed Optimistic chains to Optimiums ([PR](https://github.com/l2beat/l2beat/pull/1823)).
