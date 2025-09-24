---
title: "Governance Review #70"
description: "Weekly governance brief: what passed, what paused, what’s next."
publishedOn: "2025-09-22"
authorId: manuel-gonzalez
---




## **Optimism**

**Active Votes**

[Maintenance Upgrade: 16a](https://vote.optimism.io/proposals/32872683835969469583703720873380428072981331285364097246290907925181946140808) - ends on September 25 at 20:24 UTC.

### **Cycle 41 Results – Season 8 Audit Grants**

M4rio.eth [shared](https://gov.optimism.io/t/cycle-42-results-season-8-audit-grants/10285) the first audit-focused results of Season 8: two approvals—FinDEX for 90,300 OP and SuperDCA for 33,000 OP—two applications on hold for possible later approval (Arcadia Finance for 53,950 OP and Swaps.io for 87,500 OP), and eight rejections. In total, 656,560 OP were requested and 123,300 OP were approved. The Season 8 Audit Grants budget stands at 581,726.40 OP with 458,426.40 OP remaining. The council emphasized open-source work, Superchain alignment, meaningful cost sharing by projects and audit providers, and novel code; many declines stemmed from high audit costs paired with low contributions.


### **Introducing improvements to the Protocol Upgrade process**

The Optimism Foundation [created a post](https://gov.optimism.io/t/introducing-improvements-to-the-protocol-upgrade-process/10284) that outlines the new Protocol Upgrade flow (live since Aug 1): upgrades get a technical review by the elected 7-member Developer Advisory Board, then a 7-day Sepolia veto window. Delegates and Citizens no longer approve every upgrade; instead, they can veto a DAB-approved release or override a DAB rejection if participation thresholds are met (17% with two groups, 14% with three, 11% with four). Maintenance upgrades use a shortened path, and Telegram alerts will flag veto windows.


### **Maintenance Upgrade Proposal: U16a**

Kelvin from OP Labs [posted](https://gov.optimism.io/t/maintenance-upgrade-proposal-u16a/10288) a maintenance upgrade proposal for U16a. It temporarily removes interop withdrawal-proving paths introduced in U16 (not enabled on mainnet) after partner feedback, while keeping the code in the repo for a future interop release. U16a also introduces system-level feature toggles via SystemConfig, allowing chains to opt into features like ETHLockbox. Chains already on U16 will retain ETHLockbox, whereas those transitioning from U15 to U16a won’t adopt it at this time. There’s no expected downtime or end-user impact, and existing U16 withdrawal proofs remain valid. The proposal has a preliminary DAB review and a fresh Spearbit audit with two low-severity notes; fixes are planned in U17. If approved, the upgrade targets Oct 2 using OPCM v4.1.0-rc.3; operators should be on op-node v1.13.6 and op-geth v1.101602.0 (plus op-challenger v1.5.1 where applicable).


### **Season 8: Budget Transparency Report**

Sov [shared](https://gov.optimism.io/t/season-8-budget-transparency-report/10286) a Season 8 budget report: 4.44M OP approved for Seasons 8/9, with a 17,840 OP trim across councils to stay under the cap. Final S8 allocations: Grants ~485,505 OP, DAB ~484,772 OP (5/7 upgrade approvals), Milestones & Metrics ~492,350 OP, Security Council ~1,510,250 OP. Payments stream via Superfluid in OPx through Dec 24, 2025; OPx is 1:1 with OP and can be unwrapped anytime. The operating budget is ~25.8% of TTM revenue, with an additional $80k in OP funds and Budget Board infrastructure. govNERDs receive $ 65k in OP for transparency tooling and are rolling out a more granular stream tracker.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DAB Office Hours](https://meet.google.com/pgj-ibvv-trr) - on 23.9 at 14:00.


## **Arbitrum**


### **Transfer 8,500 ETH from the Treasury to ATMC’s ETH Treasury Strategies**

Entropy [proposes](https://forum.arbitrum.foundation/t/transfer-8-500-eth-from-the-treasury-to-atmc-s-eth-treasury-strategies/29983) transferring 8,500 ETH (from sequencer + Timeboost revenue) from the DAO treasury to the Arbitrum Treasury Management Council. About 10.5k ETH is currently idle; ATMC’s ETH strategies have earned ~43 ETH since May with a ~2.4% 30-day APY. At similar rates, deploying 8,500 ETH could add ~204 ETH (~$891k) over a year while supporting Arbitrum DeFi (e.g., staking/restaking, lending supply, DEX liquidity). DAO wallets would be excluded from DRIP incentives. Allocations will target lower-risk, ecosystem-supporting venues; Entropy proposes, and OAT must approve each deployment. Funds are custodied by the Arbitrum Foundation, with rebalancing handled through regular reporting. Timeline: Forum feedback (Sept 16–25), Snapshot (Sept 25–Oct 2), then Tally (Oct 9–23). If passed, deployments begin after OAT signs off on the allocation list.


### **[DIP v1.7] Delegate Incentive Program Results (August 2025)**

SEEDGov [reported](https://forum.arbitrum.foundation/t/dip-v1-7-delegate-incentive-program-results-august-2025/29977/1) that 82 delegates enrolled in August and 51 qualified; 28 earned payouts totaling $50,790.65. Because the only Snapshot in August was the DIP v1.7 vote, SEEDGov granted full Snapshot points to all participants to avoid penalizing them under its conflict-of-interest policy. Two Tally proposals counted toward scoring (“Remove Cost Cap, Update Executors, Disable Legacy USDT Bridge” and “Register $BORING in the generic-custom gateway”). The “Presence in Discussion” multiplier used three threads (SC Election Process Improvements, Remove Cost Cap/Disable Legacy USDT, and ArbOS v50 Dia), with past-month comments considered for credit. Top earners included L2BEAT (Tier 1) and four Tier-2 delegates (MaxLomu, Tekr0x.eth, Lampros DAO, paulofonseca); a dozen more landed in Tier X. Bonus Points were issued for meeting attendance and notable contributions.


### **DVP-Quorum for ArbitrumDAO**

The Foundation [published](https://forum.arbitrum.foundation/t/dvp-quorum-for-arbitrumdao/29996) a report arguing that quorum should track actual participation rather than the whole “vote-eligible” supply. Today, the quorum is a fixed % of voteable tokens (3% non-constitutional, 4.5% constitutional), which continues to rise as airdrop-locked ARB unlocks—even though the total delegated voting power (DVP) has remained roughly flat. At current trends, the constitutional quorum could soon exceed active voting power and stall the DAO.

The proposal is to compute the quorum as a percentage of total DVP, with a hard floor. Suggested ranges are 40–50% of DVP with a 100M ARB minimum for non-constitutionals and 150M ARB minimum for constitutionals (e.g., 40%/100M and 50%/150M). A PoC shows how to track total DVP at the token contract and update the governor math. Known trade-offs include the risk of “apathetic delegation” (big holders delegating but not voting to raise quorum), the shift of quorum responsibility to active delegators, and the possibility of a deliberate “baseline freeze” if active DVP drops below the minimum—by design, to enforce legitimacy. The team invites feedback on exact thresholds and timelines for implementation.


### **OpCo September 2025 Update**

OpCo [shared](https://forum.arbitrum.foundation/t/opco-september-2025-update/29998) its September update from the Oversight & Transparency Committee (OAT). The big news: Tamara Benetti started Sept 15 as Head of Operations, standing up core ops (domains, tooling, accounting, policies), meeting delegates/AAEs, and launching bi-weekly office hours after an initial DAO–OpCo session. Hiring now shifts to a “Chief Chaos Coordinator” (Head of OpCo Foundation), with interviews underway and Head of Growth considered opportunistically. OAT continues weekly syncs and is active in DAO work: reviewing allocation recommendations in Entropy’s TMC proposal and acting as counterparty on Entropy’s “Work Exclusively with Arbitrum DAO,” including negotiating the 10M ARB incentives across short, medium, and long-term programs.


### **MSS handover reporting: June 2025 - August 2025**

Arbitrum Foundation [shared](https://forum.arbitrum.foundation/t/mss-handover-reporting-june-2025-august-2025/29994) its first MSS handover report covering June 6–Aug 31, 2025, after taking over payroll ops for 7 DAO initiatives (Event Horizon, ADPC Security Subsidy Fund, Hackathon Continuation Program, Stylus Sprint, ARDC V2, 2025 Events Budget, and the Delegate Incentive Program). Incoming transfers totaled 8,100,575 ARB, 3,320,930 USDC, and 8,373,494 USDCe from MSS wallets; outflows were 1,963,649 ARB, 4,161,803 USDC, and 43,494 USDCe for program payments, vendor/grantee disbursements, treasury moves, and DIP payouts. ARDC has closed with excess sent to ATMC and the DAO Treasury; Events Budget and portions of the Security Subsidy Fund were also swept to ATMC pending remaining audits

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Open Discussion of Proposals Governance Call](https://meet.google.com/hex-xumv-hga) - on 23.9 at 16:00

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 23.9 at 17:15.

## **Uniswap**


### **Proposal to deploy Uniswap V3 on Plasma**

Plasma [posted an RFC](https://gov.uniswap.org/t/proposal-to-deploy-uniswap-v3-on-plasma/25826) asking the Uniswap DAO to approve a canonical v3 deployment on the Plasma L1 and designate the DAO’s cross-chain governance messenger there. They also request 250k UNI from the UAC’s discretionary fund for six months of LP incentives, to be matched by up to $5M in Plasma incentives focused on XPL/USDT, ETH/USDT, weETH/USDT, and XAUT/USDT. Plasma pitches itself as a stablecoin-first, EVM-compatible chain launching with ample USDT liquidity, no changes to Uniswap logic, and governance control routed through the DAO bridge (Wormhole for governance messaging; GFX Labs as deployer). Contracts are live, and ownership has been transferred to the Uniswap DAO. UNI incentives will be claimable on mainnet, while liquidity will be held on Plasma via Merkl.


### **GLI – Treasury Delegation Round 2 Applications**

DonOfDAOs [announced](https://gov.uniswap.org/t/gli-treasury-delegation-round-2-applications/25832) that applications are open for Round 2 of GLI Treasury Delegations. Eligible delegates have 7 days from publication, until 12:00 am on Sept 27 (applicant’s local time), to submit a nomination with proof of eligibility and a brief platform. Minimums: ≥75% on-chain and ≥75% off-chain participation across the listed proposals, and &lt;2.5M UNI voting power at Snapshot passage. After a ~7-day validation, nominees proceed to an election Snapshot with a self-voting cap of 25%. The results will utilize the GLI “waterfall” distribution, followed by a 3-day dispute window and then an on-chain proposal. An application template (links + stats + platform + Delegate Principles attestation) is included in the post.


### **Uniswap Foundation: Summary Q2’2025 Financials**

The Uniswap Foundation [reported](https://gov.uniswap.org/t/uniswap-foundation-summary-q2-2025-financials/25827) ~$110.1M in token-market-value assets at June 30 (15.4M UNI, 241 ETH) plus $49.8M in USD/stables on hand; an additional 5M UNI sat as collateral for a $29M loan to provide fiat liquidity while limiting market impact. Runway was projected through Jan 2027: ~$110.2 M earmarked for grants ($93.3M for 2025–26 new commitments, $16.9M previously committed) and ~$35.5M for operations and employee token awards. In Q2, the Foundation committed $6.5M in new grants and disbursed $4.9M (YTD: $18.9M committed, $7M disbursed). Operating expenses were $1.8M in Q2 (ex-UNI awards) and $3.7M YTD; revenue was $0.5M in Q2 and $141.3 M YTD (donations, dividends, interest). More details will follow with Q3 results.


**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


**Upcoming Events (Times in UTC):**

[DEF Community Call](https://meet.google.com/kjb-tgss-skw) - 23.9 at 17:00.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**

### **Proposal: Increase the contract size limit using EIP-7907 or other simpler means**

Cupojoseph [suggests](https://forum.polygon.technology/t/proposal-increase-the-contract-size-limit-using-eip-7907-or-other-simpler-means/21296) lifting Polygon’s 32 KB contract size cap (set via PIP-30) by adopting EIP-7907—or simply bumping the limit outright—to at least 256 KB. The aim is to enable bigger immutable apps, richer on-chain NFTs, and new media primitives (even tiny ML models embedded in contracts). With rivals like MegaETH/RISE testing higher caps, the post argues Polygon can out-innovate on dev experience and, since it doesn’t share all of Ethereum mainnet’s constraints, could safely exceed 256 KB pending protocol research on IO, analysis costs, and state proof sizes.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**

Starknet’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Everclear Delegates Call](https://meet.google.com/zcv-aqph-pcj) - on 25.9 at 14:00.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


## **Active Votes**

**Onchain**

[[TPP-8] ZKsync Community Activation Pilot Program (2025–2026)](https://www.tally.xyz/gov/zksync/proposal/19993014537746296636853362219247192671631735482612670856590540039176244970638?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on September 23 at 13:33 UTC.

[[TPP-9] ZKsync Prividium Prize](https://www.tally.xyz/gov/zksync/proposal/3413588788305073197878658504162606756015331882899383310343250085297198101137?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on September 26 at 12:37 UTC.


### **ZKsync Governance System Infrastructure Funding**

The ZKsync Association [drafted](https://forum.zknation.io/t/tpp-draft-zksync-governance-system-infrastructure-funding/781/1) a Token Program Proposal to fund the core governance stack—contracts, portals, security reviews, and legal/ops—through December 31, 2026. It asks to activate a capped minter for up to 33M ZK (~$1.65M at $0.05/ZK) with a 4M ZK/month rate limit. Funds would pay external service providers to maintain and evolve governance contracts (governor, timelocks, capped minters, token mechanics), keep interfaces and docs running (Governance Portal, forum, analytics, ZK Nation sites), run security work (audits, monitoring, drills), and handle necessary legal/operational tasks (e.g., MiCA materials, custodian integrations). The request does not include salaries or overhead for the Association itself. Accountability comes via public mint tracking, forum updates at start/end of each engagement, annual reports, and the Token Assembly’s right to cancel the minter (with the Security Council able to pause it). Targets emphasize reliability and participation—zero incidents, faster time to quorum, and broader active voting power.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):** [Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 24.9 at 15:30.


## **Scroll**


### **Update on how the Scroll DAO is evolving**

Juansito [posted an update](https://forum.scroll.io/t/update-on-how-we-re-evolving-the-scroll-dao/1150) clarifying that Scroll’s governance revamp does not affect protocol security or user funds; upgrades remain coordinated with the DAO and executed by the Security Council. The change aims to reconcile market speed with DAO deliberation: the Foundation will provide oversight (with veto power), set annual/biannual treasury budgets, and lean on an Execution Council for operations, while stepping back from day-to-day DAO execution. The target is a clearer, faster, “Scroll as One” model with tighter alignment, efficiency, and disciplined resource use. Immediate steps: recruit a Governance Council, co-draft a new constitution and governance model for a DAO vote (goal: in place by the Jan 1, 2026 cycle), and meet delegates 1:1; Devconnect will be used to share progress and gather input. Until the new model is live, the Foundation won’t endorse new proposals (except Up Labs’ protocol upgrades); active items will continue if aligned with growth priorities, including the Delegate Accelerator, Ecosystem Growth Council, Community Council, Carroll Mechanisms research, Security Subsidy Program, Governance Contribution Recognition, and Treasury Management (now syncing with Avantgarde). The Community Team will serve as the DAO point of contact during the transition.


### **Introducing Community Grants Support Program**

Carla (with Juansito, Gabriella Mena, Joey, and mimetista.eth) [announced](https://forum.scroll.io/t/introducing-community-grants-support-program/1164) a 3-month Community Grants pilot run by the Community Council to fund grassroots growth: events, meetups, hackathons, and “flex” initiatives. Budget: SCR 312,500; individual grants from $200–$10,000 (paid in USDC on Scroll). Applications are rolling via the form; the Council targets 7 days for review/feedback and ≤30 days to decide, with initial payment within 7 days of approval. Funded work must finish by Jan 31, 2026, with a short final report (attendance, product interactions, media, KPIs). Light compliance: KYC/KYB only for grants >$2k, AML statement via the form, no grant agreements. Focus areas include onboarding to ecosystem products (e.g., ether.fi Cash, SynthOS, Polystream, HoneyPop, ChatterPay) and sourcing founders for Open Economy. The Council will publish rationales on the forum and a program close-out report measuring reach, engagement, deployments, and regional diversity.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 22.9 at 16:00.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/jug-nayw-gtt) - on 25.9 at 17:30.