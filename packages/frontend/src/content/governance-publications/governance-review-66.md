---
title: "Governance Review #66"
description: "Calm but purposeful: fewer headlines, more execution across L2s."
publishedOn: "2025-08-25"
authorId: manuel-gonzalez
---

## **Optimism**

**S7 ROI Summary & Learnings**

The Foundation + Open Source Observer [published program-level ROI](https://gov.optimism.io/t/s7-roi-summary-learnings/10253) for the “grow Superchain TVL” push. Key gaps to fix in S8: inconsistent KPIs (esp. Retro Funding), tough attribution, and missing OPEX. Actions: time SuperStacks V2 nearer interop, cut Retro Funding to 3.65M OP (dev tooling) and 1.35M OP (onchain builders), and expand ROI reporting to internal spends (e.g., chain grants)—aimed at comparable baselines, not prescriptions.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DAB Office Hours](https://meet.google.com/pgj-ibvv-trr) - on 26.8 at 14:00.

[Grants Council Office Hours](https://meet.google.com/pcq-tqpt-fcm) - on 27.8 at 16:30.


## **Arbitrum**


## **Active Votes**

**Onchain**

[Remove Cost Cap, Update Executors, Disable Legacy USDT Bridge](https://www.tally.xyz/gov/arbitrum/proposal/51852039695020109312343918128899814224888993575448130385109956762385891284115?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on September 4 at 22:01 UTC.


### **AIP: Security Council Election Process Improvements**

Arbitrum Foundation [proposes](https://forum.arbitrum.foundation/t/constitutional-aip-security-council-election-process-improvements/29848?u=manugotsuka) making SC elections annual by extending cohort terms to 2 years, lowering the nominee threshold to 0.1% ARB, auto-advancing incumbents to the Member Election, and enabling key rotation (during compliance ≥3 days before end; and anytime during term via timelock). Constitution text updated accordingly; contracts add cadence control and nominee/member key-rotation functions (audited). Applies retroactively to Mar & Sep 2025 cohorts.


### **AIP: ArbOS Version 50 Dia**

Offchain Labs [created a proposal](https://forum.arbitrum.foundation/t/constitutional-aip-arbos-version-50-dia/29835/1) that outlines upgrading Arbitrum One & Nova to ArbOS v50 “Dia” to align with Ethereum’s Fusaka fork. The release enables BLS12-381 (EIP-2537) and secp256r1 (EIP-7951) precompiles, adds a 32M L2 per-tx gas cap (EIP-7825), the CLZ opcode (EIP-7939), MODEXP bounds/cost updates (EIP-7823/7883), a 10 MB block size limit (EIP-7934), and a new eth_config RPC (EIP-7910), plus fixes to calldata pricing and EIP-7702 delegation behavior. It also ships instrumentation for future multi-resource (constraint-based) gas pricing and a “Native Mint/Burn” feature for Orbit chains (explicitly disabled on One/Nova). Trail of Bits will audit; Snapshot → devnet/Sepolia testing → on-chain vote, with activation targeted around (and possibly after) Fusaka.


### **Proposal: Sunsetting the Delegate Incentive Program (DIP)**

Instinct [created a proposal](https://forum.arbitrum.foundation/t/proposal-sunsetting-the-delegate-incentive-program-dip/29867?u=manugotsuka) that outlines the end of the DIP entirely, citing loss of trust and misaligned design: subjective scoring, a VP multiplier that penalizes smaller delegates, retroactive rule changes, delays, and scope overreach. They argue the v1.7 revision worsens things (raising the new-delegate VP minimum 10× to 500k, ~40% pay cut for delegates, a 25% PM raise, and fewer dispute options). Reported impact: paid delegates dropped from 49 (Dec ’24) to 21 (Feb ’25) after v1.6. The ask: sunset the program, return remaining funds, and redirect budget to clearer, deliverable-based efforts (research bounties, governance tooling, community grants).

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Open Discussion of Proposals Governance Call](https://meet.google.com/hex-xumv-hga?authuser=0&hs=122) - on 26.8 at 16:00.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 26.8 at 17:15.

[Security Council Election Process Improvements proposal](https://meet.google.com/fnu-dvdw-rai) - on 27.8 15:00.


## **Uniswap**


## Active Votes

**Offchain**

[Establish Uniswap Governance as “DUNI,” a Wyoming DUNA](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0xf9f99fe0f9425c2b2e624185860bcc38ac00bda6abe330e9c123f5c5c29dfbac) - ends on August 30 at 14:00 UTC.


### **Deploying Uniswap v3 on Ronin with Co-Incentives**

Lionel_ronin [posted an RFC](https://gov.uniswap.org/t/rfc-deploying-uniswap-v3-on-ronin-with-co-incentives/25810) to deploy Uniswap v3 on Ronin and make it the chain’s canonical DEX, with all v3 contracts under Uniswap governance. To bootstrap depth, Ronin proposes migrating chain-owned liquidity from Katana and contributing $1M in RON, matched by $500k in UNI from the DAO (escrow/oversight by the Uniswap Accountability Committee; deployer: GFX Labs; bridge: Wormhole; frontend: Oku). Incentives: 6 months, 75% to BTC/ETH/stables (+ derivatives) pools, 25% to top gaming pairs; tracked via public dashboards. Ronin highlights a large, active base (31M+ wallets; ~400k DAU; ~$70M TVL) and plans to transition to an Ethereum-aligned L2 in 2026. If UNI matching fails, v3 still deploys, but Ronin’s incentive allocation isn’t guaranteed; Snapshot check precedes an on-chain vote.


### **Uniswap Delegate Reward Initiative - Cycle 4 Application and Results**

StableLab [created a post](https://gov.uniswap.org/t/uniswap-delegate-reward-initiative-cycle-4-application-and-results/25804) that outlines the Cycle 4 application process for the Delegate Reward Initiative. Applications close Aug 27, 00:00 UTC; the top 15 delegates are chosen via a 13-point rubric: voting participation over the past 6 months (7 pts: Snapshot up to 3, on-chain up to 4), passed proposal authorship (3 pts, on-chain weighted), community call attendance Mar–Aug (1 pt), 1,000 self-delegated UNI with signed on-chain proof (1 pt), and perfect participation (1 pt). Eligibility requires ≥3 months of on-chain voting; Cycle 3 delegates must re-apply; only one wallet is counted unless a pre-announced change. Tie-breakers: earliest first on-chain vote (by vote end date) → most votes in last 6 months → earliest published delegation platform. An application template is included in the post.


### **Uniswap Accountability Committee Charter**

The Uniswap Accountability Committee [published](https://gov.uniswap.org/t/uniswap-accountability-committee-charter/25807?u=manugotsuka) an informational charter defining its mandate as a DAO-elected, DAO-funded, credibly-neutral ops/comms layer bridging the Uniswap Foundation, Labs, and the wider community. Scope includes: structured communications and community calls, governance liaisoning and proposal facilitation, operational support (deployments, escrowed fund disbursements, accounting/reporting), research, trusted multisig signing, and a forthcoming treasury-management RFP process under the anticipated DUNA framework. The charter is a living document and not an active RFC.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DEF Community Call](https://meet.google.com/kjb-tgss-skw) - on 26.8 at 17:00.


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


### **GTF 2.0 - Mid-term Ratification**

SEEDGov [created a post](https://forum.connext.network/t/gtf-2-0-mid-term-ratification/1393) that outlines a mid-term ratification of GTF 2.0 via optimistic approval. Delegates have a 7-day veto window; if opposition reaches ≥7.5M CLEAR (50% of quorum), it goes to a formal vote—otherwise the mandate continues with no new spend. The EGP-29 budget (4,553,062.02 CLEAR) remains in place: ~1.3M paid (H1 comp), ~1.8M reserved for H2, ~552k streamed on vesting with ~546k remaining; a minor gas top-up will use the Buffer multisig. H1 highlights: 6 biweekly reports, 4 delegate calls, sponsorship/authorship of key proposals, 67 payments, 3 clawbacks, 8 multisigs, governance metrics + H1 financials, and growing comms. H2 focus: Security Council elections & drills, delegation strategy, constitution update, treasury manager selection/onboarding, protocol performance reporting, and LATAM BD.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**


### **Deploy LSK to Base and deploy liquidity to Aerodrome using Arrakis**

The Lisk Team [created a post](https://forum.lisk.com/t/deploy-lsk-to-base-and-deploy-liquidity-to-aerodrome-using-arrakis/560) that outlines a plan to deploy LSK on Base and seed liquidity on Aerodrome using Arrakis Pro. They’ll deploy the ERC-20 on Base and request a WETH/LSK (C200) pool at the 0.27% fee tier, funding it with 1.5M LSK managed by an Arrakis Pro vault. The strategy targets Base’s large retail user base (incl. Base App), prefers not splitting liquidity (Aerodrome over Uniswap) to maximize depth, and will bootstrap toward a 50/50 inventory for lower price impact. A 5-of-8 Treasury Council Safe will handle bridging and deposits; no additional compensation is requested for council members.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


## Active Votes

**Onchain**

[ZKsync Guardians Funding 2024-2026](https://www.tally.xyz/gov/zksync/proposal/14920227315823844313255249182525601975564035647349569740836448589354658768084?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on August 27 at 13:10 UTC.


### **Funding Research for a DAO Liveness, Security, and Decentralization Dashboard for ZKNation**

StableLab [created a post](https://forum.zknation.io/t/rfc-funding-research-for-a-dao-liveness-security-and-decentralization-dashboard-for-zknation/759) that outlines funding research for a “Forse Terminal,” an open-source dashboard tracking DAO liveness, security risks, and decentralization for ZKNation. The RFC proposes real-time per-proposal metrics (time-to-quorum, quorum share), whale & delegate influence analysis, delegation network graphs and clustering, anomaly/vote-buying detection, and decentralization measures (Gini, Nakamoto, voters needed to pass/block), with email/Telegram alerts and integration across governance data sources. Timeline is 3 months to build with 24 months of maintenance; budget TBD based on final scope. StableLab (Forse Analytics) commits to monthly progress reports and a public demo in three months.


### **Proposal Review Call August 27**

Shelby [has created](https://forum.zknation.io/t/proposal-review-call-august-27/754) a post that outlines the Aug 27 Proposal Review Call and invites authors to book time. Tentative agenda: [TPP-6] Security Council v2 Funding (passed), [TPP-7] Guardians Funding 2024–2026 (voting live), and [ZIP-12] V29 Interop & Fast Finality (forum). Update: Delay Minter Mod is now live, adding a built-in veto window between mint requests and execution on capped minters; subscribe to the “ZKsync Delegates Calls” calendar for access details.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 27.8 at 15:30.


## **Scroll**


### **[Security Council Report] Scroll Mainnet Emergency Upgrade on 2025-08-08**

The Security Council [created a post](https://forum.scroll.io/t/security-council-report-scroll-mainnet-emergency-upgrade-on-2025-08-08/1089) that outlines an Aug 8 mainnet emergency upgrade after proving failures. The root cause was a guest-program bug in EuclidV2 that left some 7702 paths without code_size, making extcodesize return 0 and causing sequencer/prover divergence (finality + withdrawals delayed; no funds at risk). The solution was to deploy a new verifier and upgrade the prover guest to Feynman v0.5.2 (scroll-revm, backward-compatible with EuclidV2); all pending bundles were re-proven and finalized on Aug 9.


### **Proposal: Governance Contribution Recognition (Cycle 2: May - October 2025)**

The Governance Contribution Reward Working Group [created a post](https://forum.scroll.io/t/proposal-governance-contribution-recognition-cycle-2-may-october-2025/1085) that outlines Cycle 2 of the Governance Contribution Recognition program. It covers May–Oct 2025 with two payouts (retro + forward), uses a 4-tier performance score (voting participation, vote rationales, Curia forum engagement, workshops/calls later, and requires Verified Delegate status (≥2,500 SCR delegated and >5 delegators) plus COI disclosures. The ask is 440,000 SCR (incl. a 20,000 SCR one-time Curia integration), with rewards paid in SCR; KYC/KYB is required for recipients. The post also lists evaluation KPIs and invites feedback on timeframe, criteria, tiers, and budget.


### **Public Forum to Wallet Link Verification**

Curia [created a post](https://forum.scroll.io/t/public-forum-to-wallet-link-verification/1094) that outlines a public forum and wallet verification tool. Delegates can link their forum handle to their voting wallet via [verify.curiahub.xyz/forum](verify.curiahub.xyz/forum) by connecting the wallet, entering the forum name, signing a message, posting the generated signature in the thread, then returning to finalize. It’s an open utility anyone can adopt to tie on-chain governance to forum activity better.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 25.8 at 16:00.

[Weekly DAO & Governance Call](https://meet.google.com/smr-hxgd-btt) - on 27.8 at 11:30.

[Weekly DAO & Governance Call (#2)](https://meet.google.com/mhz-ncvc-ipd) - on 27.8 at 17:00.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/jug-nayw-gtt) - on 28.8 at 17:30.