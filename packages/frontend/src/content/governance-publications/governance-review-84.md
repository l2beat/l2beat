---
title: "Governance Review #84"
description: "February is here, and the forums are already buzzing."
publishedOn: "2026-02-03"
authorId: manuel-gonzalez
---

# **TL;DR**

*In* ***Optimism***, *the Foundation opened a transparency thread for its 2026 buyback program, with 50% of protocol revenue set to be used to repurchase OP via OTC markets starting in February, and a planned transition to fully on-chain within six months.*

*In* ***Arbitrum***, *the OpCo officially kicked off RAD operations with compliance and reward infrastructure now underway, while AGV shared portfolio and partnership progress. In parallel, Arbitrum is discussing a DVP-based quorum model, raising new questions around delegation concentration and quorum behavior during live votes.*

*In ***ZKsync***, Season 1 reports from Online Educators and The ZKnomist show strong delivery on governance-funded community activation, while the upcoming ZKnomics Staking Pilot will link staking rewards directly to delegation to grow active voting power as the ecosystem expands into Elastic Chains.*

***Elsewhere***, *Everclear is discussing renewed governance tooling and community leadership funding amid a broader shift toward B2B execution. Hop’s core developer, Authereum Labs, announced it is stepping back, Polygon shipped a major Heimdall security fix and proposed a refresh of  its Protocol Council, and Scroll continued iterating on delegate contribution and incentive frameworks, while most other ecosystems remained quiet.*


---


## **Active Votes**

**Optimism: 1 active vote**



