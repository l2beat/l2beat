---
title: "Governance Review #87"
description: "A packed week in governance across major ecosystems."
publishedOn: "2026-03-10"
authorId: manuel-gonzalez
---

## **TL;DR**

*In* ***Arbitrum***, *Offchain Labs proposed upgrading Arbitrum One and Nova to ArbOS 60 “Elara,” introducing multidimensional gas pricing and changes to Stylus contract limits and base fee management. The DAO also opened the March 2026 Security Council election process and is discussing a governance forum widget designed to surface live voting data directly within proposal threads.*

*In* ***ZKsync***, *the Foundation launched RFP 3: Institutional Narrative Experiment, a 10-week community activation initiative to test coordinated content strategies to strengthen ZKsync’s institutional positioning around the ZK Stack and Prividium.*

***Elsewhere***, *Starknet is considering a proposal to significantly increase storage access costs, Polygon released Bor v2.6.2 with infrastructure improvements, Scroll opened applications for its first State of Scroll research program and reported an emergency security upgrade, and Uniswap governance is reviewing both an extension of its liquidity incentive infrastructure and a proposal to deploy Uniswap V3 on the Gensyn L2.*

---
## **Active Votes**

**Arbitrum: 2 Active votes**



* **Tally**: [DVP Quorum & Proposal Cancellation](https://www.tally.xyz/gov/arbitrum/proposal/112177996398925212273579485756315626637025938627124330171390356044681347897430?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on March 12 at 22:07 UTC.
* **Snapshot**: [Automate the Consolidation of Idle Funds](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x703ef86b79590b07f770dd2369666085e112e2a8998a7e2f8011ed755611968c) - ends on March 12 at 15:47 UTC.

---
## **Arbitrum**


### **AIP: ArbOS 60 Elara**

Offchain Labs [introduced](https://forum.arbitrum.foundation/t/constitutional-aip-arbos-60-elara/30601) a proposal to upgrade Arbitrum One and Nova to ArbOS 60 “Elara.” The upgrade includes several protocol improvements, most notably Dynamic Pricing, a multidimensional gas pricing model designed to charge transaction fees based on specific resource usage such as computation, storage, and calldata. The goal is to better align gas pricing with actual hardware constraints, improving network capacity and reducing fee volatility.

The upgrade also proposes increasing the Stylus smart contract size limit to 96 KB, enabling more complex Rust-based applications, and granting Offchain Labs temporary authority to adjust the minimum L2 base fee between 0.01 and 0.10 gwei through a new BaseFeeManager contract. Additional features, such as APIs for alternative data availability layers and optional compliance-based transaction filtering, would be included in the codebase but remain disabled on Arbitrum One and Nova.

**L2BEAT’S Take**

*From our perspective, the introduction of Dynamic Pricing makes sense. Charging fees based on the specific resources a transaction consumes is a logical direction, as it should more accurately reflect the actual costs imposed on the network.*

*Also, the proposed increase in the Stylus contract size limit from 24 KB to 96 KB is notable. While this could improve the developer experience by giving more room to build complex Rust-based applications, we would be interested in understanding whether larger contracts could introduce indirect economic or infrastructure impacts.*

*Finally, while enabling faster adjustments to the minimum base fee may be beneficial, delegating this capability to Offchain Labs gives them meaningful influence over an important economic parameter of the network while still keeping it within reasonable boundaries.*

*One thing that raises a bit of our concern is the transaction filtering feature. While we understand the reasoning behind it and don’t question its necessity, we see it as potentially harmful (might impact stages assessment for chains using it). Therefore, we’ll be watching closely to see how it’s being used in practice.*

*Given the scope of the proposal, we plan to review it further with our research team to better understand its broader implications.*


### **Security Council Election: Call for Candidates**

Arbitrum [has opened](https://forum.arbitrum.foundation/t/march-2026-security-council-election-call-for-candidates/30594) the Call for Candidates phase for the upcoming March 2026 Security Council election, with the application stage beginning on March 15, 2026. During this preparatory phase, potential candidates are encouraged to announce their intent by publishing a forum post outlining their background and credentials, while the community is invited to suggest and support qualified applicants.

The Security Council is a 12-member committee responsible for responding to critical protocol risks and executing emergency actions through multisig control. This is the last election under the six-month format, so after this one, elections will take place every 12 months, with the DAO selecting six members per cycle. In parallel, a separate proposal to improve the technical aspects of the election process remains under discussion and could affect future election timelines if approved.


### **Discourse Governance Widget**

DavidLen [submitted](https://forum.arbitrum.foundation/t/proposal-discourse-widget-to-improve-dao-governance-participation-rate/30595) a proposal to integrate a custom Discourse governance widget into the Arbitrum DAO forum to improve delegate efficiency and participation. The widget would display real-time voting information directly within forum discussions by pulling data from Tally and Snapshot, allowing users to quickly see proposal status, quorum progress, and vote deadlines without leaving the forum.

The proposal requests $2,990 in ARB or USDC to cover development, deployment, documentation, and 12 months of maintenance. The tool is already built and used in other governance forums, and if approved, could be deployed within one day.

A similar forum integration proposal was previously [submitted](https://forum.arbitrum.foundation/t/non-constitutional-let-s-improve-our-governance-forum-with-three-proposals-app-feature-integrations/29398) by Paulo Fonseca in 2025. At the time, the Arbitrum Foundation [suggested](https://forum.arbitrum.foundation/t/non-constitutional-let-s-improve-our-governance-forum-with-three-proposals-app-feature-integrations/29398/32?u=manugotsuka) that improvements to governance tooling should likely be considered as part of a broader strategy for upgrading the DAO’s governance infrastructure rather than through isolated feature proposals. The current forum discussion period runs until March 12, followed by a Snapshot vote from March 12–19.


---


## **ZKsync**


### **Institutional Narrative Experiment (RFP 3)**

The ZKsync Foundation [launched](https://forum.zknation.io/t/community-activation-rfp-3-zksync-institutional-narrative-experiment/922) RFP 3, a 10-week community activation program to test ways to strengthen ZKsync’s institutional positioning within the Ethereum ecosystem. The initiative focuses on promoting narratives around ZKsync as an institutional extension of Ethereum, with emphasis on privacy infrastructure through Prividium and the ZK Stack.

The program has a maximum budget of 833,000 ZK (~$15k) and will fund one selected administrator to design and run the campaign. Proposals must outline content strategy, participant recruitment, quality controls, and measurable KPIs. Submissions are open until March 20, with funding distributed in two tranches following program launch and a mid-term review.


---


## **Starknet**


### **SNIP 37: Revisit Storage Access Cost**

Ohad Barta from StarkWare [introduced](https://community.starknet.io/t/snip-37-revisit-storage-access-cost/116143?_gl=1*1956pmp*_up*MQ..*_ga*MTQ3NDcxMjQxMS4xNzczMDYyNDc5*_ga_WY42TERK5P*czE3NzMwNjI0NzgkbzEkZzAkdDE3NzMwNjI0NzgkajYwJGwwJGgw) SNIP-37, a draft proposal to revise the cost of storage operations on Starknet. The proposal significantly increases the L2 gas cost for StorageRead and StorageWrite operations, arguing that current pricing underestimates the provisioning and long-term storage costs associated with state access. The change aims to better align transaction costs with the actual computational and storage burden placed on the network.

The proposal would double the cost of StorageRead, substantially increase the cost of StorageWrite, and introduce a much higher fee for writes that create new state cells. Additional adjustments include reducing the base L2 gas price by 20%, increasing the maximum gas per transaction slightly, and lowering block gas targets to better reflect production limits and improve congestion measurement.


---


## **Polygon**


### **Bor v2.6.2 Stable Release**

Polygon [announced](https://forum.polygon.technology/t/bor-v2-6-2-stable-release/21792) the Bor v2.6.2 stable release for both the Polygon Mainnet and the Amoy testnet. The update introduces a new relay service supporting preconfirmations and private transactions, alongside improvements to node observability and an upgrade of the Go runtime to version 1.26.0.

Validators and node operators are encouraged to upgrade by installing the new version and restarting their Bor service. The update aims to improve infrastructure performance and monitoring, and to add support for new transaction relay functionality.


---


## **Scroll**


### **DCP 1 “State of Scroll” Research Program**

SEEDGov [opened](https://forum.scroll.io/t/dcp-1-state-of-scroll-research-application-thread/1410) applications for DCP 1: State of Scroll Research, the first pilot under the Delegates Contribution Program (DCP). The initiative aims to produce a comprehensive research report on the Scroll ecosystem, combining regional analysis with cross-regional vertical studies covering infrastructure, stablecoins, payments, and regulation.

The program has a total budget of 18,000 USDC and is expected to run for 8–10 weeks, with completion targeted for May 31, 2026. Contributors are being recruited for three roles: Data & Analytics, Format & Visualization, and Regional Researchers, with applications open until March 11 and delegate voting scheduled for March 12–18.


### **Emergency Mainnet Upgrade Report**

The Scroll Security Council [published](https://forum.scroll.io/t/report-scroll-mainnet-emergency-upgrade-on-2026-02-23/1412) a report on an emergency mainnet upgrade carried out on February 23, 2026, following a bug bounty disclosure affecting the [zkvm-prover repository](https://github.com/scroll-tech/zkvm-prover). The vulnerability stemmed from a missing subgroup validation in the ecPairing precompile, which could cause inconsistent execution results between the sequencer and the prover and potentially lead to finalization failures.

After the issue was reported through Immunefi, the Scroll team implemented a fix and deployed it through an emergency upgrade. The patch was applied to the GalileoV2 prover (v0.7.2) and later published in the public repository after review by the OpenVM team. The Security Council also acknowledged whitehat researcher [revofusion](https://x.com/revofusion) for responsibly disclosing the vulnerability.


---


## **Uniswap**


### **Incentive Campaign Infrastructure Extension**

Gauntlet [proposed](https://gov.uniswap.org/t/extension-of-uniswap-incentive-campaign-infrastructure-univ3-univ4-merkle-router-oracles/26048) extending the infrastructure that powers Uniswap’s liquidity incentive programs on UniV3 and UniV4. The middleware contracts currently used to route incentive campaigns were originally deployed with a fixed expiration date of March 10, 2026, meaning they cannot be extended. To ensure campaigns can continue running, new versions of the Merkle Router Oracle contracts have been deployed with an updated expiration date of March 10, 2030.

The proposal asks governance to replace the expiring contracts with the new ones and register them through the Uniswap timelock. No other components of the system would change: the Aera vault, distribution contracts, incentive budgets, and governance permissions remain the same. Without approval, the expiration of the current contracts would prevent the creation of new incentive campaigns after March 10, 2026.


### **Proposal to Deploy Uniswap V3 on Gensyn**

Jamico submitted [an RFC](https://gov.uniswap.org/t/rfc-deploy-uniswap-v3-on-gensyn/26050) proposing a canonical deployment of Uniswap V3 on Gensyn, an OP Stack L2 focused on machine intelligence and AI-driven applications. The deployment would be carried out by GFX Labs, with Oku providing the front-end interface. Gensyn plans to integrate Uniswap as a core DeFi primitive alongside Morpho and its prediction market platform Delphi, which has already generated over 80 million transactions in testnet activity.

The proposal argues that Uniswap could serve as the primary liquidity layer for trading between AI, ETH, and USDC, supporting both user activity and automated agents operating within the Gensyn ecosystem. If the forum discussion period concludes without major objections, the deployment could proceed through Uniswap’s streamlined chain deployment process.

---



## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.



* **Optimism**
* **Everclear**
* **Hop**
* **Lisk**
* **Wormhole**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---


## **Upcoming Events**

**Arbitrum**:



* [Entropy Advisors - biweekly office hours](https://meet.google.com/nfm-yfty-iwp) - on 10.03 at 17:15 UTC.
* [Arbitrum Reporting Governance Call (GRC)](https://meet.google.com/kkv-icxy-xor) - on 11.03 at 17:00 UTC.
* [Firestarters - Consumer App Support Program Presentation](https://meet.google.com/rwf-jqpv-ixx) - on 12.03 at 16:00 UTC.

**Uniswap**: 



* [Uniswap Community Call](https://meet.google.com/ivd-pihe-vnj) - on 10.03 at 14:00 UTC.

**Scroll:**



* [Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 11.03 at 14:00 UTC

**Optimism:**



* [Grants Council Office Hours](https://meet.google.com/vue-azfy-ebg) - on 11.03 at 16:30 UTC.

**Everclear:**



* [Everclear Delegates Call](https://meet.google.com/wof-deoh-cer]) - on 12.03 at 14:00 UTC.


---


## **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.
