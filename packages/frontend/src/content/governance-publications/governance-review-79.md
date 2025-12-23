---
title: "Governance Review #79"
description: "Governance heads into year-end mode with wrap-ups and incremental improvements."
publishedOn: "2025-12-23"
authorId: manuel-gonzalez
---

## **TL;DR**

*On **Optimism**, Season 8 of the Growth Apps grants wrapped up with a 100% budget allocation (6.29M OP) for the first time, approving 24 of 91 applications. AI-assisted intake reduced reviewer load but still required human overrides, reinforcing that automation works best with strong human oversight.*

*On **Arbitrum**, OpCo published the Terms and Conditions for the RAD program, clarifying delegate expectations around conduct, diligence, and accountability, and announced SEED as RAD Program Manager at $5k/month with a scoped operational mandate. Nerite also announced its “Winning Together” campaign, committing 3M NERI tokens (3% supply) to the Arbitrum DAO treasury as a long-term alignment play.*

*On **ZKsync**, a secondary governance interface went live at alt.vote.zknation.io, adding redundancy and UX improvements while Tally remains the primary interface.*

*On **Polygon**, an RPC incident caused a brief availability degradation due to stalled Bor nodes, but the chain remained live with no consensus or safety impact; the issue was resolved through coordinated upgrades and resyncs.*


## **Optimism**


### **Cycle 46 and Season 8 Final Grants Report**

Gonna.eth [shared](https://gov.optimism.io/t/cycle-46-and-season-8-final-grants-report/10503) the final report for Cycle 46, which also closes Season 8 of Optimism’s Growth Apps grants. Season 8 processed 91 unique applications, approved 24 grants, and allocated 100% of the 6.29M OP budget for the first time, with 2.49M OP granted in the final review stage. A key operational shift this season was the full deployment of AI-assisted intake (GovNerds), which reduced reviewer load but still required human overrides due to false negatives, highlighting that AI is not yet ready to operate autonomously. The season also marked improvements in selectivity, review cadence (weekly), and platform operations, with Karma playing a central role in streamlining grants management.


## **Arbitrum**


### **Terms and Conditions of RAD**

OpCo [has published](https://forum.arbitrum.foundation/t/terms-and-conditions-of-rad/30347) the Terms and Conditions for Arbitrum’s Rewarding Active Delegates (RAD) program, setting clear expectations for participants around conduct, diligence, and accountability. The document outlines core principles such as values alignment, good-faith participation, conflict-of-interest awareness, and civility, while reinforcing that delegates are expected to stay informed, vote responsibly (including abstaining when needed), and communicate their rationale transparently.

Beyond behavioral standards, the terms emphasize collective responsibility for maintaining productive governance, encourage consistent participation, emphasize responsiveness to the community, and require adherence to existing DAO social agreements, with these terms taking precedence in case of conflicts.

**L2BEAT’s take**

As with any incentive initiative, formalizing expectations alongside incentives is essential. Clear rules help reduce ambiguity around delegates' responsibilities and make programs like RAD easier to defend and replicate, especially as participation grows.


### **RAD Program Manager & Scope of Work**

OpCo [has communicated](https://forum.arbitrum.foundation/t/rad-program-manager-scope-of-work/30348) to the DAO that SEED will be the Program Manager for Arbitrum’s Rewarding Active Delegates (RAD) program, with a narrower scope than the previous DIP, given RAD’s more focused design and OpCo’s continued operational involvement. SEED will be compensated $5,000 per month and will work alongside OpCo to improve execution speed, coordination, and reporting, with any scope or compensation changes to be communicated publicly.

The scope covers end-to-end program operations, including participant onboarding and compliance, proposal classification and eligibility, reward calculations, monthly reporting and payouts, and bi-annual transparency reporting. Responsibilities also include coordinating with proposers, curating voting data and rationales, and maintaining public accounting to ensure traceability and auditability.

**L2BEAT’s take**

A scoped PM role makes sense for RAD. Keeping operations lean while assigning clear ownership should help reduce friction and turnaround time, especially during busy voting periods, and the defined deliverables create a solid baseline for accountability.

That said, the $5k/month fee feels a bit high for a program intentionally narrower than DIP, and from the outside, it can be hard to gauge what additional value that cost is unlocking beyond OpCo’s own operational capacity. Having a simple, consistent way to demonstrate the PM’s impact over time would make the spend easier to evaluate and justify.


### **Nerite’s “Winning Together Campaign” rewards Arbitrum DAO.**

In [a post](https://forum.arbitrum.foundation/t/nerites-winning-together-campaign-rewards-arbitrum-dao/30364) by cupojoseph, Nerite Protocol announced its upcoming Winning Together Campaign (early 2026), which would allocate 3,000,000 NERI governance tokens to the Arbitrum DAO Treasury (stated as 3% of total supply) ahead of NERI’s expected early-2026 launch. Tokens are planned to be transferred directly to the treasury with no DAO action required, framing the move as long-term alignment between Nerite’s success and Arbitrum’s governance quality.

The post also highlights deeper alignment through governance participation (Nerite DAO serving as an Arbitrum DAO delegate) and suggests a potential long-term revenue path if Nerite becomes relevant to treasury management, given the protocol’s ARB-backed borrowing use case.


## **Scroll**

Scroll’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Upcoming Events**

[CoCreation Sprint AM Session](https://meet.google.com/ung-vysq-vgm) - on 22.12 at 15:00 UTC.

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 22.12 at 17:00 UTC.

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 23.12 at 15:00 UTC.


## **ZKSync**


### **Secondary Governance Interface Now Live!**

ZKsync’s Governance Team [announced](https://forum.zknation.io/t/secondary-governance-interface-now-live/862) that [alt.vote.zknation.io](alt.vote.zknation.io) is now live as a secondary governance interface, letting delegates and ZK holders delegate voting power, vote on proposals, and submit proposals. The site adds a few UX extras, including delegate vote-history previews, delegate search by name (not just ENS), and easier copying/formatting of full proposal text. The rollout follows a June 2025 RFP to replace the deprecated Boardroom interface. A team was selected in September, and development began in October, while [vote.zknation.io](vote.zknation.io) (Tally) remains the primary interface.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**


### **Polygon PoS RPC Incident: Post-Incident Summary**

Polygon Labs [published](https://forum.polygon.technology/t/polygon-pos-rpc-incident-post-incident-summary/21487) a post-incident summary of an RPC disruption in which a subset of Bor nodes stalled or fell behind the network tip, resulting in degraded RPC availability across multiple providers. Some apps experienced connectivity issues due to RPC routing, and the block explorer temporarily lagged, resulting in a knock-on finality delay as many validator nodes were stuck. Polygon notes that block production continued without downtime or safety impact, and that some RPC endpoints remained fully operational during the incident.

The issue was isolated to the Bor (execution/block-producing) layer. Polygon Labs activated a war room, coordinated with validators and RPC providers, and rolled out a fix. Affected node operators were instructed to upgrade to bor v2.5.6-beta3 and resync, while end users generally did not need to take any action beyond relying on recovered RPC providers.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Uniswap**


## **Active Votes**

[Strategic Renewal of Gnosis, Linea, and Mantle Deployments](https://www.tally.xyz/gov/uniswap/proposal/92) - ends on December 24 at 07:39 UTC

[UNIfication](https://www.tally.xyz/gov/uniswap/proposal/93) - ends on December 25 at 06:25 UTC

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**

Starknet’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.