* [Upgrade 18 - Custom Gas Token v2 and Kona Proofs](https://vote.optimism.io/proposals/77621298185123846119233191553645120427678039792258174752758738057653049982021) (Ends on February 03rd at 16:31 UTC).


---


## **Optimism**


### **Buyback Communication Thread**

The Optimism Foundation has opened a [dedicated communication thread](https://gov.optimism.io/t/buyback-communication-thread/10588) to provide transparency into the execution of OP buybacks via OTC markets. Under the recently approved program, 50% of all protocol revenue generated throughout 2026 will be used to repurchase OP, with the initiative officially starting in February, using January’s revenue.

The Foundation stated that the first ETH-to-OP conversion will occur between 25 and 35 days after February 1, with subsequent conversions following the same monthly window. After each buyback is completed, the thread will be updated with execution details and links to relevant dashboards. OTC execution is described as a temporary setup, with plans to transition buybacks fully on-chain within the next six months.


---
## **Arbitrum**


### **RAD Kick-off Update**

OpCo has [published](https://forum.arbitrum.foundation/t/rad-kick-off-update/30487) the first official update on the Rewarding Active Delegates (RAD) program, following its transition from the Arbitrum Foundation to OpCo after the December vote. RAD formally began on January 1, 2026, and will run through the end of the year, with delegate rewards administered directly by OpCo.

The update highlights early operational progress, including hiring SEED as program manager, setting up compliance flows (KYC/KYB), finalizing grant agreements, and establishing a multisig wallet for fund distribution. As of January 29, 38 of 80 eligible delegates with over 200k voting power have applied, and 24 have already completed compliance checks. Retroactive rewards for November and December have been calculated and are expected to be distributed by the end of January, while no rewards are due for January because there were no governance votes.


### **AGV Monthly Update (January 2026)**

Arbitrum Gaming Ventures (AGV) [shared](https://forum.arbitrum.foundation/t/agv-monthly-update-january-2026/30488) its January 2026 monthly update, marking the program’s operational ramp-up after the DAO holiday break. Key priorities this month included onboarding the newest AGV Council member, JoJo, as well as internal planning for 2026 and preparations for the upcoming Transparency Report #3, expected to be released in early February.

The update also highlighted progress across AGV’s gaming portfolio. The Lost Glitches announced new partnerships with Twitch, including creator-focused activations and distribution support, as well as a publishing agreement to expand into the Chinese market. Wildcard reported major gameplay refinements based on tournament feedback, new payout infrastructure through Stripe, and continued iteration ahead of its Ranked Season 1 launch. AGV noted that additional announcements and press activity are expected throughout Q1.


### **DVP Quorum for ArbitrumDAO: Implementation & Parameters**

Arbitrum has [published](https://forum.arbitrum.foundation/t/constitutional-dvp-quorum-for-arbitrumdao-implementation-parameters/30484) a constitutional proposal to finalize the implementation and parameters of a new quorum model based on Delegated Voting Power (DVP). Instead of calculating quorum from the total voteable token supply, quorum would now scale dynamically with the amount of ARB actively delegated for governance participation.

Under the proposed formula, quorum becomes bounded between a baseline minimum and a maximum ceiling, with delegation levels acting as the main driver. For constitutional proposals, the parameters are set at ɑ = 0.5, a baseline quorum of 150M ARB, and a max quorum of 450M ARB. For non-constitutional proposals, the parameters are slightly lower, with ɑ = 0.4, a baseline quorum of 100M ARB, and a max quorum of 300M ARB. If the temperature check succeeds, the proposal is expected to move to an on-chain vote in February, with a Trail of Bits audit still underway.

**L2BEAT’s take**

*Shifting the quorum toward a DVP-based model feels like a logical next step after the earlier support, since it better reflects the voting power of tokens actually participating in governance rather than the total supply. That said, the baseline quorum levels also highlight a broader governance reality. With delegation currently concentrated among a small set of large delegates, reaching quorum may continue to depend heavily on a handful of actors. Over time, this dynamic could reinforce the concentration of power, potentially leaving smaller delegates with less meaningful influence in practice.*

*More broadly, while this updates quorum mechanics, it does not address the deeper issue of low overall delegation. Any contract-level governance change of this scale should also include a clear plan for tooling compatibility and risk management. These points are worth clarifying, and we plan to participate in the forum discussion to better understand how they will be handled.*


---


## **Everclear**


### **[RFC] Everclear Curia Delegate Dashboard 2026**

Curia has [published](https://forum.connext.network/t/rfc-everclear-curia-delegate-dashboard-2026/1424) an RFC proposing a new dedicated Delegate Dashboard for Everclear to improve delegate discovery, participation tracking, and overall governance visibility. The dashboard is positioned as a “source of truth” for the ecosystem, especially as existing tooling approaches expiration and delegation data remains fragmented across platforms.

Curia is offering to build and deploy the dashboard at zero cost, requesting funding only for one year of maintenance and support to keep it operational, synchronized across six chains, and updated as Everclear governance evolves. The proposed interface includes delegate profiles, voting activity metrics, participation classifications (Active, Inactive, Ghost), delegation buttons for NEXT and CLEAR, and optional advanced features like voting power history and top delegator tracking. The total requested budget for the full implementation and 1-year service is $12,500.


### **Community Leadership Incentivization H1 2026**

TommyR8 has [published](https://forum.connext.network/t/community-leadership-incentivization-h1-2026/1423) an RFC outlining the proposed bi-annual budget for Everclear’s Community Leaders Sub-DAO for the first half of 2026. The Community Leaders, approved through Snapshot in early 2024, are responsible for core ecosystem support work, including moderation, user assistance, social media growth, and community engagement.

The proposal requests 5,908,882 CLEAR to fund fixed compensation for two community leads, a small community treasury for initiatives and subscriptions, and a buffer to account for token price volatility. The post also includes reporting on how previous funds were spent, KPI performance for the EverclearIntern account, and updated targets for impressions, engagement, support response times, and security across community channels through mid-2026.

**L2BEAT’s Take**

*This proposal comes at a time when Everclear’s broader direction appears to be shifting toward B2B execution. Nikita Bulgakov from the Everclear Foundation recently mentioned on an Everclear public call that the team is working on partnerships, but that details will remain private until the agreements are finalized. They also noted that in December, the Foundation undertook meaningful cost-cutting, reducing headcount and retaining only roles considered critical to this focus.*

*In that context, it may be worth asking how community-facing initiatives like this one will fit into the Foundation’s updated priorities. How much ongoing support or coordination should be expected between the Foundation and the Community Leaders Sub-DAO as these partnerships move closer to launch? The Foundation shared that only one marketing contributor remains at the moment. Are there plans to collaborate?.*

---

## **ZKsync**


### **ZKnomics Staking Pilot: Season 1 Launch Date**

ZKsync has confirmed the launch date for Season 1 of its ZKnomics Token Staking Pilot Program. Starting Monday, February 9th, ZK token holders will be able to stake through the Tally pilot interface and earn rewards while contributing to governance participation.

The pilot has two core goals: testing staking infrastructure ahead of a future decentralized sequencer, and increasing delegated voting power through a delegate-to-stake requirement. Season 1 will run for three months, with up to 10M ZK distributed as incentives and a target of 400M ZK staked. The APY will begin at 3% and may rise to as high as 10% depending on participation levels, though rates are managed and not guaranteed. Participation is conditional on delegating to an active ZKsync delegate, reinforcing the program’s governance-linked design.


### **Online Educators - Community Activation Pilot Program (2025–2026) - Season 1 Report**

Mike [published](https://forum.zknation.io/t/online-educators-community-activation-pilot-program-2025-2026-season-1-report/894) the Season 1 report for ZKsync’s Online Educators program, part of the Community Activation Pilot supporting governance-led community initiatives. The program focuses on user support, faster incident escalation, UX feedback, and improving response times for community questions.

Throughout the season, educators provided 24/7 multilingual support, handled more than 8,800 messages, banned 670+ scam accounts, and helped translate announcements and organize weekly ecosystem updates. The report notes that as ZKsync expands into Elastic Chains and Prividium, community education and coordination across independent chain communities will remain an ongoing challenge.


### **The ZKnomist - Community Activation Pilot Program (2025–2026) - Season 1 Report**

The ZKnomist [published](https://forum.zknation.io/t/the-zknomist-community-activation-pilot-program-2025-2026-season-1-report/895) its Season 1 report as part of ZKsync’s Community Activation Pilot, a governance-funded initiative focused on boosting ecosystem awareness, education, and engagement across ZKsync and its Elastic Network. The program concentrated primarily on X for broad visibility and Discord for community coordination, user support, and events.

Between September 2025 and January 2026, The ZKnomist exceeded its baseline content goals, producing 8–11 posts per week, regular original videos, and recurring community calls that attracted up to ~900 listeners. The report highlights new formats such as the Weekly Roundup, stronger visual production support, and additional experiments, including the ZK Stack Content initiative, which tested decentralized, community-driven content contributions at scale.


---


## **Hop**


### **Authereum Labs is Stepping Back**

Cwhinfrey [announced](https://forum.hop.exchange/t/authereum-labs-is-stepping-back/1380) that Authereum Labs will no longer serve as the primary development partner for Hop Protocol. After pushing to deliver Hop Rails with limited resources, the team says they no longer see a viable path to bring the product to market, given strong competition and the project’s current constraints.

They emphasized that this decision follows years of work building Hop into one of the earliest cross-chain liquidity protocols and expressed gratitude to the community. Authereum plans to provide limited support to wind things down responsibly, but no new core development team or long-term replacement has been announced.


---


## **Polygon**


### **Heimdall security bug Fix Review (v0.6.0)**

Polygon [released](https://forum.polygon.technology/t/heimdall-security-bug-fix-review-v0-6-0/21658) Heimdall v2 v0.6.0 on January 23, 2026, addressing several major security and liveness issues. The upgrade adopts the CometBFT “Tachyon” patch for timestamp handling, fixes a DoS risk tied to unbounded memory allocation, and resolves bugs affecting fee withdrawals and staking key validation.

The release also strengthens side transaction checks to prevent validation gaps and includes broader improvements in testing, logging, and dependency updates to improve overall network reliability.


### **2026 Polygon Protocol Council Membership Update**

Polygon [proposed](https://forum.polygon.technology/t/2026-polygon-protocol-council-membership-update/21672) an update to the Protocol Council membership to reflect changes in availability and community representation. Several existing members, including Gauntlet, Mariano Conti, and ZackXBT, are being removed with their consent, and new members are proposed to fill the vacant seats.

The council’s multisig structure and security parameters will remain unchanged, with this proposal focused purely on refreshing signer composition. The update introduces new cybersecurity and DeFi-focused contributors while maintaining the council’s operational continuity and governance transparency.


---


## **Scroll**


### **Proposal: Governance Contribution Recognition (Cycle 2)**

EthereumTGU [introduced](https://forum.scroll.io/t/proposal-governance-contribution-recognition-cycle-2/1378) a simple reward framework to recognize delegate participation in Scroll governance. The proposal groups voters into four tiers based on how many proposals they participated in, with the highest tier requiring both full voting participation and submitted rationales.

Rewards would be distributed proportionally, using fixed weights per tier, to ensure a transparent and easy-to-audit first iteration. The system does not yet evaluate the quality of rationales, only whether one was provided, and includes a public spreadsheet and Dune query for verification.


### **(RFC) The role of delegates in the Delegate Contribution Program (DCP)**

Curia published an [RFC](https://forum.scroll.io/t/rfc-the-role-of-delegates-in-delegate-contribution-program-dcp/1391) summarizing delegate feedback on how the Delegate Contribution Program should evolve beyond simple voting participation. The post proposes structuring delegate work around four strategic pillars aligned with Scroll’s current priorities: ecosystem growth, security, transparency, and SCR token utility.

Based on feedback favoring fewer but clearer responsibilities, the role framework was reduced from 11 to 8 specialized delegate roles. A small poll ranked Program Coordinator as the most critical role to launch first, though the post notes the sample size is too limited for strong conclusions. The proposal suggests running a two-month pilot in which delegates actively fill each role, helping the DAO test workloads, define accountability, and develop clearer ways to measure governance contributions.


---


## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.

* **Uniswap**
* **Starknet**
* **Lisk**
* **Wormhole**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---


## **Upcoming Events**

**Arbitrum**

* [OpCo Operations - Office Hours](https://meet.google.com/smt-yobq-oww) - on 03.02 at 15:30 UTC.
* [Open Discussion of Proposals Governance Call](https://meet.google.com/dfo-xora-ysp) - on 03.02 at 16:00 UTC.
* [DVP Quorum for ArbitrumDAO](https://meet.google.com/djy-endq-gwq) - on 04.02 at 15:30 UTC.
* [Trial Period Extension for CoC & DAO's Procedures](https://meet.google.com/zxp-mvcq-wqg) - on 06.02 at 14:00 UTC.
* [OpCo Monthly Update](https://meet.google.com/ety-prua-iei) - on 06.02 at 15:00 UTC.

**ZKsync**

* [Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 04.02 at 16:30 UTC.

**Scroll**

* [Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 04.02 at 15:00 UTC.
* [Scroll DAO Office Hours](https://meet.google.com/kyf-vixs-vhq) - on 06.02 at 11:00 UTC.

**Hop**

* [Hop Community Call](https://discord.com/channels/789310208413270078) - on 04.02 at 18:00.


---

# **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.


