---
title: "Governance Review #73"
description: "Elections on Optimism, incentives on Arbitrum, activation on ZKsync; plus key infra moves elsewhere."
publishedOn: "2025-10-21"
authorId: manuel-gonzalez
---

## TL;DR

*Optimism Security Council elections in progress. Voting for Cohort A and the Lead closes on Oct 22.*

*Arbitrum Busy governance week. DIP 2.0 and Triple Dip under debate, Firestarter Fund proposed, Entropy IPS update pending, emergency Stylus fix executed, and “Aegis” floated as a 10M ARB insurance pool.*

*ZKsync Voting continues, and community programs expand. The Foundation detailed the Community Activation RFPs and the Devconnect Buenos Aires meetup RFP closes on Oct 17.*

*Elsewhere, Scroll introduces the SBRF bridging toolkit and tightens Local Node KPIs. Starknet advances Bech32m and Unified Addresses for safer UX. Polygon considers zero POL inflation with buybacks and PIP-74 to embed StateSync in block bodies.*

## **Optimism**

## **Active Votes**

[Security Council Elections Cohort A Members](https://vote.optimism.io/proposals/47939764654845104552261722485539617002410064905544331999528786700108507099119) - ends on October 22 at 20:27 UTC.

[Security Council Elections: Cohort A Lead](https://vote.optimism.io/proposals/28197030874936103651584757576099649781961082558352101632047737121219887503363) - ends on October 22 at 20:27 UTC.


### **Optimism Security Council Elections: Cohort A**

Right now, the Optimism DAO is running Security Council elections to choose [seven Cohort A members](https://vote.optimism.io/proposals/47939764654845104552261722485539617002410064905544331999528786700108507099119) and the [Cohort A Lead](https://vote.optimism.io/proposals/28197030874936103651584757576099649781961082558352101632047737121219887503363), with voting open from Oct 16 to Oct 22. Member positions are assigned by approval voting, where delegates can vote with all their VP for each candidate of their choice.

The Lead is a separate vote focused on coordination and process, and needs at least 51% of the quorum in yes votes to pass. 

For this vote, the L2BEAT Governance Team takes input from our Research Team to ensure that our votes go to those nominees whom we have full confidence are the best fit for this role. We will be casting our votes and sharing a short rationale later this week.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events**

[DAB Office Hours](https://meet.google.com/pgj-ibvv-trr) - on 21.10 at 14:00 UTC.


## **Arbitrum**

## **Active Votes**

**Offchain**

[AGV Council Compensation Calibration: Benchmark for Future Council Terms](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xdfdf56e53e2a77968c2c124be9210a5f33cb2261cca00e1d6b04f8bb6dfa626d) - ends on October 23 at 12:13 UTC.

[Should we try a Delegate Incentive Program like the Arbitrum Triple Dip?](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xb9e775ba4f1fa8cdc8e45c342428c3dabff7f19ce7b8cc4bde7cc6c8e542d963) - ends on October 23 at 22:11 UTC.

**Onchain**

[Transfer 8,500 ETH from the Treasury to ATMC’s ETH Treasury Strategies](https://www.tally.xyz/gov/arbitrum/proposal/57495998481040869152703890521939307107269690440073097268210566577740258992963?govId=eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) - ends on October 30 at 23:49 UTC.


### **Security Council Emergency Action**

At 12:23 ET on Oct 13, the Arbitrum Foundation [alerted](https://forum.arbitrum.foundation/t/security-council-emergency-action-10-13-2025/30093) the Security Council to a Stylus-related bug observed on Arbitrum Sepolia (block 204060366) that could cause chain divergence by affecting practical gas usage via native vs. virtual stack depth. According to the post, no funds were ever at risk. The fix was a single ArbOS config change executed as an emergency upgrade on Arbitrum One and Nova at 14:30 ET after a rapid-sign process (11/12 members present; ≥9 required). Council members independently verified payloads.

Sepolia ARM-based Nitro nodes should temporarily switch to x86. For the future, a resync from an x86 snapshot at block 204060366 or upgrade to the forthcoming Nitro release will be needed. No action was required for Arbitrum One or Nova operators.


### **Arbitrum DAO Firestarter Fund**

The OpCo [has created](https://forum.arbitrum.foundation/t/non-constitutional-arbitrum-dao-firestarter-fund/30101) a proposal that aims to establish a $ 1M ARB Firestarter Fund to rapidly support small, promising ideas that require initial funding and structure before evolving into full DAO proposals. OpCo would source candidates, line them up with AAE priorities, manage the whole process, and share monthly reports so everyone can see what was funded and how it’s going. 

The team points to past “Firestarters” wins like the STIP groundwork, the RWA program (STEP), and the ADPC framework as proof that the model can unlock bigger initiatives. The fund remains active until it is depleted or the DAO decides otherwise. First-year targets include securing at least 10 new contributors, transitioning 3 projects into longer-term initiatives, and completing over 90% of funded scopes. If this passes, funds will go to a Foundation multisig until OpCo can take over operations. Timeline is a forum discussion from Oct 17 to Oct 30, Snapshot from Oct 30 to Nov 6, with Tally planned for Nov 13.

**L2BEAT’s take:**

We like the objective and, in general, we support the concept of the firestarter initiatives. That said, there are some aspects of this draft that still seem unclear to us and make us skeptical about the scope of this proposal. We will post questions on the forum to raise our concerns and get a clearer picture.


### **[DIP v1.7] Delegate Incentive Program Results (September 2025)**

SEED has [posted](https://forum.arbitrum.foundation/t/dip-v1-7-delegate-incentive-program-results-september-2025/30099) the DIP results for September. 48 delegates enrolled this month, and 52 met the criteria to qualify. Scoring covered two Snapshot constitutional votes and one Tally constitutional vote. In total, 30 delegates earned compensation, led by L2BEAT in Tier 1, 6 delegates in Tier 2, 6 in Tier 3, and 17 in Tier X. Payouts sum to $52,592.05, with detailed breakouts and feedback available in the Karma dashboard and public tables. Bonus Points were also awarded for governance call attendance (up to 3.75% this month), notable ecosystem contributions, and DRIP amplification.


### **The DAO Incentive Program (DIP 2.0)**

Arbitrum’s [DIP 2.0](https://forum.arbitrum.foundation/t/the-dao-incentive-program-dip-2-0/30080) reframes incentives across two tracks and a vouch-gated Peer Assembly. Delegates earn on a per-proposal basis for voting and posting public rationales, with published budgets, payout caps, and distribution curves aimed at predictability and cost control. Contributors are recognized through a monthly peer-recommendation slate, which includes fixed awards and occasional special citations. Additionally, time-boxed “nudge seasons” are implemented to reward behaviors that have been shown to lift participation. The program operates under OpCo oversight, utilizing the remaining DIP multisig balance, and establishes clear guidelines for membership, record-keeping, and transparency. Community calls are scheduled through late October, and an off-chain temperature check is planned for October 23, preceding the launch post-onboarding.

**L2BEAT’s take:**

From our perspective, this new structure feels heavier without a clearer vision of what behaviours the DAO actually wants to incentivize. This is something that we feel the DIP program has had in the past, and this current version isn’t solving it.

Another thing is that the added layers around a Peer Assembly, vouching, and multiple reward tracks make the model overcomplicated without enough reasons. Also, there is a clear overlap with another incentive proposal, and so far, we have not seen any plans to reconcile the scope or collaborate between the proposals. For now, in this current form, we are inclined to vote against both proposals.

### **Arbitrum Aegis**

WinVerse [proposes](https://forum.arbitrum.foundation/t/non-constitutional-arbitrum-aegis/30071) seeding “Arbitrum Aegis,” a 10M ARB pool on Nexus Mutual to underwrite major DeFi risks on Arbitrum and generate yield from premiums. Cover would span exploits, severe oracle manipulation, liquidation failures, and governance attacks, with claims processed through Nexus Mutual’s independent governance. DAOplomats would manage capacity and pricing and take a 7.5% performance fee on positive net yield. Funds would be held in a 2-of-3 multisig, including OpCo and the Foundation, then used to mint and stake NXM. Modeled outcomes indicate modest yet productive returns, converting idle treasury assets into a public good, tempered by the reality that staked capital is at risk when valid claims occur.

**L2BEAT’s take:**

We find this initiative quite interesting, but at this stage, it needs extra debate and clarity in detail. We will follow the discussion, and later we will formulate our opinion around it.


### **Entropy Advisors Monthly Update — September 2025**

The Entropy Advisor monthly update [says](https://forum.arbitrum.foundation/t/entropy-advisors-monthly-update-september-2025/30073) that the ATMC ends August at $87.9M (+$8.3M) on stronger ETH and a $2.9M budget top-up, with 249 wstETH added to Camelot and $4.5M USDC placed into Morpho’s Prime Vault; RWAs continue yielding ~$138K. 

The Snapshot to transfer 8,500 ETH passed (113M FOR), and on-chain execution is queued after an Oct 9 call that previewed a draft Investment Policy Statement. Contracts for KPK and Avantgarde are in final legal review; the remaining $3.3M USDC deploys once signed. DRIP Season 1 transitions into its performance phase, following a period of reduced discovery spending and a strategic pivot toward stablecoin markets. The updated Code of Conduct is now live. Stylus Sprint disbursements are nearing 35.9%, and the Watchdog portal is operational, with reports currently under triage.

**L2BEAT’s take:**

The IPS direction looks promising, and based on recent calls, we understand that more details should be shared soon. We’ll wait for those updates before stating a final position on the ATMC plan that’s currently up for a vote.

**Upcoming Events**

[Arbitrum Triple Dip Open Discussion](https://meet.google.com/yad-hqxo-kam) - on 21.10 at 16:00 UTC.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 21.10 at 17:15 UTC.

[The DAO Incentive Program (DIP 2.0): Open Discussion #2](https://meet.google.com/trx-xenn-szp) - on 22.10 at 17:00 UTC.

[Mini Apps on Arbitrum](https://meet.google.com/wyb-ycgk-cij) - on 23.10 at 15:00 UTC.

## **ZkSync**

## **Active Votes**

[ZKsync Governance System Infrastructure Funding](https://www.tally.xyz/gov/zksync/proposal/8043865517871673466500920771587039178855876090726876272793935297016439640908?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on October 29 at 07:55 UTC.

[ZKnomics Token Staking](https://www.tally.xyz/gov/zksync/proposal/97314764080859415498674952864578860560861880297360481348949362100730414449748?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on October 29 at 07:50 UTC.

### **ZKsync Prividium Roadshow Event Sponsorship Suggestion Form**

Matter Labs’ Events team will lead curation for the Prividium Roadshow, and the community is invited to pitch speaking slots, sponsorships, or on-the-ground activations that fit the program’s scope. Share your ideas via the dedicated [ZKsync Prividium Roadshow Event Suggestion Form](https://docs.google.com/forms/d/e/1FAIpQLSf7EYx4RP2gmvlDVx_b2SbfrGAudq4RJDBGl1s_Nf3aaIjRsQ/viewform). The ZKsync Foundation (as program admin) will review additions not already listed and will reach out if your suggestion is selected. Pro tips: include dates, target audience, expected reach, and a rough budget so reviewers can move fast.

### **RFP Explainer for Community Activation Pilot Program**

The ZKsync Foundation [published a post](https://forum.zknation.io/t/rfp-explainer-for-community-activation-pilot-program/789) explaining the Community Activation Pilot in detail. The pilot allocates 13.6M ZK to an RFP pool and outlines how targeted initiatives will be funded across four tracks: Product Marketing & Activation, Adoption Enablement, Data & Transparency, and Community Tooling. Each RFP defines a specific need, with the Foundation managing submissions, evaluation, and awards (paid in ZK, either upfront, milestone-based, or phased). New RFPs will roll out continuously through 2025–2026.

### **Independent Delegate Contributor — Call & Next Steps**

The Foundation has [acknowledged applicants](https://forum.zknation.io/t/community-activation-pilot-independent-delegate-contributor-note/801) for the Independent Delegate Contributor role and will tap candidates as specific RFPs warrant additional reviewer or executor capacity. Interested delegates can still [register](https://forms.gle/werSHL7zYaZvjYWa9) interest by sharing their profile, motivation, and experience via the form linked in the thread; outreach will occur on a rolling, as-needed basis.

### **ZKsync Community Devconnect Meetup**

The first call seeks a partner to run an independent ZKsync meetup during Devconnect week in Buenos Aires (Nov 17–22). The aim is practical: grow local awareness, connect builders, and onboard newcomers through an accessible format, showcases, workshops, lunch-and-learns, or a structured co-working session. One recipient will receive 100,000 ZK (≈$5,000) to handle venue, agenda, speakers, promotion, catering, AV, and day-of hosting, and must publish a post-event summary with attendance, takeaways, and photos by Dec 1. 

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 22.10 at 15:30 UTC.

## **Polygon**

### **Proposal: Revision of POL Tokenomics – Elimination of 2% Inflation and Introduction of Treasury Buyback/Burn Policy**

VentureFounder [has floated](https://forum.polygon.technology/t/proposal-revision-of-pol-tokenomics-elimination-of-2-inflation-and-introduction-of-treasury-buyback-burn-policy/21323/1) a draft PIP to overhaul POL’s supply mechanics by zeroing out the current 2% annual inflation and introducing a transparent buyback or burn program funded by treasury surpluses and ecosystem revenues. The motivation is straightforward: persistent underperformance and dilution have weakened confidence, while fees and treasury rather than emissions can increasingly cover validator incentives. The preferred path sets inflation to 0% at the next upgrade, with a fallback taper of 0.5% per quarter to reach zero. A minimum of 20% of quarterly net inflows would be earmarked for on-chain buybacks or burns, quarterly reports would disclose supply and treasury movements, and a public dashboard would track metrics in real time. The plan phases through community debate in Q4 2025, an on-chain vote in Q1 2026, a parameter switch to 0% in Q2 2026, and buyback/burn operations beginning in Q3 2026, without consensus-layer changes and with temporary validator top-ups if needed.

### **PIP-74: Canonical Inclusion of StateSync Transactions in Block Bodies**

PIP-74 [proposes](https://forum.polygon.technology/t/pip-74-canonical-inclusion-of-statesync-transactions-in-block-bodies/21331) a clean accounting fix on Polygon PoS: encode StateSync activity as a single, typed, zero-gas system transaction appended to any block that executed StateSyncs. Today, StateSyncs mutate state but don’t appear in the block’s transaction list, so their effects aren’t reflected in transactionsRoot, receiptsRoot, or logsBloom. By anchoring a canonical StateSync transaction with per-event logs, the proposal makes inclusion and outcomes provable from block data alone, improves snap-sync trustlessness and observability, and removes side-channel handling in clients and RPCs. The change is consensus-breaking post-fork because block roots and tx lists change. Still, it preserves prior PIPs on eligibility, observability, and replay, leaves stateRoot and gasUsed unaffected, and formalizes a typed transaction (0x7F) with standard hashing and a structured inner payload.

## **Starknet**

### **SNIP 42: Bech32m Address Encoding for Starknet**

SNIP-42 [proposes](https://community.starknet.io/t/snip-42-bech32m-address-encoding-for-starknet/116000/1) moving Starknet’s user-facing addresses from raw 0x-hex to Bech32m strings with HRP prefixes. Two prefixes launch the scheme: strk for public contract/account addresses and strkx for future shielded receivers. The change is interface-only, on-chain addresses remain felt252, yet it meaningfully improves safety and UX by adding strong checksums, rejecting mixed case, and creating clear namespaces for address types and networks. For strk v0, a canonical 251-bit address is serialized as exactly 32 bytes, converted to 5-bit groups, version-tagged, and encoded; decoding enforces the top-bit rules to guarantee a unique textual form. Hex remains accepted during a phased rollout, while wallets, SDKs, RPCs, and explorers are encouraged to display Bech32m by default, accept both encodings, and add dual search and copy toggles.

### **SNIP-43 Unified Bech32m Addresses and Viewing Keys for Starknet**

SNIP-43 [builds](https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001) on SNIP-42 with a unified Bech32m address format that lets users share one string while wallets pick the most private supported receiver. It defines three HRPs: strk for public, strkx for shielded (opaque, versioned), and strku for a Unified Address that bundles multiple receivers via a simple TLV payload and a flag controlling public fallback prompts. The SNIP also introduces Unified Viewing Keys (full and incoming) plus lightweight Detection Keys so wallets can scan a future multi-asset shielded pool efficiently, without granting spend authority. All changes are interface-level, on-chain types remain felt252, and include guidance for RPCs, SDKs, and explorers to parse, select receivers deterministically, and present Bech32m by default while preserving hex for compatibility.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Everclear**

### **RFC - Amarok Technical Upgrade Proposal (Asset Recovery & Withdrawal)**

Max Kalyuzhnyi [proposes](https://forum.connext.network/t/rfc-amarok-technical-upgrade-proposal-asset-recovery-withdrawal/1403) a limited upgrade to the paused Amarok system to return stranded funds. The Security Council would withdraw all canonical assets from Ethereum-side Amarok contracts to a community-admin multisig, burn the mistakenly held xCLEAR on mainnet, and temporarily allow LPs on supported chains to remove liquidity while contracts remain paused. A claims UI will let users redeem by burning their following assets and submitting proof of burn; in-flight xcalls can claim similarly. The claim window is six months, after which unclaimed funds revert to the DAO.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming events**

[Everclear Delegates Call](https://meet.google.com/zcv-aqph-pcj) - on 23.10 at 14:00 UTC.

## **Scroll**

### **Scroll Bridge Reliability & Finality (SBRF)**

Dapps over Apps [proposes](https://forum.scroll.io/t/proposal-scroll-bridge-reliability-finality-sbrf/1262) an open-source, Scroll-native toolkit to make canonical L1/L2 bridging more resilient and transparent. The package combines a TypeScript SDK and a small React panel that surfaces Confirmed/Committed/ Finalized status with signed receipts, auto-retries failed L1 to L2 executions via replayMessage, exposes a one-click enforced-inclusion action where Stage-1 guarantees apply, and guides L2 to L1 withdrawals with “ready to prove/finalize” helpers. The scope targets Scroll Mainnet and Sepolia, ships in three short milestones (~$25k total), and aims to cut “where are my funds?” tickets by turning Scroll’s protocol guarantees into product-grade UX for any dapp.

**L2BEAT’s take:**

We believe this implementation has potential, but we feel that the Scroll Foundation should be involved in this process, as it will be able to provide more details and help ensure that this toolkit will be deployed correctly. Once this has been done, we will form our opinion on the matter.

### **EGC Marketing RFC**

The Ecosystem Growth Council is floating a [marketing program](https://forum.scroll.io/t/egc-marketing-rfc/1266) to pull Scroll’s messaging, content, and community work into one cohesive system across Labs, Open Economy, and the broader ecosystem. The plan would dedicate roughly 500k SCR to three parallel tracks: a Creator Fund that pilots user-generated content around Garden and USX, a unified campaign that turns the rebrand into reusable assets and a shared resource hub, and hands-on support for Open Economy founders so they can tell their story, ship content, and run lightweight growth. The near-term focus is practical distribution for USX and a mobile-first Garden V1 pitched as a transparent, high-yield crypto savings experience. EGC is asking for feedback over the next 10 days to help shape KPIs, execution roles among Labs, OE, and EGC, and which existing assets should plug into the shared framework.

### **Strategic Focus Plan for Local Nodes**

Scroll’s Community Council [outlines](https://forum.scroll.io/t/strategic-focus-plan-for-local-nodes/1257) a sharper operating model for Local Nodes to drive regional growth with clear objectives, monthly reviews, and narrative guidance synced to ecosystem priorities. Hubs will be evaluated on community growth, engagement, education outcomes, and ecosystem impact, with milestone-based payouts in SCR (USD-indexed) and a three-month budget cap per hub. The plan standardizes onboarding, reporting, and communication, while leaving room for local context. Weekly syncs, monthly reports, and quarterly forum updates aim to keep efforts aligned, measurable, and transparent as Local Nodes scale outreach, builder support, and on-chain activity.

**L2BEAT’s take:**

In general, we support this initiative. We have followed the evolution of local nodes since the first version, and in this new version, we see no reason not to support this initiative.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 13.10 at 16:00 UTC.

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 15.10 at 14:00 UTC.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/zfd-asoc-rmx) - on 16.10 at 17:45 UTC.


## **Lisk**

## **Active votes**

[Establish the Lisk DAO Fund and cover 2026 budget](https://www.tally.xyz/gov/lisk/proposal/83414824676020462079171257236144094094307423861214558357020310400447570416569) - ends on October 29 at 13:22 UTC.

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for L2BEAT Governance Office Hours, where we discuss everything related to Lisk’s governance, from current initiatives to high-level conversations.

## **Uniswap**

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.
