---
title: "Governance Review #75"
description: "Q4 cadence: fewer headlines, more execution."
publishedOn: "2025-11-03"
authorId: manuel-gonzalez
---


## **TL;DR**

*Optimism Mid-Season 8 update lands: Phase A milestones mostly done; Interop timelines adjusted; Budget Board active with S8–S9 guidance and an ETH-staking RFP (due Nov 7); ROI/attribution feeds in from S7 and Grants Council; futarchy paused locally as processes mature; Governor “Onchain Controls MVP” proposed to move hard power on-chain via Security Council; Jovian hardfork slated for Nov 12/25 to sharpen fee mechanics and update Cannon.*

*On Arbitrum, Octane pitches CI-style security scans covering 100–300 projects as a complement to the $10M audit program.*

*On ZKsync, a proposal adds a pubdata-accurate gas/fee profiler for Era with Hardhat/Foundry plugins; Security Council year-one report: 11 ZIP approvals, three emergency upgrades, and complete recovery of April’s airdrop exploit.*

*Elsewhere, Polygon’s Agglayer v0.3.5 went live Oct 29 with hybrid security and AggKit; Starknet posted an Oct 9–15 downtime post-mortem with fixes and new monitoring; Everclear seeks a 6-month Code of Conduct trial extension and runs Security Council votes today (Nov 3); Scroll stands up a Governance Council, eyes auto-abstain renewal, and drafts a unified DAO model for Devconnect.*


## **Optimism**


### **Governance Update #11**

