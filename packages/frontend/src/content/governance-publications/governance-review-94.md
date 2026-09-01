---
title: "Governance Review #94"
description: "Less Guess, More Process."
publishedOn: "2026-05-11"
authorId: manuel-gonzalez
---

## **TL;DR**

*In* ***Arbitrum***, *governance is increasingly centered on operational coordination and incentive design. OpCo continues expanding its role across DAO programs and treasury-related initiatives, while updates to RAD and Watchdog reflect a broader effort to make delegate participation requirements more practical and streamline the transition of operational responsibilities.*

*In* ***Optimism***, *the Grants Council continues taking a selective approach to ecosystem funding, approving only projects with strong alignment and measurable impact on OP Mainnet activity, reinforcing a more disciplined capital allocation strategy.*

*In* ***ZKsync***, *governance is taking a larger role in protocol-level operations and token mechanics. Following the shutdown of ZKsync Lite block production, control over the claim system is shifting to governance, while the newly introduced Fee Flow System lays the groundwork for routing protocol fees through governance-controlled auctions and token burns.*

***Elsewhere***, *Polygon continues refining its validator and payments infrastructure, Uniswap expands security support for developers building on its ecosystem, and Scroll is exploring continuous auditing systems as protocols move toward more proactive security practices.*

---

## **Optimism**


### **Cycle 51 Grants Council Report**

