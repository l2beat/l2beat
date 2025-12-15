---
title: "Governance Review #78"
description: "Governance enters year-end mode with lighter but meaningful updates."
publishedOn: "2025-12-15"
authorId: manuel-gonzalez
---

## **TL;DR**

*On **Arbitrum**, the Foundation launched a governance UX survey covering tooling, processes, and participant experience. At the same time, cupojoseph proposed StableLane, a TimeBoost-like fast lane for stablecoin payments with a dedicated mempool and more predictable, lower fees.*

*On **Everclear**, mmurthy requested a 2026 renewal for Karma’s Everclear Delegate Dashboard (NEXT, CLEAR, veCLEAR), asking $20k to continue maintenance, multi-chain data infrastructure, and incremental improvements.*

*On **Scroll**, EthereumTGU opened discussion for GCR Cycle 2 with two 280k SCR allocations (May–Aug retro, Sep–Dec) and a simple, auditable rewards model, while SEEDGov pushed a governance-mechanisms sprint focused on optimistic approvals, councils, limited referendums, and tighter budget ratification.*

*Finally, on **Lisk**, SuperchainEco shared a draft Season 3 plan for H1 2026 with 1.45M LSK total budget (1.372M requested), shifting ops to a council-plus-ops model, moving grants tracking to Karma, and leaning into KPI-driven incentives with on-chain measurement tools.*


## **Arbitrum**


## **Active Votes**

**Onchain**

