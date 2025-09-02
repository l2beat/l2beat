---
title: "Governance Review #67"
description: "Busy week in governance—steady tempo, few surprises."
publishedOn: "2025-09-01"
authorId: manuel-gonzalez
---

## **Optimism**

### **Season 8 – The Next Step in Optimism Governance**

Vikthor [created a post](https://gov.optimism.io/t/season-8-the-next-step-in-optimism-governance/10259) outlining Season 8’s governance updates for the Optimism Collective (July 31–December 24, 2025). Highlights: Broader stakeholder voting beyond tokenholders (involving end-users, apps, and chains in the process) and “Optimistic Approvals” to handle critical maintenance within the normal cycle; the new Protocol Upgrades process took effect on August 1. It builds on S7 wins—six protocol upgrades, a maintenance path, M&M Council involvement in grants, and 14 OP Chains integrated via the Chain Delegation Program.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DAB Office Hours](https://meet.google.com/pgj-ibvv-trr) - on 26.8 at 14:00.

[Grants Council Office Hours](https://meet.google.com/pcq-tqpt-fcm) - on 27.8 at 16:30.


## **Arbitrum**


## **Active Votes**

**Onchain**

[Remove Cost Cap, Update Executors, Disable Legacy USDT Bridge](https://www.tally.xyz/gov/arbitrum/proposal/51852039695020109312343918128899814224888993575448130385109956762385891284115?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on September 4 at 22:48 UTC.

**Offchain**

[AIP: ArbOS Version 50 Dia](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x33754da4006d0ef38666ec5d5e85fd0966a891a594ab9dc21f23beedea2d330b) - ends on September 4 at 17:44 UTC.


### **Arbitrum Orbit Chains Revenue Dashboard by Lampros DAO**

Lampros DAO [created a post](https://forum.arbitrum.foundation/t/arbitrum-orbit-chains-revenue-dashboard-by-lampros-dao/29894) that outlines a new Dune dashboard tracking ETH/USD revenues from Orbit chains that settle on Arbitrum One—complementing their earlier activity dashboard. It offers per-chain views (gas used for batch posts, daily batch activity, revenue by chain/contract/license) and aggregate comps (monthly totals, gas trends, efficiency), with initial coverage for Xai, EDU Chain, ApeChain, Deri, Rari, Proof of Play (Apex/Boss), Molten, WINR, Superposition, Sanko, Blessnet, and more as they’re indexed. Aimed at delegates, chain teams, and treasury analysts, it updates near-real-time and invites requests for additional chains/metrics.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Open Discussion of Proposals Governance Call](https://meet.google.com/hex-xumv-hga?authuser=0&hs=122) - on 26.8 at 16:00.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 26.8 at 17:15.

[Security Council Election Process Improvements proposal](https://meet.google.com/fnu-dvdw-rai) - on 27.8 15:00.


## **Uniswap**


## Active Votes

**Onchain**

[Establish Uniswap Governance as “DUNI,” a Wyoming DUNA](https://www.tally.xyz/gov/uniswap/proposal/90) - ends on September 7 at 13:51 UTC.

**Offchain**

[Launching Uniswap v3 on Ronin with co-incentives](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0xfc6edc8b64e1fa8eef46d187557969b14ca24ac58b8b6d6b302ea27a2213849d) - ends on September 6 at 14:00 UTC.

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Hop Community Call](https://discord.com/channels/789310208413270078) - on 1.9 at 17:00.


## **Polygon**


### **PIP-72: Witness-Based Stateless Verification**

Jerry [created a proposal](https://forum.polygon.technology/t/pip-72-witness-based-stateless-verification/21257) that outlines adding witness-based stateless verification to Polygon, allowing validators to verify blocks without maintaining full state. Nodes use cryptographic “witnesses” (accessed trie nodes + needed headers) distributed over a new devp2p subprotocol wit/1 (NewWitness, NewWitnessHashes, GetWitness, Witness) with pagination to bypass the 16MB RLPx limit. Storage drops to ~90GB (historical bytecode + trie nodes) vs >1TB today; stateless nodes can fast-forward from Heimdall milestones or sequentially sync with witnesses, and prune to the last 64k blocks. Benefits: much lower hardware and faster sync; trade-offs: higher bandwidth and no mempool support. It’s opt-in, backwards-compatible, and complements PIP-64 (VEBloP) by decoupling production from validation.


### **Council Transparency Report: migrateTo()**

The Polygon Protocol Council [created a post](https://forum.polygon.technology/t/council-transparency-report-migrateto/21251) outlining an emergency-track (regular change) upgrade to the POL Migration contract, which adds the migrateTo(address,uint256) function, allowing users to migrate MATIC → POL to a specified recipient. The Council deployed PolygonMigration v1.2.0 and upgraded the proxy (PC consensus 10/13). The report includes the ProxyAdmin payload, Safe execution, and validation steps (check version() == 1.2.0 and migrateTo callable).

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**


### **ETH & STRK Bridge Withdrawals: Enhancing the Efficiency of the Withdrawal Limit Safeguard**

The Starknet Security Council has [created a post](https://community.starknet.io/t/eth-strk-bridge-withdrawals-enhancing-the-efficiency-of-the-withdrawal-limit-safeguard/115944) presenting an upgrade to the ETH & STRK bridge Withdrawal Limit safeguard to make it more responsive and effective. The plan adds Hypernative as an automated securityAgent (alongside StarkWare) on both L1 and L2. securityAgents can enable the daily cap—5% of TVL on L1, 8% on L2 per token, per GMT day; once hit, withdrawals fail until the next day. The Security Council (securityAdmin) can disable the cap with 3 multisig approvals. Hypernative will trigger the cap based on real-time monitoring of L1/L2 events and risk signals; it’s been tested for ~7 months with no false positives. Historical data since July 2024 shows withdrawals rarely exceed these thresholds. The Council is collecting community feedback for 7 days before proceeding.


**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


## Active Votes

[Social EGP 31 - Community Leadership Incentivization H2 2025](https://snapshot.box/#/s:dao.connext.eth/proposal/0x2d930d4c6d262d0c05dbd5cb3c2656a3f5cfa1c8d871a093d1bf4c5b77ed1d19) - ends on September 7 at 19:01 UTC.

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


### **[TPP-Draft] ZKsync Prividium Prize**

The ZKsync Foundation [has created a post](https://forum.zknation.io/t/tpp-draft-zksync-prividium-prize/763) outlining a straightforward prize program to jump-start Prividium chains—privacy-enabled, institution-friendly networks built on ZKsync. The first ten teams that launch a real, production chain on mainnet by December 31, 2026, and meet a clear traction bar (like sizable users, assets, payments, or valuation) can each earn 10M ZK, paid gradually at up to 1M ZK per month. The total program is capped at 100M ZK, prizes require KYB, and all claims will be verified and reported publicly; the Token Assembly authorizes the budget, while the Security Council can pause payouts if needed. The program runs from September 1, 2025, through December 31, 2027, and any unused tokens simply aren’t minted.


### **TPP Sponsor Bounty Pilot Program**

The_matter_labs has [created a post](https://forum.zknation.io/t/tpp-sponsor-bounty-pilot-program/760) that outlines a small “Proposal Sponsor Bounty” pilot: Delegates who sponsor Token Program Proposals (TPPs) that pass the Token Assembly and are executed on ZKsync Era can claim $250 USDC per proposal. The aim is to recognize the 1–3 hours sponsors often spend reviewing design and calldata for authors without proposal power, and to make it easier to find willing sponsors. The pilot is funded with $4k USDC from Association ops, runs first-come, first-served, and is retroactive to Q3 2025 (e.g., TPP-5 and TPP-6 are eligible; TPP-7 pending execution). Scope is TPPs only (not ZIPs/GAPs). Eligible delegates should contact the Governance Team to claim; if successful, the program may be formalized and automated.


### **Incident Report: EcPairing commitment binding failure**

The_matter_labs [created a post showing](https://forum.zknation.io/t/incident-report-ecpairing-commitment-binding-failure/764) an incident report on a vulnerability in the EcPairing precompile that could have let a malicious validator fake a pairing check by swapping an unbound “inner state” value. No chains were attacked, and no funds were lost—defense-in-depth (a mandatory 3-hour execution delay, freeze authority, and emergency upgrade playbook) kept finality paused and risk contained. A patched circuit (v28.1) now binds the missing input, requires a new verification key, and was deployed via an emergency protocol upgrade: stage0 (pause new Gateway connections), stage1 (deploy v28.1 on Ethereum/Gateway), stage2 (unpause). Era and Gateway upgraded first; other ZK chains followed on their own timelines after the July 27 report and an August 1 fix.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Scroll**


## Active Votes

[Scroll DAO Timelock Test](https://gov.scroll.io/proposals/32195966105875256982966851806785706747970993241469507520936106720258197550754) - ends on September 10 at 15:48 UTC.

[DAO Treasury Management RFP](https://gov.scroll.io/proposals/17736716284166632362836192914377789635944846939193281594888966652732932587143) - ends on September 10 at 15:49 UTC.

[Governance Contribution Recognition (Cycle 2: May - December 2025)](https://gov.scroll.io/proposals/84294918157976894858048860391138207218295133971592083664910187859023806547948) - ends on September 10 at 15:50 UTC.

[Governance Council (GC) Formation](https://gov.scroll.io/proposals/82655858280007762154451816682066548485813034000370782924228008319261079646067) - ends on September 10 at 15:51 UTC.


### **Proposal: User-Friendly Scroll Bridge UI with Force Transaction Feature**

WakeUp Labs [created a post that outlines](https://forum.scroll.io/t/proposal-user-friendly-scroll-bridge-ui-with-force-transaction-feature/1115) a community-run, open-source Scroll bridge interface that doubles as a fallback to “force-include” withdrawals on Ethereum if the sequencer is down or censoring. The UI will utilize Scroll’s official bridge contracts (no extra fees), ship with plain-English documentation, and guide non-technical users through a console-based force-transaction flow when needed; it can auto-detect censorship and redirect accordingly. The ask is 232,408 SCR ($ 85,200): ~199,675 SCR for three months of development and ~32,733 SCR for one year of hosting/maintenance, with WakeUp Labs committing to continue running and maintaining the app for two years. If the community and core team agree later, this interface could even replace the current official bridge, thereby strengthening decentralization and providing users with a reliable escape hatch during sequencer incidents.


### **Community Council Selection Thread (CC)**

Juansito [created a post](https://forum.scroll.io/t/community-council-selection-thread-cc/1107) that outlines the initial setup and first selections for Scroll’s Community Council (CC): 3 seats to start—one shared by the Community team (Juansito, Gabriella Mena, Joey), one shared by the Governance team (Eugene, Jamilya), and a first external split seat awarded to LATAM leaders Criss Valladares and Carla Martinez. The Community team ran the process (68 applications → 11 interviews → 4 finals) with criteria focused on scaling Local Nodes, operational capacity, availability, L2/Ethereum community-building, grants experience, strategic alignment, no COIs, and independence from Local Nodes.


### **Proposal: Support Squad Pilot (Weaver + Scribe Model)**

Alexsotodigital [created a post](https://forum.scroll.io/t/proposal-support-squad-pilot-weaver-scribe-model/1112) sharing a 3-month “Support Squad” pilot for Scroll DAO: two part-time contributors—a Weaver to facilitate meetings and share cross-council context, and a Scribe to standardize agendas, capture decisions, and maintain an agreements registry—embedded across all councils and reporting to the Execution Oversight Council. The aim is continuity, clarity, and coordination without adding decision-making power: consistent rhythms, better follow-through, and reusable learnings. The pilot runs from Oct to Dec 2025 at ~20 hours per week per role, with a budget of ~$9,300 (≈26,651 SCR at $0.349/SCR): $1,500/mo each for Weaver and Scribe, plus $100/mo for shared tools. Success looks like tighter documentation, earlier tension detection, more precise alignment, and a January 2026 retrospective to decide on renewal.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 1.9 at 16:00.

[Weekly DAO & Governance Call](https://meet.google.com/nug-uygx-hbd) - on 3.9 at 11:30.

[Weekly DAO & Governance Call (#2)](https://meet.google.com/pcm-nxzr-rig) - on 3.9 at 17:00.

[Scroll Delegate Proposal](https://meet.google.com/jug-nayw-gtt) - on 28.8 at 17:30.
