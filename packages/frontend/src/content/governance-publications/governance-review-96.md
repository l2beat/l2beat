---
title: "Governance Review #96"
description: "Fees, Fixes, and Funding Mixes."
publishedOn: "2026-05-26"
authorId: manuel-gonzalez
---



## **TL;DR**

*In* ***Arbitrum***, *governance discussions focused on protocol security, operational sustainability, and treasury management. The Security Council executed an emergency action to patch a governance vulnerability affecting the L1 Timelock contract, while the Arbitrum Foundation introduced a major proposal requesting continued DAO funding through 2027. At the same time, Firestarters officially moved into its final stretch with only two remaining grant deliverables still in progress.*

*In* ***ZKsync***, *governance activity centered around token mechanics, staking infrastructure, and institutional expansion. New discussions explored additional protocol-level fee mechanisms tied to Gateway settlements and operator participation, while the Season 1 staking pilot exceeded its governance participation targets before being paused for redesign ahead of decentralized sequencer plans. ZKsync also continued expanding institutional outreach through the Prividium Roadshow and launched new tooling to improve transparency around capped minter deployments and token programs.*

*In* ***Optimism***, *the Grants Council closed Season 9 with 38 applications reviewed throughout the season and several new grants approved in the final cycle, including Gauntlet, Re7, Alchemix, and Centrifuge. The final report also highlighted the growing role of AI-assisted filtering and operational review processes within the grants pipeline, alongside the announcement that Gonna.eth will step down as Grants Council Lead after this season.*

***Elsewhere***, *Polygon proposed major gas repricing changes ahead of the Chicago hard fork, aiming to better align execution costs with validator resource usage and proof-heavy workloads.*


---


## **Active votes**

**Arbitrum:**




