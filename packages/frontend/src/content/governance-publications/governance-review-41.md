---
  title: "Governance Review #41"
  description: "ETH Denver slows down governance activity."
  publishedOn: "2025-02-24"
  authorId: manuel-gonzalez
---

## **Optimism**


### **Proposal Preview: Upgrading the Cannon Fault Proof VM to support 64-bit and multi-threading**

Pauldowman from OP Labs outlines a [proposal preview](https://gov.optimism.io/t/proposal-preview-upgrading-the-cannon-fault-proof-vm-to-support-64-bit-and-multi-threading/9690) to upgrade Cannon, the fault-proof VM in the OP Stack, to support a 64-bit MIPS architecture with multi-threading. By switching from MIPS32 to MIPS64 and enabling garbage collection, memory constraints that currently limit block sizes should be lifted, paving the way for higher gas limits on OP Stack chains like Base. The upgrade entails replacing on-chain and off-chain components but does not require a hard fork for node operators. Spearbit and Coinbase Protocol Security have performed audits. If approved, new dispute game contracts referencing the 64-bit VM would be deployed, allowing chains to grow block sizes without hitting VM memory limits.


### **Cycle 33 Preliminary Review Results**

Gonna.eth from the govNERD team has shared the preliminary [review results for Cycle 33](https://gov.optimism.io/t/cycle-33-preliminary-review-results/9665) of grant applications. Out of 35 submissions, 27 have passed the first screening with an average score of 6 or higher and move on to the Final Review phase. Altogether, these finalists request 13.74M OP, but the Grants Council has a total budget of 9.5M OP for this cycle. Ultimately, each grant is judged on its potential to increase Superchain TVL—measured in stablecoins, wrapped assets, and bridged assets—and final announcements are expected on February 27th.


### **Curia Forum Score Integration: Measuring Delegate Engagement Beyond Voting**

v3naru_Curia introduces the [Forum Score feature](https://gov.optimism.io/t/curia-forum-score-integration-measuring-delegate-engagement-beyond-voting/9681) for CuriaLab’s OP Governance Analytics Dashboard, aiming to quantify off-chain delegate engagement alongside on-chain votes. By tracking metrics like proposal creation, forum discussions, and time spent reading topics, it offers a more holistic measure of each delegate’s participation. All data is normalized through percentile scores and weighted by importance. Delegates can [link their forum activity](https://gov.optimism.io/t/public-forum-to-wallet-link-verification/9676) to their governance profiles for added transparency. Feedback on the scoring methodology, relevant forum categories, and user experience for linking accounts is requested to refine how governance contributions are recognized.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://l2beat.com/governance/publications/meet.google.com/pem-jzrh-gkq) every Tuesday at 4 pm UTC.

**Upcoming Events (Times in UTC):**

[Grants Council Office Hours]( https://meet.google.com/qwq-nygd-axw) - on 25.2 at 17:30.

[Joint House Community Call](https://meet.google.com/vme-ovto-jcn) - on 25.2 at 19:00.

[Delegate Onboarding Call (Monthly)](meet.google.com/bwy-qbcs-str) - on 25.2 at 20:00.


## **Arbitrum**


## **Active Votes**

**Onchain**

[Request to Increase the Stylus Sprint Committee’s Budget](https://www.tally.xyz/gov/arbitrum/proposal/27831845498978337986467036886891836384283300266814708262424272663046958396151?govId=eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) - ends on March 6 at 15:20 UTC

**Temp-check**

[AIP: ArbOS Version 40 Callisto](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x7cc26491a070c74c1a4ec5a9892571d31eb690015936a35b52c0d3a97bd5497f) - ends on February 27 at 23:00 UTC

[Arbitrum Audit Program](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xebbcad364ae7f02797b9cd7f30c668907d479d4bb5ba7f5d775849822297a01d) - ends on February 27 at 23:58 UTC


### **OpCo - Oversight and Transparency Committee (OAT) Application Process Overview**

Entropy [created a post](https://forum.arbitrum.foundation/t/opco-oversight-and-transparency-committee-oat-application-process-overview/28539) that outlines the rules for the OAT (Oversight and Transparency Committee) application process for OpCo.The OAT team will consist of three elected members by the DAO. These three members, alongside a non-voting Arbitrum Foundation observer, will select two additional members to complete the team (subject to DAO veto). The OAT's role is to ensure OpCo remains transparent and aligned with the DAO’s goals, including overseeing operations, finances, and key hires. Terms last 12 months, with the first term slightly extended to cover OpCo’s inception.


### **Request For Proposals: Arbitrum Treasury Diversification (STEP 2)**

Entropy has [created a post](https://forum.arbitrum.foundation/t/request-for-proposals-arbitrum-treasury-diversification-step-2/28500) announcing that STEP 2 applications are opened, with about $17M worth of ARB earmarked for stable, yield-bearing asset investments. This new round builds on lessons from STEP 1 and is managed by a committee of six members, including GFX Labs, Entropy Advisors, Karpatkey, Nethermind, and North Lakes Legal. 

The applicants must provide detailed information on legal structuring, bankruptcy protection, yield expectations, and how their offering could benefit the Arbitrum ecosystem. The best proposals focusing on stable, auditable, and operationally minimal RWA investments will be prioritized. The submission window closes on March 20, 2025, with final decisions proposed to ARB tokenholders by May 1.


### **[Constitutional] Increase resilience to outside attackers by updating DAO parameters to not count ‘Abstain’ votes in Quorum.**

Cupojoseph [created a post](https://forum.arbitrum.foundation/t/constitutional-increase-resilience-to-outside-attackers-by-updating-dao-parameters-to-not-count-abstain-votes-in-quorum/28545) that proposes excluding “Abstain” votes from quorum to bolster the DAO’s resilience against malicious or borderline proposals. Currently, “Abstain” votes count toward quorum, which can allow a proposal to pass despite limited active support. By removing “Abstain” from the quorum calculation, it would be more difficult for questionable proposals to scrape by and easier to defeat potential spam. The plan includes requesting an ARDC analysis on historical voting impacts, a Temp Check, and a technical implementation to update the governance contract accordingly if the DAO supports it.


### **GMC’s Preferred Choices for 7,500 ETH RFP**

Entropy has [created a post](https://forum.arbitrum.foundation/t/gmcs-preferred-choices-for-7-500-eth-rfp/28524) for the Growth Management Committee (GMC) to allocate 7,500 ETH from the Arbittrum’s Treasury among Lido, Aave, and Fluid. The objective is to generate low-risk yield while supporting key ecosystem partners. After checking 45 applications, the GMC proposes to deposit 5k ETH of Lido and receive 5k wstETH that earns around 3.2 % APR (with an additional 20% share), then supply this 5k wstETH to Aave V3 on Arbitrum to achieve around 4,54 % in yields. Finally, lend the remaining 2.5k ETH to Fluid to generate between 1%-2% yield while boosting liquidity for ETH-based DEX and lending. This strategy was reviewed by LlamaRisk, highlighting key risks that were satisfactorily mitigated. As with any other proposal, this idea must be voted on by the DAO, and if it is approved, the Arbitrum Foundation will begin deploying the 7,500 ETH accordingly. On the other hand, if it is rejected, the GMC will revise its allocations based on the community feedback.


### **TMC’s Proposed Allocations**

Threesigmaxyz has [created a post](https://forum.arbitrum.foundation/t/tmc-s-proposed-allocations/28522) that outlines the Treasury Management Committee (TMC) plan for allocating 25M ARB in one of the two proposals that they received:



1. Stablecoin Allocation (15M ARB): Convert ARB to stablecoins, managed equally among Karpatkey, Avantgarde & Myso, and Gauntlet, each receiving a 33% share.
2. ARB On-Chain Strategy (10M ARB): Deploy ARB directly into yield strategies, with Karpatkey and Avantgarde & Myso each handling 50%.

After evaluating the proposals, the TMC recommends voting YES on the stablecoin conversion and NO on the ARB on-chain deployment. The stablecoin plans meet TMC’s DAO alignment and risk management criteria, while the ARB proposals lack sufficient detail and yield potential. Each allocation will be voted independently, with results determining whether to proceed with the 15M stablecoin strategy and/or the 10M ARB strategy. If approved, a 3-month phase will follow for conversion, yield deployment, and subsequent performance reviews.


### **Delegate Incentive Program Results (January 2025)**

SEEDGov has [published the January 2025 ](https://forum.arbitrum.foundation/t/dip-v1-51a-delegate-incentive-program-results-january-2025/28494)Delegate Incentive Program (DIP) results, where 65 participants enrolled and 62 qualified for compensation. Across nine votes (8 on Snapshot, one on Tally), 48 delegates received rewards totaling $202,113.66. As always, the report breaks down delegates’ tiers, highlights bonus points earned for notable contributions and call attendance, and introduces nine new participants who will join after mandatory 1:1 calls next month. 


### **Arbitrum Security Subsidy Fund: Outcome Report**

Sid_Areta from the Arbitrum DAO Procurement Committee (ADPC) has [published an Outcome Report](https://forum.arbitrum.foundation/t/arbitrum-security-subsidy-fund-outcome-report/28479) on the Arbitrum Security Subsidy Fund (SSF), a pilot that offered $2.5M (in ARB converted to USDC) to subsidize audit costs for eligible projects. A total of 56 applications were received, with 22 projects eventually receiving subsidies for security services from a 9-provider whitelist. 

Notably, 36.4% of those grantees had never conducted an audit before, and around 78.6% said the fund either convinced them or reinforced their decision to build on Arbitrum. The ADPC used a “Means Test” scoring system to assess each project’s ecosystem impact, funding needs, and risk profile, ultimately disbursing $1.81M USDC (94.3% of the allocated funds).

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://l2beat.com/governance/publications/meet.google.com/jkj-nnop-arc) every Thursday at 4 pm UTC.

**Upcoming Events (Times in UTC):**

[Arbitrum Audit Program - Office Hours](meet.google.com/ixy-xecs-chu) - on 24.2 at 14:00.

[Arbitrum DAO in ETH Bucharest 2025]( https://us06web.zoom.us/j/85178435095) - on 24.2 at 15:00.

[Open Discussion of Proposals Governance Call](meet.google.com/hmg-pjcu-nuk) - on 25.2 at 16:00.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 25.2 at 17:15.

[DeFi Education Fund Community Call](meet.google.com/kjb-tgss-skw) - on 25.2 at 18:00.

[ADPC Call](meet.google.com/bju-dnib-sif) - on 27.2 at 15:00.


## **Uniswap**


## **Active Votes**

**Temp-check**

[[Temp Check] Uniswap Delegate Reward Initiative - Cycle 3](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0x0c7b3acc56ad1d276cd4c9338e2ef8ca9e15e8ab3e3a22d395fd34398bda40af) - ends on February 24 at 19:42 UTC.


### **Uniswap Foundation Security Fund (UFSF): Announcement Thread**

Fin_areta [posted an update](https://gov.uniswap.org/t/uniswap-foundation-security-fund-ufsf-announcement-thread/24878/7?u=manugotsuka) that reminds Uniswap builders that applications for Cohort-2 of the Uniswap Foundation Security Fund (UFSF) will close on March 5, 2025, 23:59 UTC. The UFSF can cover up to 100% of security audit costs for projects developing in the Uniswap ecosystem. It pairs successful applicants with top-tier auditors via a competitive marketplace, simplifying the audit process and improving protocol security. Several Cohort 1 recipients (like Lumisfi, Cork Protocol, and LIKWID.FI) cited credibility boosts and community trust as significant benefits. Builders interested in applying can do it [here](https://areta.fillout.com/cohort-2-projects).

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.

**Upcoming Events (Times in UTC):**

[DEF Community Call](meet.google.com/kjb-tgss-skw) - on 25.2 at 18:00.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.


## **Polygon**


### **Bor v2.0.0 release**

Sanket_Polygon from PolygonLabs [has announced Bor v2.0.0](https://forum.polygon.technology/t/bor-v2-0-0-release/20632), a new release for Polygon Amoy and Mainnet that brings several breaking changes and updates. By default, the parameter state.scheme now uses a path-based storage scheme (PBSS), and db.engine is set to pebble db, which may conflict with nodes previously using a hash-based storage scheme (HBSS) and leveldb. 

Operators wanting to maintain older settings must adjust these flags in their configuration. Beyond the storage shift, the release includes bug fixes, performance enhancements (such as an improved block execution timer and parallel EVM support), and additional housekeeping in the codebase. Node operators should stop Bor, upgrade via the provided script (version v2.0.0), verify the installation, and restart their services.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.


## **Starknet**


### **Cairo v2.10.0 is out**

FeedTheFed [announces Cairo 2.10.0](https://community.starknet.io/t/cairo-v2-10-0-is-out/115362), a compiler release that upgrades Sierra to v1.7.0—the version compatible with Starknet ≥ 0.13.4. This update primarily enables gas redeposits, a mechanism that refunds unused worst-case gas in Sierra-based contracts, and introduces the get_class_hash_at system call, letting contracts retrieve class hashes at specific addresses. Cairo 2.10.0 also includes initial client-side proving with Stwo, integrated via Scarb’s new “executable” target and commands.

These features align with Starknet’s upcoming upgrades, while more notable core library updates (like expanded iterator and option traits) will land in Cairo 2.11.0. Additionally, snforge_std no longer requires Rust compilation, reducing test setup time in Foundry, and the Scarb lint command now supports an expanding set of links to help maintain code quality.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.


## **Everclear**


## Active Votes

**Temp-check**

[Social EGP 21 - Code of Conduct - COI Policy and Responsible Voting](https://snapshot.box/#/s:dao.connext.eth/proposal/0x8fd2d7c56e9d18903e8c5d3bad5e774a189e7a41879b5c5728d6421a73ad8f6c) - ends on February 26 at 15:33 UTC.

[Social EGP 22 - Code of Conduct - DAO Operation Standards](https://snapshot.box/#/s:dao.connext.eth/proposal/0x21a270501f5032110721047ef9b02c78e75f59a757a1be4fa39cf234b543ac5c) - ends on February 26 at 15:41 UTC.

[Social EGP 23 - Code of Conduct - Election Standards](https://snapshot.box/#/s:dao.connext.eth/proposal/0x42d5ce537f0cf466bed326ad0750cf0e5cf84405d082203396ca3c9d6f2f6ac8) - ends on February 28 at 16:18 UTC.

[Social EGP24 - EverScale Proposal](https://snapshot.box/#/s:dao.connext.eth/proposal/0xfd2e03b52929424987aff84f35713c69cf3add518b424d2a76797bd5e70702b4) - ends on March 2 at 18:09 UTC.

[Social EGP 25 - CLEAR Transfer Migrations](https://snapshot.box/#/s:dao.connext.eth/proposal/0x48d85699e5f111d3ee571e4c71b217a3869696677c1b32f52893b7383da26649) - ends on March 2 at 18:12 UTC.

[Social EGP 26 - Establish Mint and Burn Limits for the Lucid Multi-Bridge Module](https://snapshot.box/#/s:dao.connext.eth/proposal/0x1c4efa9f55433e30348e96a5451fbc007d792efd98728db1dc5ecf07bd3b1f98) - ends on March 2 at 21:25 UTC.

Apart from a few older proposals now up for a vote, Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.

**Upcoming Events (Times in UTC):**

[Everclear Delegates Call](meet.google.com/vqd-kvpb-him) - ends 27.2 at 14:00.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.


## **Lisk**


## Active Votes

**Onchain**

[Lisk DAO Seasons Strategy](https://www.tally.xyz/gov/lisk/proposal/97203267903712746329274783913377791673501777628275040909792987455995179851824) - ends on March 3 at 10:55 UTC.

Apart from the DAO Seasons Strategy proposal that’s up for a vote, Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.


## **ZkSync**


## Active Votes

**Onchain**

[Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) - ends on February 27 at 15:28 UTC.

[Prepare ZKsync for ZK Gateway](https://www.tally.xyz/gov/zksync/proposal/67712324710515983914473127418805437707715095849437613773846173900686148862581?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f)  - ends on February 27 at 18:14 UTC.


### **ZKsync Association Membership Overview**

Rafe from the ZkSync Governance team has [shared a post](https://forum.zknation.io/t/zksync-association-membership-overview/560) that explains that delegates can now opt-in to join the ZKSync Association, an ownerless, non-profit association under Austrian law. By becoming members, delegates may gain additional liability protection when participating in ZKSync’s governance process. The membership model, accessible via a pop-up on [Tally](vote.zknation.io) or in a delegate’s ZKsync profile, aims to reduce risk and encourage more robust on-chain governance participation. While these legal interpretations are specific to Austrian law and subject to limited case precedents, the ZKsync team anticipates this novel membership structure will support a safer, more engaged delegate community. 


### **[Draft ZIP] Lens Chain Inclusion on Elastic Network**

Josh_avara [published a proposal](https://forum.zknation.io/t/draft-zip-lens-chain-inclusion-on-elastic-network/569) to add Lens Chain—a high-performance chain built in collaboration with Matter Labs—to the ZKsync Elastic Network. Lens Chain will include an extensive genesis state containing user profiles, followers, and publications from Lens v2 (on Polygon). Over 600k profiles and 30+ million social content will migrate automatically at launch, ensuring a seamless user transition. The proposal requires a governance vote because of the extensive, pre-included genesis data. Security reviews have been conducted jointly with Matter Labs, and any additional details about the migration process will be shared via an upcoming blog post.

**Discuss with L2BEAT**

You can find us to discuss everything related to zkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.


## **Scroll**


### **Proposal: DAO DeFi Grant Program**

Eugene from the Scroll Foundation [created a post](https://forum.scroll.io/t/proposal-dao-defi-grant-program/499) that proposes a DAO DeFi Grant Program focusing on payments and stablecoins to boost the DeFi ecosystem on Scroll. The program offers two grant tiers: up to $15k for early-stage PoCs and $15k–$75k for more advanced MVPs. Over 6 months, a total budget of 3.53M SCR will be allocated and disbursed in two quarterly cycles. 

A 7-person Review Committee (4 delegates + 3 external reviewers suggested) will be elected to assess applications on a rolling basis; final funding decisions require a 2/3 or 3/5 majority, depending on grant size. Applicants must pass KYC and sign contracts before milestone-based fund releases. The Scroll Foundation will handle operational tasks (marketing, finances, etc.), and a referral program allows verified delegates (non-committee) to earn 1% of successful grant awards. After each cycle, performance and usage metrics are evaluated, with any unspent funds returning to the DAO treasury.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 4 pm UTC.

**Upcoming Events (Times in UTC):**

[Scroll Delegate Day, Denver](https://lu.ma/e/evt-1qkD2Wa5m5QROyW) - on 28.2 at 18:00.