[AIP: Activate ArbOS 51 (Dia) and Gas Pricing Updates](https://www.tally.xyz/gov/arbitrum/proposal/53154361738756237993090798888616593723057470462495169047773178676976253908001?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on December 19 at 02:29 UTC.


### **Improving Arbitrum’s Governance UX: Survey**

The Arbitrum Foundation [has posted](https://forum.arbitrum.foundation/t/improving-arbitrum-s-governance-ux-survey/30337) an “Improving Arbitrum’s Governance UX” survey to map out where contributors feel the most friction across ArbitrumDAO’s governance stack, covering tooling (Discourse, Snapshot, Tally), processes (timelines, frameworks, technical review expectations), and the overall participation experience (workload, notifications, keeping up with discussions). The goal is to make governance smoother and more efficient, using community feedback to guide practical upgrades to how people navigate and contribute.

**L2BEAT’s take**

We plan to review the survey and participate in it. The user experience in governance is one of those areas where small, well-informed changes can have a significant impact on participation and decision quality, so it is encouraging to see that the Foundation is explicitly requesting structured feedback. 


### **Create another fast-lane, similar to TimeBoost, specifically optimized for stablecoin payments**

Cupojoseph [has suggested](https://forum.arbitrum.foundation/t/create-another-fast-lane-similar-to-timeboost-specifically-optimized-for-stablecoin-payments/30336) creating StableLane, an additional fast lane on Arbitrum One, similar to TimeBoost but specifically optimized for stablecoin payments. The idea introduces a dedicated execution path for simple, stablecoin transfers, with a separate mempool, predictable, lower fixed gas fees, and reduced congestion.

The proposal argues that stablecoins dominate on-chain activity yet are still treated like generic transactions, and that a purpose-built lane could help Arbitrum stay competitive as payment-focused use cases grow. StableLane would share settlement and finality with Arbitrum One while offloading payment traffic from the main lane, and the author is currently gathering community feedback before moving toward deeper technical and economic evaluation.


**Upcoming Events**

[[New Proposal] BLAZE: meet the businesses shortlisted for loans](https://meet.google.com/sxa-sond-org) - on 16.12 at 14:00 UTC.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 16.12 at 17:15 UTC.


## **Everclear**


## **Active Votes**

[Social EGP 35 - Everclear DAO Code of Conduct Trial period extension](https://snapshot.box/#/s:dao.connext.eth/proposal/0x39bd8c447368274555d46775562b24ac56ecdfdbee96f7954210b5fd6c2ecef2) - ends on December 19 at 17:15 UTC.


### **[RFC] Renewal of Karma Everclear Delegate Dashboard for 2026**

Mmurthy [has created](https://forum.connext.network/t/rfc-renewal-of-karma-everclear-delegate-dashboard-for-2026/1421) an RFC outlining Karma's 2026 renewal request to continue operating and improving the Everclear Delegate Dashboard, the main interface for delegating NEXT, CLEAR, and veCLEAR voting power. The proposal outlines two years of ongoing maintenance. It highlights 2025 delivery work, including veCLEAR support, multi-chain infrastructure across five networks with near-real-time updates, and consistently fast issue resolution, positioning the renewal as a continuation of a critical component of the delegation UX.

For 2026, Karma expects to keep the dashboard running at[ https://delegate.everclear.org/](https://delegate.everclear.org/) with ongoing maintenance, bug fixes, and incremental feature improvements, while noting that broader Karma platform upgrades (funding programs, impact measurement, and accountability tooling) may also benefit Everclear over time. The funding request is $20,000 for 2026, framed as a return to the standard annual level after the prior year’s higher cost due to migration-related work.

**L2BEAT’s take**

This is a straightforward renewal of a tool we’ve already [supported](https://forum.connext.network/t/rfc-renewal-of-karma-everclear-delegate-dashboard/1350/6?u=manugotsuka) and still view as core Everclear governance infrastructure. Karma’s dashboard remains the primary delegation interface for NEXT, CLEAR, and veCLEAR, and their track record on maintenance and delivery has been strong.

The $20k request is a return to a standard maintenance level after last year’s migration costs, which seems reasonable given the dashboard’s importance and ongoing maintenance needs.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Scroll**


### **Request for Comments: GCR Cycle 2**

EthereumTGU [has created](https://forum.scroll.io/t/request-for-comments-gcr-cycle-2/1335) an RFC to kick off community discussion on Governance Contribution Rewards / Recognition (GCR) Cycle 2, a program already approved by the DAO. The current framing keeps the full 8-month cycle split into two equal allocations: 280,000 SCR for May–August (retroactive) and 280,000 SCR for September–December, with the Governance Council aiming to publish a finalized proposal ahead of the next voting cycle.

Given recent softer DAO activity, the recommendation is to keep the first iteration auditable and straightforward, with rewards primarily tied to consistent participation, especially governance voting, contributions during co-creation cycles, and engagement across calls and the forum (with the tracking methodology still open for input).

**L2BEAT’s take**

We agree with keeping this GCR iteration as simple and auditable as possible, using metrics that are easy to track and hard to game. That’s the fastest way to build credibility and reduce operational overhead.

We’d also be very cautious about subjective signals such as “participation” in calls or forum activity unless they can be measured transparently and consistently. We’ve seen how gray areas around contribution quality and scoring can become contentious in other ecosystems (for example, Arbitrum’s DIP), so starting objective and iterating later feels like the right path.


### **Co-Creation Sprint - Governance Mechanisms Discussion**

SEEDGov [created a post](https://forum.scroll.io/t/co-creation-sprint-governance-mechanisms-discussion/1338) inviting the Scroll community to revisit how governance decisions should be made as the ecosystem scales. The post argues that equating decentralization with constant referendum-style voting has often created friction, slower decision-making, operational overhead, and low participation, and proposes a “fit-for-purpose” model in which different decision types use different mechanisms, balancing legitimacy with speed and accuracy.

The discussion outlines a toolkit approach: optimistic approvals for technical/operational actions with clear veto thresholds, council-based decisions to leverage expertise with improved procedures and rotations, and referendum-based voting reserved for major, high-impact choices. It also proposes a more structured treasury process through bi-annual budget votes, a breakdown from general budgets to council execution (with some space for DAO-led initiatives), and quarterly program ratifications to keep accountability tight while reducing governance fatigue.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[CoCreation Sprint AM Session](https://meet.google.com/ung-vysq-vgm) - on 15.12 at 15:00 UTC.

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 15.12 at 17:00 UTC.

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 17.12 at 15:00 UTC.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/zfd-asoc-rmx) - on 18.12 at 17:45 UTC.

[CoCreation Sprint AM Session](https://meet.google.com/crg-sqte-may) - on 19.12 at 15:00 UTC.


## **Lisk**


### **Lisk DAO Season 3**

SuperchainEco [has published](https://forum.lisk.com/t/lisk-dao-season-3/630) a post outlining the Lisk DAO Season 3 strategy and budgets, presented at the Lisk DAO Townhall on December 10. The plan positions Lisk as a “Growth Platform for EM Founders. It proposes an H1 2026 budget of 1,450,000 LSK, including an expected 78,000 LSK carryover from Season 2, resulting in 1,372,000 LSK in newly requested funds. Season 3 is described as a significant reduction relative to Season 2’s 3,925,000 LSK, mainly due to changes such as the DAO fund assuming certain allocations and the removal of accelerator-related costs.

Season 3 proposes a two-tier operating model, an Ecosystem Strategy Council for strategy/budgets, and a LiskDAO Ops team for execution, focused on builder grants, KPI-driven ecosystem incentives, and operational support. Key shifts include moving grants and tracking to Karma (replacing Charmverse), distributing a portion of incentives through on-chain measurement tools (e.g., Divvi), and not allocating DAO budget for the Ambassador or incubation/acceleration programs (those would be handled by the core team). The draft sets a timeline starting January 12, 2026, through June 18, 2026, with mid- and post-season reporting planned.

**L2BEAT’s take**

The two-track structure looks promising. Splitting responsibilities between a Strategy Council (direction and budgets) and an Ops team (execution) can make the season easier to run while keeping accountability clearer, especially with defined reporting milestones.

We also see the move to Karma as a potential win for transparency. Having applications, tracking, and outcomes in a single public system should make it easier for stakeholders to follow what’s funded, why it was funded, and whether it’s delivering against KPIs.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**


## **Active Votes**

[[Poll] What do you look forward to in 2026?](https://snapshot.box/#/s:starknet.eth/proposal/0xfc3af26941942003afe566c6c3efc8f692847364d20e414efc051da5a409a998) - ends on December 19 at 11:58 UTC.

[[Poll] “I feel I can influence Starknet's roadmap”](https://snapshot.box/#/s:starknet.eth/proposal/0xbb1e5aa98716b4bde2ffc3e43d911b691e3507af8011c2d702836fd41db89194) - ends on December 19 at 11:56 UTC.

[[Poll] “I feel like I know Starknet's roadmap”](https://snapshot.box/#/s:starknet.eth/proposal/0xb441e23b57a8e99310cc36f12dd79bd3da82e9d0d0bed2c80f61af7edcd50a5b) - ends on December 19 at 11:55 UTC.

[[Poll] “I think the UX of Starknet is excellent”](https://snapshot.box/#/s:starknet.eth/proposal/0x774c1cf8399b461ae5c8af38f842be02851fd1efb50ee2fab9013828dc92c741) - ends on December 19 at 11:54 UTC.

[[Poll] How frequently do you use Starknet?](https://snapshot.box/#/s:starknet.eth/proposal/0x673384b0e125a1d56cea633b22d453dcc23b00d1b3f4b7baa7ab09d14f1de77a) - ends on December 19 at 11:52 UTC.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Optimism**

Optimism’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Upcoming Events**

[DAB Office Hours](https://meet.google.com/pgj-ibvv-trr) - on 16.12 at 15:00 UTC.


## **ZKSync**

ZKSync’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) on 17.12 at 16:30 UTC.


## **Polygon**

Polygon’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Uniswap**

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.