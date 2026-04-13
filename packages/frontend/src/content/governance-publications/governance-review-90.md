---
title: "Governance Review #90"
description: "New Rules, New Moves, Same Governance Grooves"
publishedOn: "2026-04-01"
authorId: manuel-gonzalez
---

## **TL;DR**

*In* ***Arbitrum***, *governance is focused on treasury deployment and program evolution. A proposal to allocate 6,000 ETH into yield-generating strategies continues the DAO’s push to reduce idle capital and build on prior treasury consolidation efforts. At the same time, updates to the Audit Program aim to increase participation by introducing more flexible alignment criteria and early-stage security tooling. Recent events like the Resolv exploit also reinforce the need for strong risk frameworks as treasury exposure to DeFi strategies expands. Alongside this, multiple program updates (Watchdog, RAD, Firestarters, AGV) highlight a broader trend toward refining incentives, improving accountability, and tightening operational efficiency across the DAO.*

*In* ***ZKsync***, *governance activity centered on ecosystem positioning and infrastructure continuity. The Foundation selected Rally to lead its Institutional Narrative Experiment, aiming to strengthen ZKsync’s positioning through structured content and research. At the same time, ScopeLift’s takeover of Tally’s operations ensures continuity for governance infrastructure, avoiding disruptions as Tally winds down.*

***Elsewhere***, *governance continues to mature across ecosystems. Uniswap is moving toward a more structured operational model with Council renewal, updated financials, and clearer coordination frameworks. Starknet introduced a new “Minor Upgrade” path to enable faster iteration while maintaining transparency. Polygon is exploring changes to validator incentives, including fee redistribution mechanisms to improve sustainability and broaden participation among validators and delegators.*

---
## **Active Votes**

**Arbitrum**

* [Transfer 6,000 ETH and Idle Stablecoins from the Treasury to the Treasury Management Portfolio](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x25877ad1de4b9232af7a744dbd9ffb1b023c385aaf15c96c5b016859926416a2) - ends on April 9 at 17:00 UTC.
* [Improvements to the Arbitrum Audit Program](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xa8d3dbf1b6cbe81847b5165da5d194d2fc554ae223f6ccf77f53c3fdecc6987e) - ends on April 9 at 17:00 UTC. 

**Lisk**

