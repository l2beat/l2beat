---
title: "Governance Review #49"
description: "Governance activity remains high as we approach the end of the month."
publishedOn: "2025-04-28"
authorId: manuel-gonzalez
---


## **Optimism**


## **Active Votes**

[Maintenance Upgrade: Absolute Prestate Updates for Isthmus Activation & Blob Preimage Fix](https://vote.optimism.io/proposals/105196850607896626370893604768027381433548036180811365072963268567142002370039) - ends on May 1 at 18:25 UTC.

[Season 8 and 9: Budget Board Member Ratification](https://vote.optimism.io/proposals/91828175807003897805022589352934414611981179534075907474227649658339164272992) - ends on April 30 at 19:35 UTC.


### **Upgrade Proposal #15a - Absolute Prestate Updates for Isthmus Activation & Blob Preimage Fix**

Seb has [created a proposal](https://gov.optimism.io/t/upgrade-proposal-15a-absolute-prestate-updates-for-isthmus-activation-blob-preimage-fix/9869) that outlines a maintenance-only patch that locks in the Isthmus hard-fork go-time (Fri 9 May 2025 16:00:01 UTC) for OP Mainnet, Ink, Unichain and Base while sneaking in a fix for the recently-flagged “incorrect blob preimages” bug; the update replaces each chain’s absolute prestate with hash 0x0368…94b6, asks node operators (and batchers / challengers) to jump to op-geth v1.101503.4, op-node v1.13.2, op-batcher v1.12.0 and op-challenger v1.4.0, and provides pre-signed multisig payloads for the ProxyAdminOwners so the whole thing can roll out right after Ethereum’s Pectra upgrade on 7 May—keeping the Superchain perfectly in step and wiping the blob risk before it ever matters.


### **SuperStacks: Superchain'deki Ödüllere Yeni Bir Yaklaşım (Çeviri)**

ekizone [has shared a post](https://gov.optimism.io/t/superstacks-superchaindeki-odullere-yeni-bir-yaklasim-ceviri/9876) announcing the kicked-off of SuperStacks, a 16 April – 30 June 2025 pilot that doles out points (not guaranteed OP) to DeFi users who park liquidity in whitelisted pools of “interop-ready” tokens across multiple OP-Stack chains; the scheme—designed to road-test a scalable, transparent incentive engine before Superchain interoperability fully lands—starts with a curated set of trusted protocols, lets chains/protocols layer extra rewards on the same pools, and will iteratively tweak eligibility and payout logic as data and community feedback roll in, with the long-term hope of forging a unified, sustainable incentive framework that drives TVL, usage and network effects for the entire Superchain.


### **Cycle 36 Preliminary Review Results**

Gonna [has shared](https://gov.optimism.io/t/cycle-36-preliminary-review-results/9861) a post that outlines the Grants Council's preliminary review results for Cycle 36, highlighting that 21 new applications and five rollovers were received, with 12 projects passing to the Final Review stage and two pending; the minimum score required was 7. A total of 4,143,333 OP was requested by finalists, far exceeding the council's available 386,000 OP budget, while audit requests amounted to 1,624,752 OP against a 417,134 OP budget. Selected projects are evaluated based on their potential to grow TVL within the Superchain, focusing on stablecoin, wrapped asset, and bridged asset growth. Applicants have until Monday to address reviewer feedback, with final decisions expected by May 1st.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://l2beat.com/governance/publications/meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Grants Council Office House](meet.google.com/vkn-qnwy-qqy) - on 29.4 at 17:30.

[govNERDs Community Office Hours](meet.google.com/eqb-dfkk-mui) - on 29.4 at 19:00.


## **Arbitrum**


### **STEP 2 Committee Preferred Allocations**

Entropy [has created](https://forum.arbitrum.foundation/t/step-2-committee-preferred-allocations/29086) a post on behalf of the STEP 2 Committee to share their preferred allocations for the Arbitrum DAO’s 2nd diversification round, where ~$10.66M ARB remains to be deployed into stable, liquid, and yield-bearing assets. After evaluating over 50 applications, the committee recommended allocating 30% to WisdomTree’s WTGXX, 35% to Spiko’s USTBL, and 35% to Franklin Templeton’s FOBXX (BENJI). According to their perspective, they stressed the importance of maintaining sizable allocations to avoid diluting strategic value, highlighted the need for Arbitrum to build stronger RWA onramps despite compliance hurdles, and explained that selection weighed factors like fees, risk, organic traction potential, and community fit. Applicants not selected were encouraged to reapply in future rounds. The final proposal will move to Snapshot for ratification on May 1st.


### **In-Chain SQL Database for Arbitrum Orbit**

Dennison [has created](https://forum.arbitrum.foundation/t/arbitrum-obrit-in-chain-sql-database-for-arbitrum-orbit/29118/1) a post to build an in-chain SQL database for Arbitrum Orbit rollups, aiming to eliminate the need for external indexers like The Graph or Postgres and simplify app development. By compiling DuckDB into WASM and exposing SQL operations directly through Solidity, Stylus, and JSON-RPC, developers would be able to natively run queries and updates on-chain, achieving fast reads and reasonable gas costs—all from a single Nitro binary. This would allow developers to build fully decentralized apps where smart contracts, frontends, and databases interact seamlessly, enabling "backend-native money custody" and supercharging the appchain thesis. Dennison outlined goals, a high-level architecture, expected benefits like fraud-proof queries and zero off-chain dependencies, and raised open questions around database engine choice and data format.


### **ARDC Communication Thread - Role update**

Entropy [created a post](https://forum.arbitrum.foundation/t/ardc-communication-thread/28279/26?u=manugotsuka) announcing that, after careful review, the ARDC Supervisory Council decided to consolidate the communications role under @JuanRah, who had already handled most of the workload. With the departure of Frisson and no explicit mid-term replacement procedure outlined in the original ARDC V2 proposal, all parties agreed that maintaining continuity by having JuanRah take over entirely was the best solution. To reflect the increased responsibilities—translating research updates, coordinating stakeholder communication, hosting bi-weekly community calls, and managing social media—JuanRah’s compensation was increased from 5,000 ARB to 8,750 ARB monthly. The post also invited the community to a Twitter Space on April 30th discussing recent governance attack research. It reminded delegates that the next ARDC Bi-Weekly Hours will occur on May 2nd.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://l2beat.com/governance/publications/meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[SOS Discussion #7](https://huddle01.app/room/csa-vnmj-cyy) - on 28.4 at 15:00.

[SOS Discussion #8](https://huddle01.app/room/lep-rqzl-eyo) - on 30.4 at 14:00.

[Treasury Management Committees Discussion](https://huddle01.app/room/jzo-swjy-ooo) - on 30.4 at 16:00.

[X Space - ARDC Research on Governance Attacks](https://x.com/i/spaces/1yNxaLndQEdJj/peek) - on 30.4 at 17:00.

[SOS Discussion #9](https://huddle01.app/room/bja-aoiv-hzr) - on 2.5 at 13:00.

[Bi-Weekly ARDC Office Hours](meet.google.com/ras-qcrd-dqz) - on 2.5 at 16:00.


## **Uniswap**


## **Active Votes**

**Onchain**

[Establish Uniswap v4 Licensing Process](https://www.tally.xyz/gov/uniswap/proposal/85) - ends on April 30 at 06:30 UTC.

**Temp-check**

[UAC Renewal S4](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0x629995d68efbfea149bbd4fdc35cfcacca9bd327e3cbf1382fd6753df583e890) - ends on April 28 at 15:45 UTC.

[Approved Budgets Rebalancing (S4)](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0xaf7a6894af35b3a71cd7222d4a17ef2ef85ff8ffb3f02be8c7e6e9dec548f9bf) - ends on April 28 at 15:45 UTC.

[[Temp Check/Revised] Treasury Delegation Round 2](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0x46fef087a43555e156db287d370151a76e19e1e2cd7d36f442409987f93d4215) - ends on April 29 at 16:21 UTC.


### **Uniswap Growth Program Trial Recap**

AlphaGrowth [created a post](https://gov.uniswap.org/t/uniswap-growth-program-trial-recap/25488) recapping the Uniswap Growth Program Trial, highlighting its work in business development, marketing, and ecosystem support over the past 6 months. During the trial, the team secured over $4.8M in external incentives from ecosystems like Boba, Celo, BOB, Saga, Optimism, and zkSync, deployed $950K+, resulting in $10M+ in incremental TVL, and achieved 4M+ impressions on the @growuniswap account. They also produced 13 episodes of the "Ungovernable" series, reaching 1.3M cumulative views. Initiatives included expanding Uniswap LP token utility, launching UNI markets on Unichain, and building a strong BD pipeline with partners like Circle and Brave. In general, the report highlighted strong marketing traction and ecosystem support. It hinted at plans for expanding livestream content if the program is renewed, with a formal renewal proposal coming soon.


### **[RFC] Uniswap Growth Program Renewal**

Alphagrowth [created a post](https://gov.uniswap.org/t/rfc-uniswap-growth-program-renewal/25496) that outlines the renewal and expansion of the Uniswap Growth Program after a successful 6-month trial. During the trial, the program secured nearly $5M in external incentives, deployed $950k+, drove $10M+ in incremental TVL, hit 4M+ social media impressions, and launched the Ungovernable series with nearly 1.5M views. The renewal aims to expand beyond crypto-native audiences by pursuing Embedded DeFi integrations, conducting Ecosystem Fund Research to support v4 builders, and strengthening DeFi Operations by launching new markets and increasing TVL retention. The proposed budget is $1,148,000 over one year, with quarterly accountability updates and a strong focus on sustaining Uniswap’s role as the liquidity layer of the internet. A Snapshot vote will follow after community feedback.


### **Scaling V4 and Supporting Unichain**

GFX Labs has [shared a post](https://gov.uniswap.org/t/scaling-v4-and-supporting-unichain/25484) suggesting that the Uniswap DAO fund the integration of Uniswap V4 into the Oku platform, support adding Unichain to Oku, and grant GFX Labs a blanket license exemption for future V4 deployments. They request $250K for building V4 infrastructure and $90K annually to cover Unichain operational costs. GFX Labs, which previously expanded Uniswap's footprint to 30+ chains, plans to deliver a complete V4 interface within two months and Unichain support within two weeks. They aim to simplify V4 liquidity management, support hook developers, improve LP experience, and deepen trader engagement, helping Uniswap maintain its lead as the dominant DEX in a rapidly evolving DeFi landscape.


### **[RFC] Lens Chain Application for Canonical Uniswap V3 Deployment**

Defispartan [posted](https://gov.uniswap.org/t/rfc-lens-chain-application-for-canonical-uniswap-v3-deployment/25508) that the Uniswap DAO officially recognizes the already deployed Uniswap V3 contracts on Lens Chain as canonical. Lens Chain, built using the zkSync stack and optimized for SocialFi applications, offers gasless, USD-rail-enabled, high-performance onboarding. By embracing this deployment, Uniswap would expand into a growing SocialFi ecosystem, boosting protocol usage and liquidity in a new user base. Contracts are deployed and owned by the Uniswap DAO timelock, and frontend integration via oku.trade is expected to go live by April 28. No incentives or funding are requested with this proposal — it's purely for recognition, with possible future proposals for incentives.


### **[RFC] Deploy Uniswap V3 on XDC Network**

0xbeny [created a post](https://gov.uniswap.org/t/rfc-deploy-uniswap-v3-on-xdc-network/25489) that the Uniswap DAO recognizes the recent deployment of Uniswap V3 on the XDC Network as canonical. The deployment is already completed, and the DAO requires no further action. XDC, a hybrid blockchain optimized for institutional finance, offers near-zero gas fees, high throughput, and ISO 20022 compliance, making it ideal for Real-World Asset (RWA) integration. Deploying Uniswap on XDC aims to merge DeFi-native yields with RWAs like Private Credit and Trade Finance, offering stable liquidity sources and bridging institutional capital to DeFi. Contracts are fully deployed and ownership has been transferred to Uniswap DAO governance, with frontend support through Oku and bridging facilitated by Wormhole.


### **[RFC] Atomic Update of LP Price Range — Protocol Feature Proposal for Future Version (v5+)**

mbendary [created a post](https://gov.uniswap.org/t/rfc-atomic-update-of-lp-price-range-protocol-feature-proposal-for-future-version-v5/25517) introducing a new protocol feature idea for future versions of Uniswap. The proposal suggests adding a core function called updateLPPriceRange, allowing liquidity providers to adjust their position's active price range in a single atomic transaction, instead of the current two-step burn and mint process. This change would improve operational robustness, avoid forced crystallization of impermanent loss, and reduce gas costs by 30–50%. Feedback from Uniswap Labs, governance delegates, LPs, and contributors is actively encouraged, and the full technical proposal is available on GitHub. No governance vote is planned yet — this is an early-stage call for discussion and input.


### **Trial run a Technical Advisory Board (TAB)**

Jengajojo [has created a post](https://gov.uniswap.org/t/trial-run-a-technical-advisory-board-tab/25518) offering a 12-month pilot of a Technical Advisory Board (TAB) within the Uniswap DAO. The TAB would consist of 6 experienced developers and security researchers providing expert technical assessments of governance proposals. A Professional Delegate (PD) from DAOplomats would assist the board operationally. 2.5M UNI would be delegated to a multi-signature wallet controlled by the TAB members to empower the TAB. The proposal outlines the structure, responsibilities, timeline, and a budget of 41,800 UNI (including UNI and USDC payments). The goal is to improve technical rigor in governance decisions while improving community trust and long-term protocol sustainability. Community feedback is requested before moving to a vote.


### **[RFC] Analytics Hub for Uniswap’s Revitalization and Growth Program**

Doo_StableLab [shared a post](https://gov.uniswap.org/t/rfc-analytics-hub-for-uniswaps-revitalization-and-growth-program/25493) that outlines extending Forse’s analytics work to evaluate 4 more chains under Uniswap’s incentives program. Forse, developed by StableLab, offers deep, data-driven insights on DeFi growth metrics. The goal is to expand the existing Uniswap Incentives terminal, building on previous Arbitrum, Base, Blast, and Scroll analyses. Methods include time-series analysis, user cohort tracking, efficiency benchmarking, and rewards flow mapping. The team requests $60,000 in UNI, payable upon delivery by the end of Q2 2025, to ensure accountability.


### **Uniswap Foundation: Summary FY’2024 Financials**

Nataliara [created a post](https://gov.uniswap.org/t/uniswap-foundation-summary-fy-2024-financials/25486) sharing an update on the Foundation’s unaudited financials for ending 2024. The report highlights that the Foundation ended the year with $29.8M in cash/stables and 0.59M UNI in reserves, with funding earmarked for grants and operations through 2025. In 2024, the Foundation committed $14.8M to new grants and disbursed $9.9M, spanning Protocol Innovation, Developer Growth, Governance, Research, and Security initiatives. Notable achievements include onboarding over 800 developers, launching Unichain and Uniswap v4, and progressing key governance and security improvements. Operating expenses totaled $5.79M, with an additional $1.11M realized in revenue. The following report will be about Q1 2025.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**


### **PFP-04: Update to CTB Member List**

kb17 [created a post](https://forum.polygon.technology/t/pfp-04-update-to-ctb-member-list/20909) announcing an update to the Polygon Community Treasury Board (CTB). The proposal suggests removing Ajit Tripathi, who stepped down due to other work commitments, and appointing Mashal Waqar as his replacement. Mashal brings deep experience in grants management, ecosystem development, and governance, aiming to improve grant distribution and builder support at Polygon. A detailed bio was provided in the PFP-04 GitHub submission, and barring major community concerns, Mashal’s onboarding will proceed in the coming weeks.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**

Starknet’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


## **Active Votes**

[Executable EGP 32 - Establishing a Buffer Multisig for Sub-DAO Reward Discrepancies](https://snapshot.box/#/s:dao.connext.eth/proposal/0x02da4da6e4e0f0cb8e9aecd8136a9c9bd3e63dadd94a6ae252020939a8180b68) - ends on May 2 at 17:39 UTC.


### **MSS Funds Clawback**

**SEEDGov** [shared a post](https://forum.connext.network/t/mss-funds-clawback/1375) informing the DAO about upcoming fund recoveries from 3 multisigs, where circumstances no longer justify holding funds outside the treasury. The clawbacks involve: (1) Liquidity Task Force (2,097,612.3 NEXT) due to the end of its mandate and lack of extension consensus, (2) Nebula Marketing Collaboration (1,870,868.3 NEXT) after the formal cessation of collaboration with the Foundation, and (3) Inverter Network &lt;> Connext Partnership (240,000 NEXT) due to delays and misalignment with protocol direction. Next steps include submitting clawback transactions and coordinating with multisig signers unless the community raises objections.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Blockworksresearch [posted an announcement](https://forum.wormhole.com/t/wormhole-community-call-may-2nd-12pm-est-2025/741) about a Wormhole Community Call on May 2nd. Topics will include the recent launch of MultiGov (multichain governance contracts) and other news. The call is scheduled for Friday, May 2, 2025, from 12:00 to 1:00 PM EST.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Wormhole Community Call](https://meet.google.com/gda-psqp-zkr) - on 2.5 at 16:00.


## **Lisk**


## **Active Votes**

**Onchain**

[Onchain Market Making for $LSK on Ethereum via Arrakis PALM](https://www.tally.xyz/gov/lisk/proposal/104491616640851060908912969330100781751660696512219643195852309797072404571003) - ends on April 29 at 14:24 UTC.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


### **Standing Delegate Call April 29 - Thread**

TheShelb [posted a thread](https://forum.zknation.io/t/standing-delegate-call-april-29-thread/659) to coordinate discussion topics for the upcoming ZKsync Delegate Call scheduled for Tuesday, April 29th. Delegates are invited to suggest topics and upvote others' suggestions to shape the agenda collaboratively. A tentative agenda includes proposal updates and TPP Builder presentations featuring Factory Labs and Areta. The final agenda details will be posted on the day of the call.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](https://meet.google.com/txe-trwh-zha ) - on 29.4 at 16:00 UTC.


## **Scroll**


### **Ecosystem Growth Request for Ideas (RFI)**

Eugene from the Scroll Foundation [posted an announcement](https://forum.scroll.io/t/ecosystem-growth-request-for-ideas-rfi/624) to guide the next steps for Scroll DAO’s ecosystem growth planning. After hosting initial brainstorming sessions, the DAO moves from high-level concepts to gathering more detailed community input through this RFI process. Submissions are open April 22–29, and ideas will be discussed during the April 30th governance call, aiming to formalize proposals by early May. Participants are asked to submit ideas (not full proposals yet), including a title, idea description, impact on ecosystem growth with examples, estimated budget in SCR, and involved parties.


### **Scroll Sustainable Liquidity Initiative**

jengajojo_daoplomats [posted a proposal](https://forum.scroll.io/t/scroll-sustainable-liquidity-initiative/631) that suggests launching a long-term phased liquidity mining program where participants earn SCR tokens by providing liquidity to selected DEXs and pools. Rewards would be distributed proportionally and subject to vesting to promote long-term commitment. The initiative would adapt across multiple phases based on ecosystem needs, supporting new listings, growth projects, and innovative mechanisms. It proposes a 5,000,000 SCR budget for the first year, with DAO-selected delegates managing deployment and optimization. The Scroll DAO and the Scroll Dev Team would execute and monitor the program.


### **Votable Supply Adjustment Proposal**

Eugene from the Scroll Foundation [created a post](https://forum.scroll.io/t/votable-supply-adjustment-proposal/628) that outlines a temporary delegation of 1.5M SCR from the Scroll DAO treasury to 46 active delegates to strengthen governance participation and reduce the risk of missing quorum on key votes. The initiative will run until October 2025 and will be managed by a Foundation multisig, with ongoing checks to remove delegation from inactive delegates. The goal is to ensure the DAO can maintain healthy governance even if top delegates are unavailable.


### **NuMu Mechanism to Increase Votable Supply**

ConnorMCMK [has shared a post](https://forum.scroll.io/t/numu-mechanism-to-increase-votable-supply/634) suggesting a simple, incentive-driven way to boost governance participation in Scroll DAO. Inspired by a suggestion from LauNuMu, the idea is to hold an annual Delegation Day where token holders who delegate their SCR receive an airdrop, scaled by the amount delegated. A bonus airdrop would reward those initially delegating to active, high-quality delegates in future years. Connor notes that this method is easy to implement, fair to all holders, and mirrors successful models like Internet Computer’s governance incentives. They suggest using an exponential curve to determine airdrop size and invite feedback, while acknowledging concerns around costs, wallet-splitting incentives, and precedent from other DAOs.


### **Portugal Local Node - Regional Evaluation**

PauloGouveia [created a post](https://forum.scroll.io/t/portugal-local-node-regional-evaluation/629) presenting the launch of a Scroll Local Node in Portugal, highlighting Portugal’s emergence as a top European web3 hub due to its favorable regulations, vibrant community, and growing blockchain adoption. Key points include strong developer ecosystems in Lisbon and Porto, crypto-friendly rules aligned with EU MiCA standards, and strategic advantages such as international reach and existing Scroll-native projects like Quill Finance. The plan outlines structured workshops aimed at helping developers succeed in Scroll Open, fostering technical excellence, and setting up a local support structure for ongoing builder engagement.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Ecosystem Growth Discussion](meet.google.com/nug-uygx-hbd) - on 30.4 at 11:30.

[Delegate Training Call](meet.google.com/pcm-nxzr-rig) - on 30.4 at 17:00.