* [AIP: Amended Release of Frozen ETH Pursuant to Court Order](https://alt.gov.arbitrum.foundation/proposal/71236395575275509514809232906539225896862899916501711888027988560774655719183?govId=eip155:42161:0xf07ded9dc292157749b6fd268e37df6ea38395b9) - ends on May 28 at 22:44 UTC.

**Uniswap:**

* [Protocol Fee Expansion: Vote 3](https://www.tally.xyz/gov/uniswap/proposal/96) - ends on May 30 at 04:02 UTC.
* [Return 12.5M Delegated Tokens to the Governance Timelock](https://www.tally.xyz/gov/uniswap/proposal/97) - ends on May 30 at 04:02 UTC.


---


## **Optimism**


### **Season 9 Final Report**

Gonna.eth [published](https://gov.optimism.io/t/season-9-final-report/10685) the final report for Optimism’s Season 9 Grants Council, summarizing application activity, funding decisions, and operational outcomes across the season.

The report notes that 38 applications were submitted during Season 9, with 12 grants ultimately approved through the review pipeline. In the final review cycle, projects including Gauntlet, Re7, Alchemix, Centrifuge, and OPLYN received funding approvals, while several other applications were declined either by the Grants Council or through the initial AI-assisted filtering process. The update also highlights the role of GrantNerds and reviewers in maintaining operational oversight and concludes with Gonna.eth announcing this will be their final season serving as Grants Council Lead.


---


## **Arbitrum**


### **Security Council Emergency Action – 24/05/2026**

The Arbitrum Security Council [executed](https://forum.arbitrum.foundation/t/security-council-emergency-action-24-05-2026/30910) an emergency action to mitigate a vulnerability affecting the L1 Timelock contract within Arbitrum’s governance system.

The issue stemmed from the renounceRole() function inherited by the timelock contract, which allowed unauthenticated L2-to-L1 messages to remove the bridge’s PROPOSER_ROLE. If exploited, the vulnerability could have prevented future constitutional governance proposals from executing. According to the Security Council, no funds were ever at risk, and any exploit attempt would still have faced a seven-day delay period during which mitigation could occur.

To neutralize the issue, the Security Council approved a targeted bridge-level restriction blocking the specific malicious payload from executing. A permanent smart contract fix is expected to be included in a future ArbOS upgrade.


### **Continued Funding for the Arbitrum Foundation**

The Arbitrum Foundation [introduced](https://forum.arbitrum.foundation/t/continued-funding-for-the-arbitrum-foundation/30908) a proposal requesting continued DAO funding to support its operations and ecosystem initiatives through 2027.

The proposal requests $16M in RWAs and stablecoins, 1,740 ETH, and 230M ARB to fund technical infrastructure, ecosystem growth programs, partnerships, governance support, and operational expenses after the Foundation’s original allocation under AIP 1.1 expires. The Foundation argues that its role as a cost center and ecosystem coordinator has helped drive Arbitrum’s growth across transactions, stablecoin adoption, RWAs, and DAO revenue generation, while also highlighting planned cost reductions and treasury management improvements for the coming year.


### **Firestarters - April Monthly Update**

OpCo [shared](https://forum.arbitrum.foundation/t/firestarters-april-monthly-update/30852) an update covering the final two ongoing grants under the Firestarters program, which has already officially concluded following the publication of its retrospective report.

The remaining active grants include a yield and risk intelligence dashboard by Today in DeFi focused on improving transparency around DeFi yields on Arbitrum, and a research initiative by LamprosDAO studying how stablecoin activity contributes to sequencer revenue. Both projects remain in progress as part of the program’s final deliverables.


---


## **ZKsync**


### **ZKsync Explores New Protocol-Level Fee Mechanisms Beyond Interop Fees**

Keating [shared](https://forum.zknation.io/t/beyond-interop-fees-potential-new-protocol-fee-mechanics/994) a research proposal exploring additional protocol-level fee mechanisms that could be introduced within the ZKsync ecosystem beyond the upcoming interop fee model.

The discussion focuses on three potential fee structures: per-transaction operator fees on Gateway settlements, staking requirements for ZK Chain operators, and custom proof-related


### **ZKsync Reviews Results of Season 1 Staking Pilot Program**

Keating [shared](https://forum.zknation.io/t/season-1-review-zknomics-staking-pilot-program/992) a review of Season 1 of the ZKsync Staking Pilot Program, outlining participation metrics, governance impact, and lessons learned from the three-month initiative.

The pilot reached a peak of 355M ZK staked across more than 4,300 addresses and increased active delegated voting power by roughly 205M ZK, surpassing the program’s governance participation target. The report also highlights that L2BEAT received the largest amount of delegated voting power through the program. Following Season 1, the program administrators decided to pause Season 2 in order to redesign the staking architecture around future decentralized sequencer plans, institutional participation, and improvements to APR management and delegation distribution.


### **Prividium Roadshow H1 2026 Preliminary Update**

Bendob [shared](https://forum.zknation.io/t/prividium-roadshow-h1-2026-preliminary-update/995) a preliminary H1 2026 update covering the progress of the ZKsync Prividium Roadshow program and its institutional outreach efforts.

The report highlights more than 20 events attended across North America, Europe, Latin America, and Asia, alongside several institutional partnerships and policy-focused engagements tied to Prividium’s privacy-preserving blockchain infrastructure. Key developments include the announcement of the Cari Network with regional U.S. banks, a strategic partnership with BitGo, and increased participation in institutional and regulatory forums aimed at expanding ZKsync’s presence within traditional finance.


### **New: ZKsync Token Program Minter Overview & Deployment Interfaces**

Shelby [announced](https://forum.zknation.io/t/new-zksync-token-program-minter-overview-deployment-interfaces/990) the release of new tooling designed to improve transparency and accessibility around ZKsync’s Token Program capped minter system.

The new mainnet and testnet interfaces provide human-readable dashboards for monitoring active token program minters, visualizing relationships between minter contracts, and simplifying deployment workflows that previously required technical inputs such as raw timestamps and uint values. The tooling aims to make token mechanics and capped minter infrastructure easier to understand and interact with for delegates, governance participants, and ecosystem contributors.


# 

---
## **Polygon**


### **PIP-88 : Cold-Storage and Precompile Gas Repricing**

Parvez03 [introduced](https://forum.polygon.technology/t/pip-88-cold-storage-and-precompile-gas-repricing/21897) PIP-88, a proposal that outlines significant gas repricing changes for Polygon PoS as part of the upcoming Chicago hard fork.

The proposal increases gas costs for cold storage operations and several cryptographic precompiles, including BN254, BLS12-381, and blake2F operations, which Polygon argues are currently underpriced relative to their actual execution cost on validator hardware. According to the proposal, the changes aim to better align gas pricing with network resource consumption, reduce worst-case validation times, and improve fee market efficiency as Polygon continues optimizing for higher throughput and proof-heavy workloads.



---
## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.



* **Everclear**
* **Hop**
* **Lisk**
* **Scroll**
* **Wormhole**
* **Uniswap**
* **Starknet**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---


## **Upcoming Events**

**Scroll**



* [Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 27.05 at 14:00 UTC.
* [Scroll DAO Office Hours](https://meet.google.com/dcv-rodm-dfd) - on 29.05 at 14:00 UTC.

**ZKsync**



* [Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 27.05 at 15:30 UTC.

**Hop**



* [Hop Community Call](https://discord.com/login?redirect_to=%2Fchannels%2F789310208413270078) - on 13.05 at 17:00 UTC.


---


## **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.