* [Test proposal #2: a new voting platform](https://www.tally.xyz/gov/lisk/proposal/80146914830138261105841041456506281049432216244382196186785004172776716281976) **- ends on April 7 at 10:32 UTC.** 

---
## Optimism

### **Vulnerability in Kona fallback proof system**

Pauldowman [announced](https://gov.optimism.io/t/vulnerability-in-kona-fallback-proof-system/10650) that an audit identified inconsistencies in the Kona proof system’s derivation logic that could have led to divergence from the canonical chain. No funds were at risk, as Kona is currently used only as a fallback-proof system and not as the active mechanism in any OP Stack chain.

The issues were fixed prior to public disclosure and adopted by all relevant operators. While the incident had no direct impact, it highlights the importance of continued auditing and validation as Kona moves closer to playing a more central role in the fault-proof system.

---

## **Arbitrum**

### **Transfer 6,000 ETH and Idle Stablecoins from the Treasury to the Treasury Management Portfolio**

Entropy [proposed](https://forum.arbitrum.foundation/t/transfer-6-000-eth-and-idle-stablecoins-from-the-treasury-to-the-treasury-management-portfolio/30691) transferring 6,000 ETH and approximately $150k in idle USDC from the Arbitrum DAO treasury to the Treasury Management Portfolio, following forum feedback that leaving a large idle buffer was suboptimal. Currently, over 6,000 ETH remains unallocated and not generating yield.

The proposal builds on improved treasury performance, with ETH strategies reaching a ~4.8% 30-day average yield, significantly above benchmark rates. Under current conditions, allocating 6,000 ETH could generate an estimated ~288 ETH annually (~$635k), while also moving the DAO’s ETH allocation closer to its target range and continuing diversification efforts away from ARB.

**L2BEAT’s Take**

*Moving idle assets into yield-generating strategies is a natural continuation of the previously [approved proposal](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x703ef86b79590b07f770dd2369666085e112e2a8998a7e2f8011ed755611968c/discussion) to consolidate idle funds into the Treasury Management Portfolio, which aimed to reduce capital inefficiency across the DAO. In that sense, deploying a portion of idle ETH follows the same line previously approved by the DAO.*


### **Improvements to the Arbitrum Audit Program**

Arbitrum [proposed](https://forum.arbitrum.foundation/t/improvements-to-the-arbitrum-audit-program/30697) two updates to its Audit Program: the first would replace the strict exclusivity requirement with a more flexible alignment framework, and the second would introduce a pilot program offering AI-based security scans. The changes aim to address friction identified during the program’s first two quarters, particularly around mandatory exclusivity, which has reportedly discouraged some teams from participating or delayed approvals.

Under the new approach, projects may be exempt from exclusivity if they demonstrate meaningful alignment with Arbitrum, such as prioritizing deployments or liquidity on the network. In parallel, the introduction of AI security scans is intended to support earlier-stage teams that are not yet ready for full audits, helping improve code quality and readiness over time. The proposal does not request additional budget and would be implemented following an off-chain vote.

**L2BEAT’s Take**

*Eliminating the strict exclusivity requirement feels like a reasonable step if the goal is to attract better teams that might otherwise stay away. That said, the key question is what “alignment” actually means in practice. If this flexibility is going to work, it should translate into real value for this ecosystem. Otherwise, there is a risk of funding work that ultimately benefits other ecosystems instead of Arbitrum.*

*On the AI scans side, this looks like a helpful addition, especially for earlier-stage teams that are not quite ready for a full audit yet. As long as it is treated as a stepping stone and not a replacement for a full audit, it could help improve the overall quality of projects entering the program over time.*


### **ATMC Update: Resolv Exploit and Treasury Exposure**

Entropy [shared](https://forum.arbitrum.foundation/t/atm-council-updates/29627/15?u=manugotsuka) an update following the recent Resolv exploit, confirming that the Arbitrum DAO Treasury has no exposure to the incident and did not incur any losses. The exploit involved the unauthorized minting of around 80M unbacked USR tokens, leading to sharp depegs across related assets and impacting several DeFi protocols across multiple chains.

While some Arbitrum-based protocols were indirectly affected, the DAO’s positions remained largely insulated. A ~$1M USDC position managed by kpk in Fluid was successfully exited without losses, and other potential exposure points (e.g., Morpho, Euler) either had no DAO allocation or were already limited through caps and risk controls. The ATMC stated that it will continue to monitor the situation as recovery efforts for affected assets and protocols evolve.


### **March 2026 Security Council Election: Compliance Check**

Arbitrum has [entered](https://forum.arbitrum.foundation/t/march-2026-security-council-election-compliance-check/30711) the Compliance Check phase of its March 2026 Security Council elections, running from March 29 to April 12. During this stage, the Arbitrum Foundation reviews the [12 qualified](https://www.tally.xyz/gov/arbitrum/council/security-council/election/5/round-1?sort=RANDOM&filter=QUALIFIED) candidates to ensure they meet legal, constitutional, and service agreement requirements.

Candidates who successfully pass this phase will move on to the final Member Election stage, scheduled to begin on April 12.

### **Watchdog Program Publishes 6-Month Retrospective**

Entropy [shared](https://forum.arbitrum.foundation/t/watchdog-retrospective/30732) a six-month retrospective of the Arbitrum Watchdog Program, summarizing its role in identifying and recovering misused funds across DAO initiatives. The program received 78 reports (59 unique cases), with 32 confirmed instances of misuse, resulting in a validation rate of ~63% among completed investigations.

In total, the program has recovered 422,316 ARB for the DAO and allocated 280,773 ARB in bounties to reporters. Notably, all confirmed misuse cases were linked to legacy incentive programs, suggesting that more recent initiatives have improved accountability mechanisms. The report outlines lessons learned and potential next steps, including closing out remaining cases and evolving the program toward a future transition under OpCo.

### **Firestarters Program Publishes March Update**

OpCo [shared](https://forum.arbitrum.foundation/t/firestarters-march-monthly-update/30733) a monthly update on the Firestarters program, highlighting continued progress across grant allocations and project development. To date, the program has received 14 applications, with 5 approved and ~$24k allocated, reflecting a selective approach focused on early-stage ecosystem initiatives.

Several projects have already been completed, while others remain in progress or under review. With applications now closed, the program is moving toward its next phase, with a full retrospective report expected soon to evaluate outcomes and guide future iterations.

### **RAD Program Update: March Results and Proposed Adjustments**

The Rewarding Active Delegates program [published](https://forum.arbitrum.foundation/t/rad-update-3-march-2026/30736) its March results alongside a broader operational update, highlighting both participation outcomes and potential changes to the incentive structure. During the month, 36 delegates participated, with 13 meeting the eligibility criteria and a total of $19,500 distributed. While participation remained relatively strong, a significant portion of delegates failed to qualify due to strict requirements around participation thresholds and rationale submission.

In response, OpCo is [considering adjustments](https://forum.arbitrum.foundation/t/rad-update-3-march-2026/30736) to improve alignment between incentives and actual participation. Proposed changes include removing the 75% participation threshold, eliminating the minimum payout requirement, and softening the rationale requirement by applying a small penalty instead of full disqualification. These changes aim to reduce friction and better reflect meaningful engagement, while maintaining accountability within the program.

### **AGV Shares March Update and Portfolio Progress**

Arbitrum Gaming Ventures [published](https://forum.arbitrum.foundation/t/agv-monthly-update-march-26/30735) its March update, highlighting ongoing portfolio activity and the release of its [third Transparency Report](https://docsend.com/view/r9dfyf55xj8bjics). Among key developments, portfolio company Psychedelic Games raised $3.5M to support the development of its upcoming title Golden Tides, backed by investors including KRAFTON and FlyQuest.

The update also points to AGV’s continued efforts to position Arbitrum as a hub for gaming and consumer applications, with the latest transparency report outlining its evolving investment strategy, operational progress, and broader ecosystem engagement.


---

## **ZKsync**


### **ZKsync Selects Rally for Institutional Narrative Program**

The ZKsync Foundation [selected](https://forum.zknation.io/t/community-activation-rfp-3-zksync-institutional-narrative-experiment/922/4?u=manugotsuka) Rally as the winner of RFP 3 under its Community Activation Program, tasking the team with running an 8-week “Institutional Narrative Experiment” funded with 833,000 ZK. The initiative aims to strengthen ZKsync’s positioning within the Ethereum ecosystem through coordinated, high-quality content.

The program will be executed in three waves, covering institutional positioning, Prividium education, and real-world institutional use cases. Funding will be distributed in two tranches, with progress evaluated through mid-term and final reports, alongside predefined KPIs and quality controls.


### **ScopeLift to Take Over Tally Operations**

Following Tally’s announcement that it will wind down operations, ScopeLift [has reached](https://forum.zknation.io/t/scopelift-to-take-over-tally-operations/944) an agreement to take over and operate Tally’s full stack moving forward, with a rebrand expected. The transition is being coordinated with the ZKsync Governance Team to ensure continuity for key governance infrastructure, including the vote.zknation.io interface and the Staking Pilot program.

According to the update, no disruptions are expected during the handover, with ScopeLift stepping in to maintain and support the existing systems while the transition and rebranding process unfolds.

---
## **Uniswap**


### **Uniswap Council: Season 4 Report**

The Uniswap Council [shared](https://gov.uniswap.org/t/uniswap-council-uc-season-4-report/26064/1) its Season 4 report, highlighting continued expansion of Uniswap v3 across multiple chains, though at a slower pace as most major ecosystems have already been covered. The DAO also moved toward a more selective approach to incentives, reflecting mixed results and changing market conditions.

The report also points to growing governance complexity from multi-chain operations and ongoing discussions around quorum, voter fatigue, and scalability. Meanwhile, remaining funds have been consolidated under the new DUNI structure, with the UC stepping back from its previous operational role. 

### **Uniswap Council (UC): Season 5 Renewal**

A proposal [was submitted](https://gov.uniswap.org/t/uniswap-council-uc-season-5-renewal/26065) to renew the Uniswap Council (UC) for Season 5, redefining its role as a DAO-elected operational layer focused on executing governance decisions, coordinating service providers, and maintaining accountability across DAO activities. The proposal reflects a shift toward a more structured and formalized setup, including the UC’s incorporation as a legal entity and closer coordination with the DUNI for treasury and payments.

Season 5 would extend the Council’s term to 12 months with a total budget request of $955k in UNI, covering operations, a grant graduation pipeline, and a new burn bounty program. The proposal also signals a stronger focus on treasury management strategies and UNI burn mechanisms, positioning the UC as a more active operational and coordination hub within the evolving Uniswap governance landscape.


### **Uniswap Foundation: Summary FY’2025 Financials**

The Uniswap Foundation [released](https://gov.uniswap.org/t/uniswap-foundation-summary-fy-2025-financials/26068) its unaudited financial summary for FY2025, outlining its financial position prior to the implementation of the UNIfication governance proposal. The report highlights a year of ecosystem expansion, including the launches of Uniswap v4 and Unichain, as well as continued growth in developer activity.

As of December 31, 2025, the Foundation held approximately $85.8M in assets, including $49.9M in USD and stablecoins, 15.1M UNI, and 240 ETH. A total of $106.2M has been allocated toward grants, with an expected operational runway extending into early 2027. The report also reflects ongoing efforts to scale ecosystem support through grants, research, and infrastructure, while adapting to structural changes introduced through recent governance decisions. 


---

## **Starknet**


### **Starknet Introduces Minor Upgrade Path**

Starknet [updated](https://community.starknet.io/t/updated-voting-process-introducing-minor-upgrades/116148?_gl=1*1jwudgk*_up*MQ..*_ga*MTMzNjY1MjI5My4xNzc0ODgzMzA2*_ga_WY42TERK5P*czE3NzQ4ODMzMDUkbzEkZzAkdDE3NzQ4ODMzMDUkajYwJGwwJGgw) its governance framework by introducing a new “Minor Upgrade” path alongside the existing Major and Emergency flows. The goal is to make upgrade processes more predictable while allowing faster iteration for smaller changes, without requiring Security Council involvement.

Under the new structure, Major upgrades continue to follow a longer review process with full oversight, while Minor upgrades move through a shorter cycle with parallel SNIP submission and a reduced freeze period. Emergency upgrades remain reserved for critical fixes, bypassing voting but requiring post-mortem reporting. Overall, the update formalizes clearer upgrade pathways, balancing speed with governance transparency.


### **RFC: Upgradeable Beacon Proxies for Shared Interfaces**

Ericnordelo has [created](https://community.starknet.io/t/rfc-upgradeable-beacon-proxies-for-shared-interfaces/116150?_gl=1*1jwudgk*_up*MQ..*_ga*MTMzNjY1MjI5My4xNzc0ODgzMzA2*_ga_WY42TERK5P*czE3NzQ4ODMzMDUkbzEkZzAkdDE3NzQ4ODMzMDUkajYwJGwwJGgw) an RFC that explores introducing a beacon proxy standard in Starknet to coordinate upgrades across multiple contracts that share the same interface, such as pools, vaults, or user accounts. The idea is to allow many contracts to switch to a new implementation simultaneously, avoiding the need for individual upgrades or custom orchestration.

The proposal outlines a narrow, Starknet-specific approach, including a shared beacon contract that manages implementation updates and optional extensions such as beacon_call to support more flexible routing. While this could improve developer experience and standardization, it also introduces trade-offs, such as increased risk from shared upgrades and limitations due to Starknet’s lack of fallback functions. 

---


## **Polygon**


### **PIP-85: Priority Fee Distribution Adjustment**

Polygon Labs members [created a proposal](https://forum.polygon.technology/t/pip-85-veblop-pip-65-priority-fee-formula-adjustment/21829) to modify the PIP-65 priority fee distribution to better balance rewards among validators and, for the first time, to include delegators in fee sharing. The proposal suggests allocating 50% of the validator fee pool to stakers via periodic distributions, while adjusting the remaining validator rewards to be 75% equally distributed (performance-adjusted) and 25% stake-based.

The changes are intended to address growing disparities in validator earnings and improve overall sustainability, especially for smaller operators. By introducing a more balanced reward structure and extending fee participation to delegators, the proposal signals a shift toward a more inclusive fee model within Polygon’s validator ecosystem.


---
## **Everclear**

### **Everclear Delegate Dashboard Goes Live**

CuriaLab [announced](https://forum.connext.network/t/everclear-delegate-dashboard-by-curialab/1430) the launch of the Everclear Delegate Dashboard, following its selection as the DAO’s dashboard provider for 2026. The tool is designed to serve as a unified source of truth for delegate activity and accountability across Everclear’s multi-chain governance, which currently spans six chains.

The dashboard was delivered with no upfront development cost to the DAO, with funding limited to a one-year maintenance and support period. CuriaLab will continue updating the tool throughout the engagement, incorporating community feedback and ensuring it remains aligned with evolving governance needs.


---

## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.


* **Wormhole**
* **Hop**
* **Lisk**
* **Scroll**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---
## **Upcoming Events**

**Arbitrum**

* [Entropy Advisors - biweekly office hours](https://meet.google.com/nfm-yfty-iwp) - on 07.04 at 17:15 UTC.
* [Arbitrum Reporting Governance Call (GRC)](https://meet.google.com/kkv-icxy-xor) - on 08.04 at 16:00 UTC.
* [March 2026 Security Council Member Election: AMA](https://meet.google.com/afj-rryt-pmx) - on 09.04 at 14:00 UTC.
* [OpCo Monthly Update](https://meet.google.com/ety-prua-iei) - on 10.04 at 14:00 UTC.


**Scroll**

* [Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 08.04 at 14:00 UTC.

---


## **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.
