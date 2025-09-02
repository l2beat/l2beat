---
title: "Governance Review #54"
description: "New month, fresh governance proposals."
publishedOn: "2025-06-2"
authorId: manuel-gonzalez
---

## **Optimism**

### **Season 8 and 9 Milestone and Metrics Council Selection**

The Optimism Foundation [will experiment](https://gov.optimism.io/t/season-8-and-9-milestone-and-metrics-council-selection/9963) by skipping the usual delegate vote next Season. Instead, the Collective will try a competence-first filter where candidates must tick any two of three boxes (analytics pedigree, recognised community record, formal op-sec training) to enter a pool; a Charter-writing contest decides the Lead; the rest of the seats are filled by a provably random draw from the opt-in, pre-screened list. The Foundation will publish an R script seeded with the first three integers from Ethereum block #2257600, allowing anyone to reproduce the pick.

If delegates approve the criteria during the current Reflection-Period vote (30% quorum, simple majority), the twelve-month Council will launch on time in Season 8; if they reject it, Optimism will revert to a conventional election in a later cycle, pushing the new grant term back by a month. Either way, budgets, stipends, and the right of the Token House to fire under-performers remain unchanged.


### **The Weight of Influence: An Analysis of the Power in the Collective**

SEEDGov has [created a post](https://gov.optimism.io/t/the-weight-of-influence-an-analysis-of-the-power-in-the-collective/9966) outlining a new data-driven analysis showing that Optimism’s voting base has ballooned to 115M OP, but power remains razor-thin at the top. Six addresses—one of them the Anti-Capture Commission safe—each hold more than 5M OP; adding them together, they can exceed the 34M OP quorum with room to spare. Zoom out and just 69 wallets control ≥250k OP, while 243k wallets sit below that line. Quorum has quintupled since Season 3, yet the “pod” needed to pass a proposal has stayed flat at five to seven whales, a pattern confirmed by a Gini of 0.998 and season-by-season Nakamoto indices that rarely climb above eight.

SEEDgov isn’t calling this hard capture—whales generally vote late and in step with the broader community—but they argue the Collective should start rewarding sustained participation, not just raw delegation. Ideas on the table: periodic “delegation health checks,” incentive tweaks that lift smaller voices, and a quorum formula that responds to turnout instead of a fixed 30 % of tokens. The full methodology, code, and charts are available on SEEDGov’s open Dune dashboard for anyone who wants to review the numbers.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https:///meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DAB Office Hours](https://discord.gg/optimism?event=1357733357634715970) - on 3.6 at 14:00.


## **Arbitrum**


## **Active Votes**

**Temp-check**

[Adjust the Voting Power of the Arbitrum Community Pool & Ratify the Agentic Governance Pivot](https://v1.snapshot.box/#/arbitrumfoundation.eth/proposal/0x9ea3f5ef5b6c838ffc24430bb927baa13bf25dcf5f444358e89f0958bb41a5e7) - ends on June 5 at 21:00 UTC.

[Wind Down the MSS + Transfer Payment Responsibilities to the Arbitrum Foundation](https://v1.snapshot.box/#/arbitrumfoundation.eth/proposal/0x1de2707ab4cf792721544a8f82eee98535c16ce437ba2ac95a78c85c20b6d8b0) - ends on June 5 at 23:00 UTC.


### **[RFC] Protocol Participation Request: DAO Liquidity Injection via Smart Contracts into Paribus on Arbitrum**

Paribus, a cross-chain money market already live on Arbitrum, [has asked](https://forum.arbitrum.foundation/t/rfc-protocol-participation-request-dao-liquidity-injection-via-smart-contracts-into-paribus-on-arbitrum/29331) the DAO to seed its lending pools with treasury assets, such as ARB, ETH, BTC, or USDT, via a fully on-chain deposit, rather than a grant. The protocol (six audits, pooled-liquidity design, and support for Camelot LP tokens) says that a direct smart-contract transfer would leave custody in the DAO’s hands while jump-starting utilization and rates across core markets.

Backers frame the move as “composable treasury management”: a higher passive yield for the DAO, additional TVL for the network, and a precedent for safe and transparent liquidity injections. If delegates like the idea, Paribus will supply deployment scripts, dashboards, and ongoing reporting; no third-party custody or wallet payouts required. Discussion is open in the forum, with an AMA offer on the table.


### **Arbitrum Treasury Management Council - Consolidating Efforts**

Entropy [has proposed](https://forum.arbitrum.foundation/t/arbitrum-treasury-management-council-consolidating-efforts/29334) combining three committees: TMC (ARB + stables), GMC (ETH), and STEP (RWAs), whose 20-odd members cost the DAO approximately $ 580k while managing just $50M in assets. Entropy now proposes scrapping the lot and replacing them with a single, three-part Arbitrum Treasury Management Council.



* **Execution**: Entropy Advisors will act as “Treasurer,” running budgets, allocations, and reporting.
* **Oversight**: A five-seat On-chain Allocation Team (OAT) – comprising delegates and representatives from Offchain Labs and the Foundation – must sign off on any move (requiring a 3/5 approval).
* **Comms / Ops**: OpCo (temporarily Entropy) keeps the forum updated and hires specialists for legal-risk deep dives, paid from the 1M ARB already reserved for the old committees.

The Foundation holds custody and handles KYC; Offchain Labs flags BD conflicts. Any DAO member can nuke the structure and claw back funds via a 3 % Snapshot. Net result: leaner overhead, one coherent strategy, and a clear audit trail whenever treasury cash is put to work.


### **Reallocate Redeemed USDM Funds to STEP 2 Budget**

Entropy [created a post](https://forum.arbitrum.foundation/t/reallocate-redeemed-usdm-funds-to-step-2-budget/29335) that explains that Mountain Protocol’s USDM is being wound down, so the Arbitrum Foundation has already swapped the DAO’s entire ~$3.5M balance into USDC. Now, it is requested that delegates approve a simple bookkeeping task: roll the newly liquid USDC directly into the STEP 2 RWA portfolio (30% WisdomTree WTGXX, 35% Spiko USTBL, 35% Franklin Templeton FOBXX), which the DAO approved last month.

Nothing new is spent, but every month the idle stash costs roughly $ 13k in missed money-market yield. A yes vote on the 5 June Snapshot allows the Foundation to redeploy immediately; otherwise, the cash remains unproductive until another plan emerges.


### **[Constitutional] AIP: Remove Cost Cap on Arbitrum Nova**

The Arbitrum Foundation [has created a proposal](https://forum.arbitrum.foundation/t/constitutional-aip-remove-cost-cap-on-arbitrum-nova/29332) aimed at removing Nova’s amortized-cost cap rule, which prevents batch posters from reclaiming all of their L1 data fees. When Nova launched, the cap kept transactions 30X-50X cheaper than on Arbitrum One, but after EIP-4844, that gap is barely 2X, and most “super-cheap” use-cases are drifting to tailor-made Orbit chains instead. Today, the Foundation quietly tops up the missing fees; lifting the cap (setting it to 0 bips) would push those costs back to users, end a steady deficit, and acknowledge that Nova is no longer a strategic priority.

Because the parameter resides in the ArbOwner contract, the change constitutes a Constitutional AIP: it requires its own Snapshot, a 95% “FOR” super-majority at 100M OP with an informal quorum, and then a Tally execution after the usual waiting phases.


### **AGV Monthly Update (May 2025)**

On May 8, Arbitrum Gaming Ventures [unveiled](https://forum.arbitrum.foundation/t/agv-monthly-update-may-2025/29353) its first $10 million cohort, and 22 publications, including GAM3S, news.GG, NFT Plazas, CoinLineup, and more, heralding Arbitrum as a “serious capital partner.” The fanfare accompanied AGV’s 30-page Strategic Report, which outlines how the fund will distribute cheques, grade studios, and reinvest wins back into the treasury. Behind the scenes, the pipeline maintains its shape: 30 teams are being filtered, 20 are in talks, 12 are in due diligence, and 2 are already under contract.

The venture desk is adding muscle for the second half of 2025: a Comms lead and a Venture associate are in seats; grants, legal, and ops hires are in final interviews; four GM finalists will pitch next month. June is heads-down on AGV’s first Transparency Report—putting dollar flows, deal theses and KPIs in plain view—and on widening the scouting net beyond the usual LATAM-and-Asia strongholds. Expect a busier cadence, faster ticket turns, and a louder narrative as AGV races to convert deal flow into live gamers on Arbitrum.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Open Discussion of Proposals Governance Call](https://arbitrum.huddle01.app/room/zqt-insy-uiw) - on 3.6 at 16:00.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 3.6 at 17:15.

[Arbitrum Reporting Governance Call (GRC)](https://meet.google.com/ouo-uskg-niq) - on 4.6 at 15:00.

[Bi-Weekly ARDC Office Hours](https://huddle01.app/room/dvb-zlbw-yus) - on 5.6 at 16:00.


## **Uniswap**


## **Active Votes**

**Onchain**

[Scaling V4 and Supporting Unichain](https://www.tally.xyz/gov/uniswap/proposal/89) - ends on June 6 at 06:55 UTC.

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**

Polygon’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**

Starknet’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**


### **WIP-3: Establishment of a Grants Program**

The Wormhole Foundation [has created](https://forum.wormhole.com/t/wip-3-establishment-of-a-grants-program/797/1) a proposal that asks delegates to fund a $250k grants programme that would let community members apply for small, fast funding while on-chain treasury tooling is still in the works. The scheme divides requests into two streams: one, “Funding Requests,” for tightly scoped builds, audits, or research, and the other, “Community Initiatives,” such as hackathons or marketing campaigns.

Delegates judge the pitches; the Wormhole Foundation handles KYC, legal, and off-chain payouts, maintains a running USD and $ W ledger, and files public monthly spend reports. Each grantee must publish a post-mortem report within 30 days, detailing deliverables, key performance indicators (KPIs), and receipts. The programme ends once either the $250k or the matched $W ceiling is reached, providing governance with a low-risk sandbox to test community-driven growth before a full treasury goes live.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


### **TPP-T1: Guardian Veto Rehearsal 1-2025**

Rafa from the ZKSync Foundation [has posted](https://forum.zknation.io/t/tpp-t1-guardian-veto-rehearsal-1-2025/695) a dry-run Token-Program Proposal designed to treat the network’s Guardian multisig like the real thing. Nothing on-chain will change, no ZK will be minted, moved, or burned. Still, the exercise will walk through every production step: a form proposal is filed on June 9, Guardians gather signatures on their multisig, a veto transaction is fired through verify.zknation.io, and the result must propagate cleanly to Tally and public dashboards before the 20 June deadline.

The drill checks three things: that the Token Governor’s veto hook works, that the nine-key Guardian multisig can hit quorum under time pressure, and that all the UI surfaces flip to “vetoed” without glitches. It’s the first live rehearsal since Guardian powers went live last September, and the team plans to stage them regularly so the DAO isn’t caught flat-footed when a real emergency lands.


### **Proposal Review Call June 4th**

Shelby [has opened](https://forum.zknation.io/t/proposal-review-call-june-4th/692) the sign-up thread for next Wednesday’s Proposal Review session. Authors with live or in-progress ZIPs can book a slot to walk delegates through their ideas before voting kicks off. The draft agenda already lists an emergency upgrade debrief, an L1 execution update on ZIP-10/11, and (if published in time) a chat with Marco on the Foundation’s revised Proposal Pipeline priorities. Organisers are also polling delegates on whether to pause the broader Delegate Calls in June and July, and keep only these slimmer review meetings.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja ) - on 4.6 at 15:30.


## **Scroll**


## Active Votes

[Mexico Mobile Scroll Node: A Founder-Focused Onboarding and Support Program](https://gov.scroll.io/proposals/114680805729741159569971518812616048798080444144101888781732583325687922627492) - ends on June 11 at 07:13 UTC.

[Proposal: Ecosystem Growth Council Formation](https://gov.scroll.io/proposals/37386950132766861326866912187409034146419699671647692599823147718145650269944) - ends on June 11 at 07:13 UTC.

[Proposal: Gov Contribution Recognition - Retro & Working Group](https://gov.scroll.io/proposals/17078711500921114892153572976930164752301783599860969477344135870045421447376) - ends on June 11 at 07:13 UTC.

[Proposal Title: Votable Supply Adjustment - Auto-Abstaining Wallet](https://gov.scroll.io/proposals/5409234667693180350061650128008163181727456255407133381292624146987676794170) - ends on June 11 at 07:13 UTC.

[Kenya Scroll Local Node Founder Program](https://gov.scroll.io/proposals/48311222747566613620194412824332343511682265633997619649987934699400104272413) - ends on June 11 at 07:13 UTC.

[Proposal: Brazil Local Node](https://gov.scroll.io/proposals/10788024663134534423374741294029742427268134139357452464192978354023080129151) - ends on June 11 at 07:13 UTC.


### **CCC3 July 2025: Scroll DAO Org Design**

Eugene from the Scroll Foundation [has proposed](https://forum.scroll.io/t/ccc3-july-2025-scroll-dao-org-design/786) a “CCC3”, a July sprint to redesign the DAO’s org chart. Running from 9 July through the end of the month, the third Co-Creation Cycle will bring delegates together in four weekly workshops: re-checking Scroll’s strategy, auditing current and missing workstreams, sketching any new councils the DAO needs, and pinning KPIs to every unit. The aim is to ease proposal overload by shifting from all-hands Snapshot votes to smaller, mandate-driven bodies that report back to the DAO. Expect extra governance calls, live Miro boards, and off-chain signalling polls. Organisers are now taking schedule feedback, especially regarding post-ETHCC travel.


### **Proposal: Gov Contribution Recognition - Retro & Working Group**

Eugene from the Scroll Foundation has [created a post](https://forum.scroll.io/t/proposal-gov-contribution-recognition-retro-working-group/799) that asks delegates to support the first-ever system for compensating contributors who maintain Scroll’s governance. Phase 1 is a six-month retro-fund: anyone who voted at least once since launch receives a token compensation, while heavier contributors (drafting proposals, attending calls, posting forum analysis, and participating in the Negation Game research) can earn up to ~15,000 USD in SCR under a points-based formula. The pool earmarked for this back pay totals approximately 585,000 SCR.

To avoid ad-hoc fixes in the future, the plan also establishes a three-person “GCR Working Group” (budget: SCR 30,000) that will deliver a new, data-driven rewards framework from June to August. Recruitment opens immediately after the June vote. The team’s refined model is expected to be posted on the forum by mid-July and will proceed to a DAO vote on August 1. The total ask is 614,645 SCR, with unclaimed funds rolling into future GCR rounds. Delegates who dislike the fast-track or any detail are urged to vote ‘against’ and push the overhaul to July instead.


### **Report: Scroll Mainnet Emergency Upgrade on 2025-04-25**

Haichen [has created](https://forum.scroll.io/t/report-scroll-mainnet-emergency-upgrade-on-2025-04-25/666) a post detailing the two critical bugs that surfaced in late April. Axiom flagged a soundness flaw in the OpenVM 1.0.0 circuit: an iterator skipped a limb, allowing a rogue sequencer and prover to sneak invalid proofs past the on-chain verifier. Separately, an Immunefi white-hat revealed that recent Euclid changes enabled a forged L2 withdrawal to spoof L1ScrollMessenger, opening the door to unlimited ETH/ERC-20 mints. Scroll paused the EnforcedTxGateway within hours, patched both issues (with one-line fixes in the circuit and messenger), and the Security Council pushed an emergency upgrade on 25 April following a multi-sig review. No user funds moved, and Trail of Bits has since attested to the remedies’ soundness; deeper fuzzing, formal verification, and multi-proof safeguards are now being rolled into the roadmap.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Weekly DAO & Governance Call](https://meet.google.com/smr-hxgd-btt) - on 4.6 at 11:30.

[Weekly DAO & Governance Call](https://meet.google.com/mhz-ncvc-ipd) - on 4.6 at 17:00.