The Optimism Foundation [has created](https://gov.optimism.io/t/governance-update-11/10367) a post outlining the midpoint of S8 (Phase A), which highlights milestones completed across technical, economic, and social layers. On the protocol side, OP Labs adjusted some timelines to build Interop alongside other upgrades, with Stage 1 featuring multiple proof systems as the next target. 

Regarding treasury and incentives, the [Budget Board](https://gov.optimism.io/t/season-8-9-budget-board-charter/9818) is now live, has set Season 8–9 budget guidance, and has opened an RFP to stake the remaining ETH via liquid staking providers (applications are due by November 7). 

Impact and accountability tightened: Season 7 and Grants Council reports now feed standardized ROI and attribution, with early findings on developer tooling, onchain builders, and futarchy v1. Governance process matured with a refined protocol upgrade path, dynamic veto rights, a more active Developer Advisory Board, and 12-month terms for all Councils and Boards; futarchy tests are paused locally while learning from Uniswap and EF. Citizenship criteria were published with stronger Sybil resistance, and joint-house mechanics are under study ahead of Season 9 proposals.

**L2BEAT’s take**

As with any other midpoint, this marks a good momentum in terms of structure and measurement. The Budget Board, along with explicit benchmarks, is moving Optimism toward more transparent and data-driven allocation.  We would like to see more robust public success metrics linked to Interop and ETH staking outcomes, as well as a clear roadmap for Season 9 that closes the loop between experiments and policies, especially about lessons learned about futarchy and joint voting.


### **Curia OP Governance Dashboard Update Thread**

Curia [rolled out](https://gov.optimism.io/t/curia-op-governance-dashboard-update-thread/10369) a refreshed OP Governance Dashboard UI with support for new proposal types (including Joint House) and two analytics suites tied to verified forum accounts:


* **Forum Activity (new):** engagement trend over time (topics/posts/likes), active-time heatmap (by weekday/hour, 90d/365d views), sentiment/readability metrics with wordclouds, and response-time stats (own threads vs. others’).


* **Content Performance (new):** per-topic metrics (posts, likes, quotes, views, participants) and per-post breakdowns (likes, replies) to spotlight what resonates.

To unlock the new sections, delegates link their forum account by connecting a wallet in the dashboard and posting a verification comment in the thread.


### **govNERDs Q3 2025 Retrospective**

govNERDs has [posted a retro](https://gov.optimism.io/t/govnerds-q3-2025-retrospective/10370), where they have reduced its team members from 9 to 4 (now 3 as of Oct) and still delivered its charter: drafted/posted vote announcements for Token House and Citizens’ House with minimal edits, maintained docs and daily Forum/Discord monitoring, and signed Operating Budget multisig txs within a 72-hour SLA (zero incidents). The team restarted public Office Hours (on the first Tuesday of each voting cycle) and added grantNERD duties mid-quarter, including AI-assisted reviews, BD outreach, and application support, which helped attract well-known protocols. Transparency artifacts (transaction tracker, Community Budget Tracker, Season 8 budget report) remained up to date. Looking to Season 9, the team plans to scope an algorithmic selection framework for Season 10 and expand automation in reviews and announcement generation, while tightening coordination with the Grants Council.

### **Governor Upgrade Proposal: Onchain Controls MVP**

Ben-chain [has proposed](https://gov.optimism.io/t/governor-upgrade-proposal-onchain-controls-mvp/10371) an audited upgrade that moves critical governance powers on-chain. The Governor proxy’s admin will transfer from the Optimism Foundation to the Security Council’s L2 alias, so future Governor upgrades follow Token House direction via the Council. A new **authorizedProposer** role is introduced in the Governor; initially set to the Optimism Foundation’s manager address, it can later be reassigned (or governed via a **ProposalValidator**) to migrate proposal creation on-chain incrementally. The Optimism Foundation maintains safety levers (cancel on timelock, ProposalValidator admin, and the ability to set authorizedProposer). At the same time, the Token House gains stronger, enforceable control over treasury moves and contract upgrades. OpenZeppelin’s audit reported 8 low-severity issues, all of which were addressed. The rollout includes a mainnet no-op test, followed by an upgrade and a handoff of ownership to the Security Council. No user-facing downtime is expected.

**L2BEAT’s take**

Optimism consulted us before publication, and we’re broadly supportive of this direction: moving the Governor’s admin to the Security Council’s L2 alias and introducing an on-chain **authorizedProposer** meaningfully strengthens Token House authority while preserving well-scoped safety valves. Audits are complete, and the rollout plan appears solid.


### **Upgrade 17 Proposal: Jovian Hardfork**

Geoknee has [created a post](https://gov.optimism.io/t/upgrade-17-proposal-jovian-hardfork/10374) that outlines “Jovian,” a network upgrade for OP Stack chains that refreshes the fault-proof VM (Cannon updated for Go 1.24) and tightens fee mechanics. It adds a Minimum Base Fee and a Data-Availability Footprint Block Limit. Hence, L2 base fees react faster to block composition and DA pressure (reducing throttling and priority-fee spikes), plus an Operator Fee fix to better account for non-recoverable operator costs (still 0 for standard chains per the charter). Contracts are prepared (op-contracts v5.0.0), audits have been completed (OpenZeppelin, Spearbit), and chains using permissionless fault proofs will require the new absolute prestate. 

The Coordination plan is scheduled to be executed on Nov 10, with activation on Nov 12. The Mainnet execution is scheduled for Nov 20, with activation on Nov 25. Node operators must upgrade op-geth/op-node (or equivalents) and, for fault proofs, op-challenger v1.7.0-rc.1.

**L2BEAT’s take**

Pricing DA load more accurately and hardening the fault-proof toolchain improves user fees and operator safety. That said, protocol-level fee changes and prestate updates are sensitive; we’ll run a deeper review before stating a final position.

**Upcoming Events**

[DAB Office Hours](https://meet.google.com/pcq-tqpt-fcm) - on 04.11 at 15:00 UTC


## **Arbitrum**


### **Protecting 100 Arbitrum Projects for the Cost of One Audit**

Giovanni, from Octane, [has proposed](https://forum.arbitrum.foundation/t/non-constitutional-protecting-100-arbitrum-projects-for-the-cost-of-one-audit/30151/4) funding automated security scans for either 100 projects ($200k) or 300 projects ($500k) on Arbitrum, positioned as a rapid, scalable complement to the $10M Audit Program. The idea is to add 15-minute GitHub integration, on-demand CI checks per PR, reports with severity and remediation, and light manual triage from Octane’s researchers. They cite 2024 ecosystem losses (~$64.5M), audit waitlists, and point-in-time limitations, and claim retroactive detection of 7/9 publicly analysable Arbitrum exploits.

**L2BEAT’s take**

We’re supportive of broadening baseline security coverage, especially pre-deployment CI checks that can catch “last-minute” bugs that audits miss. Additionally, we believe that this should be coordinated with Arbitrum’s existing security programs under an AAE (most likely the Arbitrum Foundation) for intake, triage, and reporting. It can make sense as a separate grant if it integrates seamlessly into AF-run processes (eligibility, handoffs to the Audit Program, and shared metrics), with clear KPIs on detection quality and ecosystem impact.

**Upcoming Events**

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 04.11 at 17:15 UTC

[Arbitrum Reporting Governance Call (GRC)](https://meet.google.com/vgd-mmsj-kgk) - on 05.11 at 16:00 UTC

[Next Level: Golden Tides - Exclusive Playtest for the Arbitrum DAO](https://discord.com/invite/goldentides) - on 06.11 at 17:00 UTC


## **ZkSync**


## **Active Votes**

[[TPP-12] ZKnomics Token Staking](https://www.tally.xyz/gov/zksync/proposal/97314764080859415498674952864578860560861880297360481348949362100730414449748?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on November 3 at 16:57 UTC.


### **ZKSync Pubdata-Accurate Gas & Fee Profiler (Upstream-Ready)**

DappsoverApps [created a proposa](https://forum.zknation.io/t/proposal-zksync-pubdata-accurate-gas-fee-profiler-upstream-ready/811)l for a zkSync Pubdata-Accurate Gas & Fee Profiler (Upstream-Ready). This Hardhat/Foundry add-on measures execution gas and pubdata (including bootloader overhead), prices them via live batch parameters, and recommends a conservative **gas_per_pubdata_limit**. It ships as standalone plugins, plus upstream PRs, outputs human-readable tables and JSON for CI, and stays narrowly scoped to fee visibility/guardrails. Deliverables: core TS library, Foundry/Hardhat reporters, CLI, examples, and docs. Targets: ≤5% median / ≤10% p95 fee-delta vs current params; timeline ~9 weeks; budget $50k with a 6-month maintenance buffer.

**L2BEAT’s take:**

We’ll review the implementation in depth. We also recommend that the proposal include a clear, data-backed rationale for how the recommended **gas_per_pubdata_limit** is derived, so teams can trust that the suggestion is reasonable rather than arbitrary.


### **ZKsync Security Council Report (Aug 2024 - Sept 2025)**

ZKSC Security Council [published](https://forum.zknation.io/t/zksync-security-council-report-aug-2024-sept-2025/813) a year-one ZKsync Security Council Report covering August 2024 to September 2025, detailing a 12-member council’s mandate and activity, with 13 ZIPs reviewed, 11 approved, 9 executed, four emergency activations including three real incidents, full recovery of the April 2025 airdrop-mint exploit, and ongoing Pauser oversight for token programs exceeding 100M ZK; the report notes operations with GovAuth for coordination, Cyfrin’s verification tooling, and Hypernative monitoring, a funding shift to TPP-5 bridge and a 12-month TPP-6 budget, updated response SLAs of one hour for entities and nine hours for individuals, and Year-2 priorities such as CLI signing paths, unified L1–L2 upgrade notifications, a standardized ZKsync Chain Upgrade Framework, regular war-game and liveness tests, and migration off OpsGenie.


### **ZKsync Guardians One Year Report (Sep 2024 - Sep 2025)**

ZKsync Guardians [published](https://forum.zknation.io/t/zksync-guardians-one-year-report-sep-2024-sep-2025/821/1) a one-year report covering September 2024 to September 2025, outlining an eight-member independent body mandated to uphold ZK Credo values, deter malicious governance, and support protocol security, with no onchain vetoes needed as advocacy and deterrence sufficed, participation in three emergency upgrades alongside the Security Council and Foundation, operational use of the GovAuth interface plus MetaLeX for compensation flows, a successful token-program veto rehearsal, governance-approved funding via TPP-7 for 24 months with about 2.6M of 8.5M ZK minted to date, and priorities for the next year focused on improving signing pathways and tooling, increasing proposal and veto-window transparency, running regular rehearsals, and amplifying values advocacy.


### **Proposal Review Call November 5th**

Shelby [announced](https://forum.zknation.io/t/proposal-review-call-november-5th/817) the November 5 Proposal Review call, inviting authors of active or developing proposals to present and discuss with the community; the tentative agenda includes pending execution items TPP-11 (ZKsync Governance System Infrastructure Funding) and TPP-12 (ZKnomics Token Staking), a forum discussion on ZIP-14 (adding a permissionless burn function to the ZK token), ecosystem updates from the Security Council and Guardians with the Association’s annual report “coming soon,” and delegate questions on whether to reschedule the next call due to Devconnect, sharing events, and continuing last week’s discussion on delegate rewards.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 05.10 at 16:30 UTC.


## **Polygon**


### **Agglayer v0.3.5 is live**

Obinna [announced](https://forum.polygon.technology/t/agglayer-v0-3-5-is-going-live-today/21356) that Agglayer v0.3.5 went live on Oct 29 at 15:00 CET, delivering a hybrid security model that removes single points of failure in aggOracle/aggSender, enables multisig and SP1 verification directly in the pessimistic program with chain-configurable governance (multisig, SP1, or both, with an optional Polygon committee), launches AggKit to let non-CDK chains connect to Agglayer, and ships Unified Bridge smart-contract upgrades behind a timelock for community review.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**

### **SN mainnet downtimes over 09.10-15.10**

Ohad-StarkWare [reported](https://community.starknet.io/t/sn-mainnet-downtimes-over-09-10-15-10/116052) a post-mortem on Starknet mainnet downtimes from Oct 9–15, noting several short interruptions and three longer 10–20 minute outages caused by an Aerospike hotspot that stalled block-hash updates and a misconfigured transaction execution time that re-queued slow txs in a loop; the team shipped mainnet changes (including cache hardening), coordinated with apps and operators, communicated status in real time, and has added new metrics and Aerospike monitoring with expanded logging in progress, concluding the incidents stress-tested the network and led to concrete stability improvements.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


## **Active Votes**

[Social EGP 34 - Everclear Security Council Regular Members Elections](https://snapshot.box/#/s:dao.connext.eth/proposal/0x707486a0b6af8592287244657e928fe3581b9faf7da4fc58adc51f4a21758bc8) - ends on November 3 at 13:59 UTC.

[Executable EGP 34 - Everclear Security Council Lead Elections](https://snapshot.box/#/s:dao.connext.eth/proposal/0xe7c5e606c58ac2c9d656c886b2006246d66e57f8a99edca76fb6205e5197df97) - ends on November 3 at 14:26 UTC.

[Executable EGP 35 - Everclear Security Council Regular Members Budget Request](https://snapshot.box/#/s:dao.connext.eth/proposal/0xdc713f4c9f73f6f9c63434743b1bb799e3a4023a0ef6d2e6fe5a690f0cbfd4ce) - ends on November 3 at 14:33 UTC.


### **RFC - Everclear DAO Code of Conduct Trial period extension**

SEEDGov [proposes](https://forum.connext.network/t/rfc-everclear-dao-code-of-conduct-trial-period-extension/1413) extending Everclear’s Code of Conduct trial for six more months, keeping the policy live through the end of April 2026 while the DAO gathers participation for a constitutional vote; the update also splits out “Delegates’ Expectations” and “Conflict Resolution & Enforcement” from the constitutional layer (leaving them as mutable operating standards) and introduces a default wind-down rule for live initiatives: a Snapshot where options to cancel/modify surpass 15M CLEAR in total, with any proposer holding ≥600k CLEAR able to post.

**L2BEAT’s take:**

We support extending the trial, as having a clear code of conduct matters, even if it’s seldom invoked. We agree with keeping operational standards flexible outside the Constitution; we encourage tightening the draft by clarifying enforcement pathways and reporting channels.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Scroll**


## **Active Votes**

[Proposal Title: Auto-Abstaining Wallet extension](https://gov.scroll.io/proposals/98674292474488922780078349379792289085836876383512254197721386049065589813499) - ends on November 12 at 14:45 UTC.


### **Introducing the Governance Council (GC)**

Juansito [announced](https://forum.scroll.io/t/introducing-the-governance-council-gc/1283) the selection of Scroll’s new Governance Council with SEED Gov and Ethereum TGU now operating since early October to keep governance healthy and design a unified Scroll DAO and Foundation structure; near-term work includes renewing the auto-abstain wallet for quorum and reviewing GCR incentives amid lower participation, while longer-term design tracks cover governance software choices with Aragon Tally and Agora, a testable DAO constitution, governor parameters like cycles quorum and roles, a more autonomous timelock, clarifying delegate roles and value add, transitioning and adding councils, and learning from other DAOs with an initial proposal targeted for Scroll DAO Day at Devconnect and more frequent updates to follow.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 03.11 at 17:00 UTC.

[Open Economy AMA](https://meet.google.com/dfq-hybr-kbr) - on 05.11 at 14:00 UTC.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/zfd-asoc-rmx) - on 06.11 at 17:45 UTC.

## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for L2BEAT Governance Office Hours, where we discuss everything related to Lisk’s governance, from current initiatives to high-level conversations.

## **Uniswap**

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.
