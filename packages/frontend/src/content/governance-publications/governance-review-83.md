---
title: "Governance Review #83"
description: "January winds down, but governance keeps moving."
publishedOn: "2026-01-26"
authorId: manuel-gonzalez
---

## **TL;DR**

On **Optimism**, governance is focused on execution and budget alignment. Delegates are voting on a midterm adjustment that increases the Season 9 operating budget by 2.3M OP, using the already-approved framework. In parallel, Upgrade 18 proposes incremental but meaningful OP Stack improvements, including Custom Gas Token v2, simplified dispute game deployments, and added redundancy in fault proofs, while early data from Season 8 grants shows mixed but measurable TVL impact.

On **Arbitrum**, the main operational update is: support for several third-party tools on Arbitrum Nova will end in January 2026. While user funds are unaffected and alternatives are available, the change raises questions about migration effort and Nova’s longer-term role within the Arbitrum ecosystem.

**Elsewhere**, governance remained relatively quiet. There is not new proposals or major developments, with discussions expected to resume through regular calls and office hours.


## **Optimism**


## **Active Votes**

[DAO Operating Budget Midpoint Adjustment](https://vote.optimism.io/proposals/90461331582020793688238982250421684861779485617457706850600231080358458423724) - ends on January 28 at 18:58 UTC.

[Season 9 Governance Fund Mission: Developer Advisory Board](https://vote.optimism.io/proposals/68179754159926555754192099277443085247300962756075666550018167063160158275507) - ends on January 28 at 18:58 UTC.

[Season 9 Governance Fund Mission: Grants Council](https://vote.optimism.io/proposals/20323926184780688851014762438202520912959297611775969703534861738050572508734) - ends on January 28 at 18:58 UTC.

[Proposal to Align OP Token with Superchain Success](https://vote.optimism.io/proposals/87361578787676343742924242917671200086664358805816521220096877302391945572241) - ends on January 28 at 18:58 UTC.


### **Proposed Midterm Adjustment for Seasons 8 and 9 Operating Budget**

Danelund.eth [shared](https://gov.optimism.io/t/proposed-midterm-adjustment-for-seasons-8-and-9-operating-budget/10575) a non-binding proposal for a midterm adjustment to the DAO Operating Budget for Seasons 8 and 9, following a review by the Budget Board. The proposal recommends increasing the Season 9 operating budget by 2.3M OP, bringing the combined Season 8 and 9 total to approximately 6.74M OP. The adjustment follows the same framework used in the original budget, based on trailing twelve-month ETH revenue and an updated six-month OP–ETH TWAP, and applies only prospectively to Season 9.

The additional allocation would be distributed across Councils and Boards using the same proportions as the initial budget. The Budget Board notes that this increase is offset by lower-than-expected Mission spending, with actual allocations in Seasons 8 and 9 averaging around 6.06M OP per season, compared to earlier assumptions of 10.5M OP, keeping overall spending aligned with the original budget framework.

**L2BEAT’s take**

This is basically a budget adjustment rather than a change in direction. The proposal increases the Season 9 operating budget by 2.3M OP using the same framework that governance already approved, based on updated revenue and price data. It applies only to Season 9, which helps avoid reopening past decisions made in previous iterations.

At the same time, the increase is partly balanced by lower Mission spending than originally expected. That makes this feel more like an alignment with how funds are actually being used, rather than a push to expand scope. Still, it will be worth keeping an eye on how operating costs evolve as governance continues to move toward a more execution-focused model.


### **Upgrade 18 - Custom Gas Token v2 and Kona Proofs**

Paul Dowman from OP Labs has [proposed](https://gov.optimism.io/t/upgrade-18-custom-gas-token-v2-and-kona-proofs/10576) Upgrade 18, a protocol upgrade to the OP Stack that introduces three main changes: Custom Gas Token v2, a refactor of dispute game deployments, and the addition of a second fault-proof implementation called Kona. Together, these updates aim to improve flexibility, deployment efficiency, and redundancy in the fault-proof system, without changing assumptions for standard OP Stack chains that continue to use ETH as the gas token.

Custom Gas Token v2 allows newly deployed OP Stack chains to use assets other than ETH for gas, enabling alternative fee models such as stablecoin-based gas while keeping the feature gated behind a deployment-time flag. The dispute game refactor simplifies the deployment of fault-proof contracts across chains, reducing operational overhead and gas usage. Finally, the introduction of Kona adds a Rust-based fault-proof implementation alongside Cannon, increasing diversity in the proof system, though it is not yet set as the default. Mainnet activation is planned after February 5, 2026, following completed audits and testing

**L2BEAT’s Take**

Overall, these are sensible, incremental upgrades that aim to increase flexibility for builders, reduce operational complexity for chain operators, and improve resilience in the fault-proof layer.

Custom Gas Token v2 will allow new OP Stack chains to use assets other than ETH for gas. At the same time, it’s worth noting that CGT v2 is not compatible with legacy CGT chains and currently lacks a migration path, raising open questions about long-term support and upgradeability for chains already using the earlier model. The dispute game refactor and the addition of Kona alongside Cannon both move toward standardization and redundancy, reducing per-chain overhead and avoiding single points of failure. We’re reviewing this upgrade with our research team to better understand any new risks it may introduce and will follow up as we dig deeper into the implementation ahead of activation.


### **S8 Grants Council Impact Analysis**

Optimism [shared](https://gov.optimism.io/t/s8-grants-council-impact-analysis/10584) an impact analysis of Season 8 Grants Council TVL grants to help inform funding decisions for Season 9. So far, 1.8M OP has been distributed, with an estimated $3.0M in attribution-adjusted TVL growth, translating to about $1.7 in TVL per OP delivered. In total, 6.3M OP was approved across 23 projects, which also attracted at least $1.6M in additional co-incentives.

Results are mixed across recipients, with some projects seeing positive inflows and others declining after grants were delivered. The analysis uses conservative attribution to account for overlapping incentives and market effects, and will be updated as more grants are paid out and longer-term data becomes available.


## **Arbitrum**


### **Updated Tooling for Arbitrum Nova in 2026**

Arbitrum Foundation [announced](https://forum.arbitrum.foundation/t/updated-tooling-for-arbitrum-nova-in-2026/30430) that starting January 31, 2026, several third-party tools will no longer be supported for Arbitrum Nova environments. The affected services include Alchemy, Nova Arbiscan (nova.arbiscan.io), and Tenderly. This change is limited to Nova and does not impact Arbitrum One or other Arbitrum chains.

Nova users and builders are advised to migrate their infrastructure dependencies before the deadline to ensure continued operation. Arbitrum shared a list of alternative providers covering core needs such as RPC access, block exploration, and webhooks, including Blockscout, Allnodes, and Quicknode. Importantly, user funds and on-chain assets on Nova are not affected by this tooling update and remain fully accessible.

**L2BEAT’s Take**

This update is presented as a tooling change, but it naturally raises questions about Arbitrum Nova’s longer-term direction. More broadly, what role does Nova play in Arbitrum’s roadmap going forward, and should builders expect further shifts in how Nova is supported compared to other Arbitrum chains?

These are questions worth addressing, and we plan to engage in the forum to better understand the intended direction.

**Upcoming events**

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 27.01 at 17:15 UTC.


## **ZkSync**

ZkSync's governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Upcoming events**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 28.01 at 16:30 UTC.


## **Everclear**

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming events**

[Everclear Delegates Call](https://meet.google.com/djd-nrkz-sak) - on 29.01 at 14:00 UTC. 


## **Uniswap**

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming events**

[DEF Community Call](https://meet.google.com/kjb-tgss-skw) - on 27.01 at 17:00 UTC.


## **Scroll**

Scroll’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 28.01 at 15:00 UTC.


## **Quiet corner**

Some ecosystems didn’t see any meaningful governance activity over the past week.

This week, **Hop,** **Starknet**, **Lisk**, **Polygon,** and **Wormhole** had no proposal to vote on or notable governance updates. As always, if you think we missed something important, feel free to reach outwe’re happy to dig deeper.

**Discuss with L2BEAT**

You can find us to discuss everything related to these governance ecosystems, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.