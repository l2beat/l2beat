---
title: "Governance Review #50"
description: "Fresh month, same beat: L2s flood the forums with new discussions and proposals."
publishedOn: "2025-05-05"
authorId: manuel-gonzalez
---

## **Optimism**

### **Cycle 36 Grants and Audits final report**

Gonna.eth has [shared a post](https://gov.optimism.io/t/cycle-36-grants-and-audits-final-report/9883) that outlines the final results of Optimism Grants Council’s Cycle 36, bringing Season 7 to a close. Out of 21 grant‑ and audit‑track applications that reached the finish line, only one TVL‑growth proposal—Bedrock’s “Base & BOB LRT Growth Plan”—won approval, securing 235k OP. 16 other growth requests from names like PoolTogether, Aave, PancakeSwap, and Pendle were declined, pushing 151k OP back into the Governance Fund and leaving less than 2% of the season’s 10M OP budget unspent. On the audit side, 4 grants (Kyo Finance, Vfat, Neulock, and Velodrome’s Superswaps) were green‑lit for a combined 408k OP, while a dozen others were rejected.

With submissions now closed for the remainder of the season, the Grants Council is shifting to post‑season chores—collecting NPS surveys, tracking funded TVL gains, and prototyping an AI tool to streamline Season 8 reviews. A full reflection document, a demo of the new tool, and a consolidated list of every Season 7 incentive package are slated for release soon. Still, the headline is unmistakable: the council tightened its standards, funding only the bids it judged confident to drive measurable TVL or critical security value as Optimism gears up for its next grant cycle.


### **[Draft] Inflation Adjustment Proposal**

Jengajojo has [created a proposal](https://gov.optimism.io/t/draft-inflation-adjustment-proposal/9884) to lock OP‑token inflation at 0% from May 2025 to April 2026, leaving the total supply capped at 4.294B OP and minting no new tokens on the 31 May roll‑over. He argues that the network’s sizeable “unallocated” reserves render further issuance unnecessary: the Partner Fund has committed barely one‑fifth of its tranche (≈ 90 M OP) and distributed just 5.7 %, while the Seed Fund has tapped less than 5 % of its allocation. With only 58 % of the supply formally spoken for and circulating tokens projected to stay below 57 % through next April, the proposal contends that Optimism can finance FY‑4 grants, chain delegations, and growth programmes without weakening holders—sending what the author calls a “clear signal of fiscal discipline” until current reserves are exhausted.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://l2beat.com/governance/publications/meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DAB Office Hours](https://discord.gg/optimism?event=1357733357634715970) - on 5.5 at 14:00.


## **Arbitrum**


## **Active Votes**

**Temp-check**

[Top-up for Hackathon Continuation Program](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xbb7500b713ccf4eff3f2dcb61e3c9d8db5ed5628a4b2f891656a0c0de98907bd) - ends on May 8 at 16:00 UTC.

[Approval of STEP 2 Committee's Preferred Allocations](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xd67d17db3bd230b163ce1f791d8712812446bced14ef2de875fd01ab3e2be3d6) - ends on May 8 at 13:00 UTC.


### **Constitutional Quorum Threshold Reduction**

Arbitrum Foundation [has published](https://forum.arbitrum.foundation/t/constitutional-aip-constitutional-quorum-threshold-reduction/29145/1) an AIP that would lower the quorum for constitutional proposals from 5 % to 4.5 % of the votable ARB supply. The AF notes turnout has slipped to 4‑5 % of supply while the circulating base keeps expanding, making today’s 215M‑ARB bar increasingly complex to clear; a 0.5 % cut would shave roughly 25M ARB off the requirement, easing passage for otherwise well‑supported upgrades without touching the 3 % quorum that governs ordinary proposals. Because the change updates only a governance constant, no contract upgrades are needed; if the idea survives forum debate and a Snapshot temp‑check, it will head to an on‑chain constitutional vote, where, ironically, it must still reach the existing 5% threshold to pass.


### **Automated DAO Proposal Editing by SimScore**

Maets23 [has floated](https://forum.arbitrum.foundation/t/a-plug-in-to-convert-discourse-forum-discussions-into-clear-proposal-revisions-with-community-sourced-justifications/29142) a discussion on adding “SimScore” AI tooling to Arbitrum’s forum workflow, pitching a Discourse plug‑in that would digest every reply on a proposal thread, run the comments through the team’s similarity‑scoring API, and then create a red‑lined draft showing algorithm‑generated edits plus a full, source‑linked justification for each change. The system works in two passes—once before a Temperature Check and again afterwards, the second time weighting opinions by token power—to surface consensus clusters, map ideas in two‑dimensional space, and compute pair‑wise similarity, all while constraining the LLM so it cannot invent content beyond what the statistics support. The proposal will keep final‑edit rights, but the aim is to collapse weeks of manual synthesis into hours, boost proposal quality, and leave an auditable trail of how community feedback shaped the text. The ask is $32.2k: $15k up‑front to wire the plug‑in, $7.2k for a 9‑month SimScore subscription, and $10k for user‑research in H2. Technical specs, API docs, and demo screenshots of side‑by‑side diff views and justification panels are linked, and the team says the core API is production‑ready.


### **TMC - Stablecoin Withdrawal Process**

Threesigmaxyz [has outlined](https://forum.arbitrum.foundation/t/tmc-stablecoin-withdrawal-process/28877) a withdrawal framework that lets service‑providers draw on the Treasury‑Management (TM) track’s yield‑bearing stablecoin pool when ARB price dips leave previously approved budgets under‑funded. Under the plan, the Arbitrum Foundation, which custodies the TM capital, gets sole discretion to honour or refuse shortfall requests and may tap accrued yield from any of the 3 treasury‑manager strategies to do so, preserving principal so the pool is not drained. Retroactive claims for live programmes can be made by tagging the Foundation in a comment on the original forum thread; future proposals must bake explicit “TM‑yield back‑stop” language into their Tally text to qualify. Only yield—not principal—can be withdrawn, and the Foundation retains full authority over which deployments it liquidates and in what proportion when covering shortages.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://l2beat.com/governance/publications/meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Open Discussion of Proposals Governance Call](https://arbitrum.huddle01.app/room/zqt-insy-uiw) - on 6.5 at 16:00.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 6.5 at 17:15.


## **Uniswap**


## **Active Votes**

**Onchain**

[UAC Renewal S4](https://www.tally.xyz/gov/uniswap/proposal/87) - ends on May 7 at 18:36 UTC.

[Approved Budgets Rebalancing (S4)](https://www.tally.xyz/gov/uniswap/proposal/86) - ends on May 7 at 18:32 UTC.

**Temp-check**

[Analytics Hub for Uniswap’s Revitalization and Growth Program](https://v1.snapshot.box/#/uniswapgovernance.eth/proposal/0x675c9697cc6c8d1cab27e1cffab3fdc7740b3e978eb37d8b6dcce76d1726670f) - ends on May 6 at 17:13 UTC.

[Four Chains for Analytics Hub for Uniswap’s Revitalization and Growth Program](https://v1.snapshot.box/#/uniswapgovernance.eth/proposal/0xd0e154ab11dfeed1fb652c4a4db011937ffa7dd3333847936c09a668b5e5e804) - ends on May 6 at 17:30 UTC.


### **[RFC] Hook Manager Framework – On-Chain Policy Orchestration for Uniswap v4**

Mbendary[ has shared](https://gov.uniswap.org/t/rfc-hook-manager-framework-on-chain-policy-orchestration-for-uniswap-v4/25552) an RFC that outlines a “Hook Manager Framework” — a governance‑aware orchestration layer that would sit on top of Uniswap v4 and turn today’s ad‑hoc hook contracts into a modular, auditable policy stack. Under the plan, each pool would be created with a Hook Manager that registers single‑purpose “policy hooks” (KYC/AML checks, dynamic fees, MEV filters, RWA settlement logic, & etc.), enforces their execution order, and lets governance swap modules in or out while the pool is paused. By standardising interfaces, emitting uniform events and limiting each hook’s scope, the framework aims to cut audit surface, speed feature roll‑outs and give institutions reliable on‑chain compliance without touching the v4 core. A proposed UNI‑based governance model would control hook whitelisting and upgrades; licensing would follow a Business‑Source‑style path with paid enterprise options. Feedback on gas overhead, liquidity fragmentation, and whether the design balances openness and curated safety is requested.


### **Foundation Feedback Group (FFG) Thread**

AbdullahUmar, writing for the Uniswap Accountability Committee (UAC), [has outlined](https://gov.uniswap.org/t/foundation-feedback-group-ffg-thread/25549) the launch of a “Foundation Feedback Group” (FFG). This high‑context observer team will meet privately with the Uniswap Foundation every two months to monitor how the Foundation deploys the ~ $165 million budget the DAO granted in March. The FFG’s brief is to track progress on roadmap items such as v4/Unichain incentives and grant outflows, sanity‑check that capital is being funnelled toward initiatives that ultimately feed protocol revenue, surface material pivots back to the DAO, and offer discreet, informed critique where sensitive partnership or legal issues preclude full public disclosure. It will not act as a supervisory board or enforcement arm; instead, the UAC will maintain a public forum thread summarising each session in broad strokes while keeping confidential details under wraps.

The inaugural roster blends legal, investment, and market‑making firepower: Miles Jennings and Ross Shuel (a16z), Jesse Walden and Jake Chervinsky (Variant), Getty Hill (GFX Labs/Oku), Thanos Papadopoulos (Keyrock) and Kassandra Qian (Arrakis), with the UAC itself sitting in by default. Meetings begin in May and run through December 2025, after which the DAO will review the experiment and decide whether to renew or refresh the lineup.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**


### **Nominations for Head of DAO Ops Q2 & Q3 2025**

Francom has [opened a forum thread](https://forum.hop.exchange/t/nominations-for-head-of-dao-ops-q2-q3-2025/1334) inviting self‑nominations for Hop DAO’s “Head of DAO Ops” position for Q2–Q3 2025, signalling the start of a fresh election cycle to confirm the incumbent or choose a new operational lead. Candidates are asked to post their qualifications, motivations, and intended contributions directly in the thread; background on the role’s scope and past responsibilities is available in earlier governance discussions. Francom offers to field any further questions. Once the nomination window closes, the community will move to a vote to decide who will steer Hop’s day‑to‑day DAO operations for the next two quarters.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**


### **PIP-64: Validator-Elected Block Producer**

Jerry Chen [has created](https://forum.polygon.technology/t/pip-64-validator-elected-block-producer/20918) a PIP‑64, a core proposal that would overhaul Polygon PoS block production by letting validators elect a single “Validator‑Elected Block Producer” (VEBloP) per span and shifting everyone else to lightweight, stateless verification. Under the design, Heimdall picks one primary producer (plus backups) who writes every block in an open‑ended span, while all other validators validate using witness proofs instead of a full state DB. The change aims to smash today’s ~714 TPS ceiling and push toward 10k TPS (or more) by eliminating producer contention, slashing propagation latency, giving instant order‑finality, and freeing ordinary validators from heavy hardware—yet it keeps decentralised security by leaving block validation with the broader set. Forced‑transaction lanes via L1 state‑sync guarantee censorship resistance, time‑based spans prevent re‑orgs when a backup steps in, and fee/MEV redistribution will be handled in a follow‑up economics paper. Bor and Heimdall will need a hard‑fork upgrade, but checkpoint logic stays the same; with stateless nodes and elected producers, Polygon hopes to hit four‑digit throughput without sacrificing its validator footprint.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**


### **Standardizing a StarkNet Tooling Matrix for Seamless DevEx**

Immanuel Olivia [has floated](https://community.starknet.io/t/standardizing-a-starknet-tooling-matrix-for-seamless-devex/115522) a development proposal to create a community‑run “StarkNet Tooling Matrix” — a living table that links every StarkNet release to the exact Scarb, starknet‑cli, explorer, and IDE‑plugin versions that work with it. Olivia argues that a single source of truth for version compatibility would kill build‑breaks, cut support noise, and let teams schedule upgrades instead of firefighting them. The suggested setup is lightweight: a public GitHub repo hosting a markdown (or YAML/JSON) table, open to pull requests whenever a new core or tooling release drops, and optionally wired to a CI workflow that compiles and deploys a “hello‑world” contract for each entry to keep the matrix green. He’s now polling devs on which tools are essential, preferred data formats, and any automation ideas before the project is bootstrapped.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Everclear Delegates Call](meet.google.com/zcv-aqph-pcj) - on 8.5 at 14:00


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


### **[GAP-3] Authorization for the Security Council to Convert Recovered ETH into ZK**

The ZKsync Security Council [has created](https://forum.zknation.io/t/gap-3-authorization-for-security-council-to-convert-recovered-eth-into-zk/662) the GAP‑3, seeking Assembly consent to swap the 1,797 ETH it clawed back from April’s unclaimed‑airdrop exploit into fresh ZK and then return those tokens to the Governor's timelock. Roughly 45 million ZK were recovered directly, but the hacker also refunded ~1,800 ETH split across Era and L1. The council argues that restoring the entire haul in native tokens will put the airdrop supply back where governance intended. To avoid frontrunning, it asks for a one‑off mandate to bridge the L1 tranche, execute the ETH→ZK trades at its discretion, and publish a post‑mortem after the fact, attesting that no council member profited. Once the conversions settle, all new ZK would be sent to the Assembly‑controlled timelock, closing the incident.


### **Proposal: GrowSync - Bridging Industry Expertise and Web3 Innovation with zkStack**

Kai [has outlined](https://forum.zknation.io/t/proposal-growsync-bridging-industry-expertise-and-web3-innovation-with-zkstack/664) “GrowSync,” a zkStack‑based marketplace that pairs sector specialists (health‑care, real‑estate, retail, pharmacy, and more) with zkSync developers so they can spin up industry‑specific L2s and dApps, fund them with seed grants paid in ZK, and run all project management, DAO votes, and revenue sharing directly on zkStack. Experts would post ideas, dev teams would bid, milestones and payouts would be enforced by smart contracts, and a new GrowSync DAO, governed by staked ZK, would underwrite the most promising builds. Platform fees, premium NFT memberships, and micro‑shares of successful chains’ revenues would all settle in ZK, while forced‑staking discounts are meant to drive token demand. A “zkStack Academy” and mentor rewards (again in ZK) aim to smooth the learning curve for non‑crypto professionals. Kai is soliciting feedback on which verticals should launch first, how the ZK‑denominated revenue model could be tuned, and what zkStack features (privacy‑focused custom chains, data‑availability layers, zero‑knowledge identity proofs) the community wants emphasized before a three‑phase rollout begins later this year.


### **[TPP-X] Deactivate Capped Minters for TPP1 Ignite**

BaptistG has [created a post](https://forum.zknation.io/t/tpp-x-deactivate-capped-minters-for-tpp1-ignite/665) outlining a proposal to revoke the minter role from every capped‑minter contract created last year for the Ignite program, freezing roughly 277 million un‑minted ZK forever. Because the DeFi Steering Committee multisig must stay live to redistribute unclaimed rewards, simply burning the admin key is not an option; instead, the action contract will call revokeRole() on 10 Ignite minters—6 50 M‑ZK distro minters and 4 smaller admin minters—ensuring no party (or future multisig compromise) can issue new tokens under the old budget. The move has no follow‑on maintenance: once the roles are stripped, the remaining caps (which range from 3M to 50M ZK each) are permanently inactive, and any future incentive programmes will rely on the newer ZkCappedMinterV2 contracts that include an on‑chain cancel() switch.


### **A Single Pane of Glass for Elastic Chain: Let’s Build a Unified Analytics Dashboard**

Azizone [has floated](https://forum.zknation.io/t/a-single-pane-of-glass-for-elastic-chain-let-s-build-a-unified-analytics-dashboard/666) the idea of building a one‑stop “single pane of glass” dashboard that would stream real‑time analytics for every chain in the Elastic‑chain family (zkSync Era, zkPorter, and future rollups), instead of forcing users to stitch data together from multiple block explorers and spreadsheets. The proposed UI would surface core KPIs—daily active addresses, TPS, bridge‑level TVL, wallet‑creation counts, volume, and fee flow—so builders, investors, and the wider community can gauge network health at a glance. Azizone is looking for contributors across design (mock‑ups and UX), data‑engineering (Elastic API, The Graph, custom indexers), and front‑end (React/D3/Tailwind), and invites ecosystem partners such as DeFiLlama and Matter Labs to supply data feeds and help turn the concept into a flagship public dashboard.


### **A Plug-In to convert Discourse Forum Discussions into Clear Proposal Revisions with Community-Sourced Justifications**

Paulw has [created a proposal](https://forum.zknation.io/t/a-plug-in-to-convert-discourse-forum-discussions-into-clear-proposal-revisions-with-community-sourced-justifications/668) that would bolt a “SimScore” plug‑in onto the forum so AI can turn sprawling comment threads into red‑lined proposal edits, each backed by citations to specific community posts. The system would scrape every reply, run SimScore’s statistical engine to rank ideas against a calculated “consensus point,” map conceptual clusters, and compute pair‑wise similarity matrices. Only feedback that meets multiple evidence thresholds would be flagged as true consensus; a constrained AI then produces side‑by‑side edits and a justification sheet that quotes the relevant comments and shows the similarity scores. Authors keep the final cut before a proposal advances to voting. The budget request totals $14.8k for a three‑month Discourse integration, a later user‑research phase, and a year of API subscription. Paul argues the tool will compress weeks of manual synthesis into hours, lift proposal quality, and leave an auditable trail connecting every change to the community voices that drove it.


### **Proposal Review Call May 7 - Thread**

TheShelb [has opened a thread](https://forum.zknation.io/t/proposal-reivew-call-may-7-thread/669) to coordinate the agenda for the next ZKsync Proposal Review call, scheduled for Wednesday, 7 May. Proposal authors with items either live on‑chain or are still in discussion are invited to claim a slot and share updates with delegates. A preliminary line‑up lists an execution update on ZIP‑9 (V27 EVM‑emulation upgrade), an on‑chain vote for GAP‑3 (authorising the Security Council to swap recovered ETH for ZK), plus three forum‑stage items: TPP‑X (shutting down Ignite capped minters), TPP‑3 (ZIP Audit Reimbursement Program), and ZIP‑10 (activating ZK Gateway as a settlement layer).

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](meet.google.com/qvr-txgr-vja) - on 7.5 at 15:30 UTC.


## **Scroll**


### **Report: Scroll Mainnet Emergency Upgrade on 2025-04-25**

Haichen, writing on behalf of the Scroll Security Council, [has published](https://forum.scroll.io/t/report-scroll-mainnet-emergency-upgrade-on-2025-04-25/666) a post‑mortem on the emergency main‑net upgrade executed on 25 April 2025. The patch fixed two critical bugs: (i) a soundness flaw in OpenVM v1.0.0’s *auipc* opcode that let a colluding sequencer–prover duo fabricate invalid proofs (reported privately by Axiom); and (ii) a message‑queue spoofing hole in the new EnforcedTxGateway that could have let attackers mint unlimited ETH or ERC‑20s on L2 (reported via Immunefi). Scroll paused the gateway within hours of disclosure, rolled out one‑line fixes to both the ZK circuit and L1 messenger contract, and redeployed after the Security Council’s multi‑sig approved the upgrade; Trail‑of‑Bits has since attested to the patch’s efficacy. No user funds were lost, but the Council notes that as Scroll moves toward permissionless sequencers/provers, it will add multi‑proof safeguards and expand fuzzing, static analysis, and formal‑verification coverage for bridge contracts.


### **India Local Node - Regional Evaluation**

Rupin [has posted](https://forum.scroll.io/t/india-local-node-regional-evaluation/648) a regional‑evaluation note proposing an “India Local Node” for Scroll DAO. Citing India’s position as the world’s No. 2 Web3‑builder market—with 115 million crypto users, more than 17 million GitHub developers and the highest grassroots‑adoption score in Chainalysis’ 2023 index—the pitch argues that a dedicated node would give Scroll sustained access to the country’s deep engineering pool and fast‑maturing regulatory climate. The plan, to be led by community outfit Crewsphere (400+ events, 5,000 on‑boarded devs), sketches a national onboarding campaign for zkEVM, Scroll tracks at ETHIndia and other top hackathons, a multilingual Discord, a 25‑member “Scroll India Fellowship”, campus ambassador programmes, and builder‑incubation demo days. Requested support from the Scroll Foundation covers grants for operations, micro‑bounties, co‑sponsorship of hackathons, marketing amplification, and direct DevRel channels. The post stresses India’s critical mass of Solidity/ZK talent, dense event circuit, and gateway role to broader Asian markets, positioning the node as a strategic anchor for Scroll’s global expansion.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Weekly DAO & Governance Call](meet.google.com/smr-hxgd-btt) - on 7.5 at 11:30.

[Delegate Training Discussion](meet.google.com/yaj-mpsb-yng) - on 7.5 at 16:30.

[Weekly DAO & Governance Call](meet.google.com/mhz-ncvc-ipd) - on 7.5 at 17:00.