Gonna.eth [shared](https://gov.optimism.io/t/cycle-51-grants-council-report/10671) the Cycle 51 report for the Optimism Grants Council, outlining the review results for the latest batch of grant applications.

Out of three applications reviewed, only Bedrock received conditional approval, securing 300K OP in funding, while Origin Protocol and Pivot Bot were declined. The update reflects the council’s continued focus on projects with strong alignment to Optimism’s goals and clear impact on OP Mainnet deployment and activity.


---

## **Arbitrum**


### **Announcement of Dynamic Reserve Price Change**

Offchain Labs [announced](https://forum.arbitrum.foundation/t/announcement-of-dynamic-reserve-price-change/30833) an update that outlines the transition of Timeboost’s reserve price from a fixed value to a dynamically adjusted one on Arbitrum.

The reserve price will now update every minute based on market conditions, with real-time data available through a public API. The change aims to improve auction efficiency, better reflect participant behavior, and increase DAO revenue, while maintaining a balance between trading quality and competitiveness in the transaction ordering system.


### **Firestarters - April Monthly Update**

OpCo [shared](https://forum.arbitrum.foundation/t/firestarters-april-monthly-update/30852) an update that outlines the current status of the last two ongoing grants under the Firestarters program, which has now officially concluded.

The remaining projects include a yield and risk dashboard by Today in DeFi focused on improving transparency for DeFi assets, and a research initiative by LamprosDAO analyzing the impact of stablecoins on sequencer revenue. Both grants are still in progress, serving as final deliverables following the program’s completion.


### **Watchdog Program Nears Transition Phase Following April Update**

Entropy [shared](https://forum.arbitrum.foundation/t/watchdog-program-april-2026-update/30856) the April update for Arbitrum’s Watchdog Program, highlighting continued investigations into legacy incentive programs and the gradual transition of responsibilities to OpCo.

The program received 8 new reports during April, bringing total recoveries to over 457K ARB, while most remaining investigations have now been closed. The update also confirms that reports tied to programs before 2025 will no longer be eligible after May 10, marking a shift toward focusing on newer initiatives. At the operational level, OpCo has begun onboarding into the system, while the existing reviewing committee and the Arbitrum Foundation will continue supporting the transition process.

### **Arbitrum Adjusts RAD Eligibility Requirements**

OpCo [shared](https://forum.arbitrum.foundation/t/rad-eligibility-requirements-update/30862) an update outlining changes to the eligibility requirements for Arbitrum’s Rewarding Active Delegates (RAD) program, following community feedback collected during previous monthly updates.
Starting from May 2026 votes onward, the participation threshold will be reduced to 50% of proposals in most months, increasing to 75% only when there are five or more votes. In addition, delegates who fail to publish a voting rationale within five days will no longer lose their full rewards, instead receiving a 10% reduction. The changes aim to make the program more flexible while still encouraging active participation and transparency from delegates.

### **OpCo Update May 2026**

Frisson [shared](https://forum.arbitrum.foundation/t/opco-update-may-2026/30865) the May 2026 update for Arbitrum’s OpCo, outlining progress around hiring, DAO operations, and coordination across governance initiatives.
The update highlights the hiring of a new Director of Finance and Treasury, ongoing recruitment for a Head of OpCo role, and expanded involvement across programs like RAD, Watchdog, and Security Council elections. OpCo also continues working alongside Entropy on treasury-related responsibilities and incentive structures, while preparing upcoming transparency reports and future OAT elections.


---

## **ZKsync**


### **ZKsync Lite Claim Contract Transition to Governance**

The ZKsync Governance Team [shared](https://forum.zknation.io/t/zksync-lite-claim-contract-transition-to-governance/982) an update outlining the transition of the ZKsync Lite claim contract from Matter Labs to the ZKsync governance system following the shutdown of ZKsync Lite block production.

Under the new structure, governance will oversee future decisions related to the claim mechanism and any remaining unclaimed funds, while the Emergency Upgrade Board retains authority to intervene in critical situations. The transition marks the final operational step in sunsetting ZKsync Lite and shifting remaining protocol responsibilities to decentralized governance.


---

## **Uniswap**


### **Uniswap Foundation Security Fund (UFSF) - May 2026 Cohort Applications are Open**

The Uniswap Foundation [announced](https://gov.uniswap.org/t/uniswap-foundation-security-fund-ufsf-announcement-thread/24878/30) that applications are now open for the May 2026 cohort of its Security Fund (UFSF), aimed at supporting teams building within the Uniswap ecosystem.

Selected projects will receive access to pre-audit security tools, full or partial audit subsidies, and ongoing guidance throughout the audit process. The initiative is designed to reduce security-related barriers for early-stage teams, particularly those working with Uniswap v4 and related infrastructure, with applications open until May 7.

---


## **Polygon**


### **PIP-86: Recalibrate CHECKPOINT_REWARD for reduced Polygon block times**

Simon Dosch [created](https://forum.polygon.technology/t/pip-86-recalibrate-checkpoint-reward-for-reduced-polygon-block-times/21864) a proposal that outlines an update to Polygon’s CHECKPOINT_REWARD parameter to account for upcoming reductions in block time.

As block times decrease from ~2 seconds to 1.75s and later to 1.5s, the number of checkpoints per year will increase, which would otherwise lead to higher validator emissions. The proposal adjusts rewards downward in two steps to keep total annual POL emissions stable at the 1% target, maintaining consistent validator incentives despite faster network performance.


### **PIP-87: Fixed Cost Payments Revenue Program**

Sandeep Nailwal, David Silverman, John Egan, and Jeremy Brenner [created a proposal](https://forum.polygon.technology/t/pip-87-fixed-cost-payments-revenue-program/21865) that outlines a fixed-cost revenue program for payment providers building on Polygon.

The proposal introduces predictable, fiat-denominated pricing for blockspace, aiming to reduce fee volatility for payment companies and support higher on-chain payment volumes. Revenue generated through the program would be converted into stablecoins and distributed to validators and stakers, while also funding POL buybacks and burns, aligning increased network usage with tokenholder value.


---

## **Scroll**


### **Proposal: Evaluating an Automated Pre-Audit Security Layer to Strengthen Scroll’s zkEVM, Bridge, and Rollup Contract Pipeline**

Olympix [created a proposal](https://forum.scroll.io/t/proposal-evaluating-an-automated-pre-audit-security-layer-to-strengthen-scrolls-zkevm-bridge-and-rollup-contract-pipeline/1473) that outlines an evaluation of an automated, continuous security layer for Scroll’s core smart contracts, including its zkEVM, bridge, and rollup systems.

The proposal suggests testing a toolkit that runs static analysis, automated testing, and audit-like checks on every code change, aiming to catch vulnerabilities earlier in the development cycle. Rather than replacing existing audits, the initiative is positioned as an additional layer to assess whether continuous security monitoring can reduce risks, especially those introduced between audit cycles.


---


## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.

* **Everclear**
* **Wormhole**
* **Hop**
* **Starknet**
* **Lisk**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---


## **Upcoming Events**

**Arbitrum**

* [OpCo Operations - Office Hours](https://meet.google.com/smt-yobq-oww) - on 12.05 at 15:30 UTC.
* [Open Discussion of Proposals Governance Call](https://meet.google.com/dfo-xora-ysp) - on 12.05 at 16:00 UTC.
* [Arbitrum Reporting Governance Call (GRC)](https://meet.google.com/kkv-icxy-xor) - on 13.05 at 16:00 UTC.


**Scroll**

* [Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 13.05 at 14:00 UTC.
* [Scroll DAO Office Hours](https://meet.google.com/dcv-rodm-dfd) - on 15.05 at 14:00 UTC.


**ZKsync**

* [Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 13.05 at 15:30 UTC.


**Optimism**

* [Grants Council Office Hours](https://meet.google.com/vue-azfy-ebg) - on 13.05 at 15:30 UTC.


**Hop**

* [Hop Community Call](https://discord.com/login?redirect_to=%2Fchannels%2F789310208413270078) - on 13.05 at 17:00 UTC.

---


## **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.
