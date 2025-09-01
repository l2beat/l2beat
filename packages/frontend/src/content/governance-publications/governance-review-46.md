---
  title: "Governance Review #46"
  description: "Relatively slow week in governance, but with some important discussions!."
  publishedOn: "2025-04-07"
  authorId: manuel-gonzalez
---
## **Optimism**

## **Active Votes**

[Upgrade Proposal #14: Isthmus L1 Contracts + MT-Cannon](https://vote.optimism.io/proposals/95528263587371532982719325402371584327430753545162858644972401153516332664853) - ends on April 9 at 18:18 UTC.

[Upgrade Proposal #15: Isthmus Hard Fork](https://vote.optimism.io/proposals/8705916809146420472067303211131851783087744913535435360574720946039078686841) - ends on April 9 at 18:18 UTC.

### **Upgrade Proposal #14: Isthmus L1 Contracts + MT-Cannon**

0xEscanor has [created a post](https://gov.optimism.io/t/upgrade-proposal-14-isthmus-l1-contracts-mt-cannon/9796) that outlines an upgrade for OP Stack chains that introduces two core changes: (1) a new fault-proof virtual machine (MT-Cannon) supporting multi-threaded MIPS-64, enabling larger blocks and improved throughput for fault proofs, and (2) the first phase of the “Operator Fee” mechanism, preparing the system for more accurate fee pricing when rollups employ ZK proving, alternative data availability (alt-DA), or custom gas tokens. 

Specifically, MT-Cannon removes memory constraints in the fault-proof program, allowing chain operators to scale block sizes significantly. Meanwhile, the Operator Fee feature adds operatorFeeScalar and operatorFeeConstant parameters in the L1 SystemConfig contract plus an OperatorFeeVault contract, though these remain disabled until the upcoming Isthmus hardfork. The upgrade also revises the Blockspace Charter to reflect these changes, includes L1 contract updates for future L1 Pectra compatibility, and ships an absolute prestate for op-program 1.5.1-rc.1. If accepted, the upgrade is slated for April 25, 2025, and will be coordinated via OP Contracts Manager v3.0.0-rc.2.

### **Upgrade Proposal #15 - Isthmus Hard Fork**

0xEscanor [created a post](https://gov.optimism.io/t/upgrade-proposal-15-isthmus-hard-fork/9804) introducing the Isthmus hard fork for OP Stack chains, contingent upon the passing of Upgrade #14. This release adopts Pectra-inspired EIPs (e.g., EIP-7702, EIP-2537) for improved developer experience, enables the Operator Fee mechanism (though disabled by default for standard OP Stack chains), and adds the L2 Withdrawals Root to each block header, reducing the need for archival nodes when generating output roots. By integrating these features, Isthmus both maintains parity with Ethereum’s upcoming Pectra hard fork and unlocks new on-chain capabilities (e.g., set code transactions, BLS precompiles, updated gas costing). The upgrade primarily affects node operators, who must update their op-node, op-geth, and related software once the Ethereum Pectra activation date is finalized. A subsequent maintenance release will set the precise go-live date, finalize software tags, and let the Security Council coordinate the on-chain upgrade process.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://l2beat.com/governance/publications/meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DAB Office Hours](https://discord.com/invite/optimism) - on 8.4 at 16:00.

[Grants Council Office Hours](http://meet.google.com/vkn-qnwy-qqy) - on 8.4 at 17:30.

[Token House Community Call](https://meet.google.com/vme-ovto-jcn) - on 8.4 at 18:00.

[Grants Council Office Hours](http://meet.google.com/vkn-qnwy-qqy) - on 10.4 at 17:30.

## **Arbitrum**

### **DAO Discussion: Vote Buying Services**

The Arbitrum Foundation [has created a post](https://forum.arbitrum.foundation/t/dao-discussion-vote-buying-services/28934) to highlight that in the recent OAT election, a user spent 5 ETH via LobbyFi to secure 19.3M ARB votes for a candidate, CupOJoseph. While vote-buying services had previously operated on a smaller scale, this marks the first time a significant sum was paid to purchase votes worth approximately $6.5M in ARB. The Foundation has raised concerns about the precedent this sets.

The Arbitrum Foundation outlines potential DAO responses, such as disqualifying purchased votes that may require updates to the code of conduct. The Foundation takes no unilateral stance; instead, it invites the community to deliberate over whether vote buying should be permissible and, if so, under what conditions. They also stress that the broader question is whether selling votes supports or undermines the DAO’s aim of informed, legitimate decision-making. The community may hold a temperature check vote if consensus emerges to decide the next steps.

### **Arbitrum Governance Analytics March Report**

Curia [has posted](https://forum.arbitrum.foundation/t/arbitrum-governance-analytics-march-report/28931) its monthly analysis of Arbitrum DAO governance metrics, revealing an overall rebound in participation after ETHDenver. Offchain voting climbed from 47.86% to 55.7%, while onchain voting increased from 61.04% to 62.36%. Unique onchain voters rose slightly, but offchain unique voters decreased to 4,743. Notable delegate power gains included aretaGov.eth (+19.04%) and aranadigital-arb.eth (+20.22%). Six proposals were considered, five approved, and one rejected.

Active delegates dropped marginally, from 91 to 86, and ghost delegates reached a new high of 792. Despite this mild decrease in the number of engaged delegates, participation rates suggest that many resumed normal governance activities post-ETHDenver. Voting power distribution remains heavily concentrated among a few top voters, reflecting a continued need for broader delegate engagement and more evenly distributed governance influence.

### **Let’s get our huddles (aka. video calls) in order**

Paulofonseca [created a proposal](https://forum.arbitrum.foundation/t/non-constitutional-lets-get-our-huddles-aka-video-calls-in-order/28890) to adopt Huddle01 Meet as the default video call platform for all Arbitrum DAO events, replacing the Google Meet links and manual hosting practices. Huddle01 Meet offers a web3-native solution powered by Arbitrum, featuring up to 500 participants per call, unlimited recording storage on IPFS, token-gated DAO meetings for ARB holders, multi-streaming to platforms like YouTube and Twitch, and a dedicated subdomain (arbitrum.huddle01.app). The Huddle01 team has agreed to provide this service free for six months at a cost of $50/month. If successful in a trial period over the coming weeks, a policy to formalize Huddle01 as the DAO’s official meeting solution—and require IPFS-based call recordings—could be introduced for off-chain voting in late April.

### **My (Personal) Hope for the Future of Arbitrum: The Largest Digital Sovereign Nation**

AJ Warner (writing personally, not on behalf of Offchain Labs or the Arbitrum Foundation) [has posted](https://forum.arbitrum.foundation/t/my-personal-hope-for-the-future-of-arbitrum-the-largest-digital-sovereign-nation/28933) his vision of Arbitrum evolving into the “largest digital sovereign nation,” where the DAO’s governance structure and onchain treasury ownership allow it to function more like an economic collective than a single blockchain product. He notes that Arbitrum technology is broader than just the Arbitrum One chain or Orbit stack – it’s a flexible set of solutions for diverse builder needs. By controlling the protocol’s treasury and key resources (rather than passing fees to network validators as L1s do), the DAO can invest in new “business lines” – for example, the Gaming Catalyst Program and STEP – to boost ecosystem expansion and capture value from real-world assets, DeFi, and gaming. This approach goes beyond standard transaction fees, aiming to place “Arbitrum everywhere” by supporting more specialized or “opinionated” blockspace. AJ calls for greater adoption of Arbitrum’s technology, improved coordination through the OpCo, and a strategic budgeting process to effectively leverage the DAO’s authority and resources. He hopes the community will embrace this perspective, building a self-sustaining economy where a strong treasury and aligned business ventures can compound Arbitrum’s growth, ultimately cementing it as a leading decentralized ecosystem.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://l2beat.com/governance/publications/meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Open Discussion of Proposals Governance Call](http://meet.google.com/ggc-rqgh-fsr) - on 8.4 at 16:00.

[Entropy Advisors - biweekly office hours](https://meet.google.com/rms-unku-wsq) - on 8.4 at 17:15.

[21st GRC - Part B | Arbitrum Reporting Governance Call (GRC)](http://meet.google.com/ouo-uskg-niq) - on 9.4 at 15:00.

[March 2025 Security Council Member Election AMAs](http://meet.google.com/cxf-tmow-bnf) - on 11.4 at 15:00.

## **Uniswap**

### **[RFC] Uniswap Onboarding Package for BOB**

Alphagrowth, in collaboration with BOB (Build on Bitcoin), has [created a proposal](https://gov.uniswap.org/t/rfc-uniswap-onboarding-package-for-bob/25436) that requests a Uniswap Onboarding Package aimed at expanding DeFi liquidity on BOB, a hybrid Layer 2 that merges Bitcoin security with EVM smart contracts. BOB currently ranks 5th among all UniV3 deployments at $42.78M in Uniswap TVL and plans to commit $500K in liquidity incentives over six months, seeking a 75% match ($375K in UNI) from the Uniswap DAO. This proposal earmarks $250K in UNI for six months of rewards, plus $20K for Angle Merkl integration and $105K to refund Oku deployment. 

### **Establish Uniswap v4 Licensing Proces**s

AbdullahUmar and the Uniswap Accountability Committee (UAC) [have proposed](https://gov.uniswap.org/t/establish-uniswap-v4-licensing-process/25443) a governance framework for granting commercial use of Uniswap v4, currently protected under a Business Source License (BSL). This involves creating two new ENS subdomains: v4-core-license-grants.uniswap.eth, to publicly record BSL exemptions, and v4deployments.uniswap.eth, which would list official v4 deployments. After DAO approval, the UAC would manage the second subdomain, adding each recognized chain deployment. 

Additionally, the Uniswap Foundation would receive a blanket license exemption, enabling it to deploy v4 on multiple chains without requiring separate governance votes, thus expediting expansions. 

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Governance Community Call](meet.google.com/fuj-mbkg-vdu) - on 7.4 at 14:00.

## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Polygon**

### **Gitcoin Impact Report - Farcaster Frame Innovators Program**

Sov [created a post](https://forum.polygon.technology/t/gitcoin-impact-report-farcaster-frame-innovators-program/20839/1) to present the outcomes of a collaboration between Polygon and Gitcoin to fund 16 projects integrating Farcaster Frames with Polygon PoS. A total of 500K MATIC was allocated, with 478,997 MATIC (96%) deployed successfully across three milestone phases. The initiative showed a 25.8% acceptance rate (16 out of 62 applicants), a 95.8% overall milestone completion rate and produced at least 74,000 documented on-chain transactions from thousands of unique users. Projects spanned DeFi tools, social commerce, developer infrastructure, and digital collectibles, with many notable user-engagement and technical achievements (e.g., cross-platform integration, no-code builders, AI integrations, and NFT-based hotel bookings). Reporting inconsistencies and overlapping metrics limited precise impact measurements, indicating a need for more standardized data collection in future programs. Overall, the milestone-based funding effectively catalyzed innovation linking social media and blockchain, and the consumer-focused approach—emphasizing user experience in Farcaster Frame applications—helped expand Polygon’s ecosystem.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Starknet**

Starknet’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Everclear**

### **RFC - Establishing a Buffer Multisig for Sub-DAO Reward Discrepancies**

SEEDGov [has posted a proposal](https://forum.connext.network/t/rfc-establishing-a-buffer-multisig-for-sub-dao-reward-discrepancies/1372) to create a dedicated 3-of-4 multisig wallet funded with 10M CLEAR from the DAO treasury to address past and future shortfalls in contributor compensation caused by token price volatility and insufficient buffers. Initially, this fund will retroactively compensate Creed ($64k in CLEAR) and Karma ($2,7k in CLEAR), with the remaining balance acting as an ongoing buffer for other sub-DAOs. The GTF (Governance Task Force) will manage this process, publicly document any payouts, and require specific-purpose multisigs to request funds via an on-forum thread. Signers must verify and pre-announce each request, and any unused CLEAR will be returned after payouts. By establishing this buffer, Everclear DAO aims to maintain contributor trust, ensure fair rewards, and foster sustainable financial planning.

### **RFC - Funding for ImmuneFi’s bug bounty program**

GNSPS, on behalf of Creed, [has created](https://forum.connext.network/t/rfc-funding-for-immunefis-bug-bounty-program/1374) a proposal to launch a continuous bug bounty program for Everclear via Immunefi, aiming to reward ethical disclosures and strengthen security beyond one-time audits. Two funding options are offered: Option A at $53,530 (covering Immunefi’s subscription plus a $25,000 vault deposit for immediate payouts) and Option B at $31,700 (covering only the subscription, leaving the vault deposit for later). A vault deposit would increase researcher confidence by ensuring prompt compensation for valid findings, and any unspent funds would revert to the DAO treasury if no bounties are awarded. Under both options, the DAO transfers CLEAR tokens (calculated at current VWAP) to Creed’s multisig for distribution, while Creed manages triage, handles payouts, and provides quarterly reports on program performance.

### **Everclear DAO Code of Conduct**

SEEDGov [has introduced](https://forum.connext.network/t/everclear-dao-code-of-conduct/1341/6?u=manugotsuka) a final version of the Everclear DAO Code of Conduct, which was informed by votes from the previously passed Social EGP 21, EGP 22, and EGP 23 and extensive community input. If ratified, the policy takes effect on a TBD date with a 6.5-month trial before potential permanent inclusion in the Constitution.  

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Everclear Delegates Call](meet.google.com/zcv-aqph-pcj) - on 10.4 at 14:00.

## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **ZkSync**

### **ZKsync Ignite Final Program Report**

Karthiksenthil, representing the ZKsync Ignite team, [has created](https://forum.zknation.io/t/zksync-ignite-final-program-report/634) a post summarizing the outcome of the ZKsync Ignite program launched on January 6, 2025 and concluded on March 31. Though initially planned for three seasons to establish ZKsync Era as a leading DeFi liquidity hub, the DeFi Steering Committee decided to end Ignite prematurely, citing a shift toward Elastic Network goals, interoperability delays, and adverse market conditions. Despite the shortened timeline, the program drove a notable rise in DeFi TVL (peaking at $273M vs. a starting $96.6M) and successfully lowered stablecoin slippage – for instance, USDC-USDC.e fell from 2.83 bps to 0.1 bps – while attracting strong engagement on stable and native ZK pairs.

However, total DeFi TVL dropped after incentives ceased, slippage on volatile asset pairs worsened, and a portion of liquidity came from “looping” behavior that diluted the program’s impact. Ignite used just over 54M of the allocated 325M ZK tokens (16.67%) and ended early with unspent tokens remaining unminted for future TPPs. The report highlights key lessons around adaptive governance (e.g., real-time mid-course corrections), automatic payments to reduce operational bottlenecks, greater transparency for delegates, and stronger alignment with long-term Elastic Network objectives. Unused tokens remain available for the community to repurpose, and the Ignite team encourages discussion of their findings as ZKsync transitions to new strategic directions.

### **[ZIP-10] Activate ZK Gateway as a Settlement Layer**

StanislavBreadless from Matter Labs [has proposed](https://forum.zknation.io/t/zip-10-activate-zk-gateway-as-a-settlement-layer/632) enabling ZK Gateway as an optional settlement layer for the Elastic Network – continuing the work started by ZIP-6 (V26). Under this plan, ZK Chains can migrate their batch commits and proofs onto ZK Gateway (itself a ZK Chain), potentially reducing settlement costs compared to Ethereum and paving the way for faster interoperability across ZKsync-based chains. The ZK Gateway is designed with the same security and rollup properties as ZKsync Era, but the deployment of contracts will remain whitelisted until a future upgrade. This ZIP does not introduce new code beyond ZIP-6; rather, it officially whitelists and registers ZK Gateway as a valid settlement option, letting each ZK Chain’s admin choose whether to adopt it. Future enhancements (like cryptographic precompiles) could further lower settlement fees, and Matter Labs will serve as the ZK Gateway sequencer during its initial phase, with plans to decentralize later.

### **Proposal Review Call April 9 - Thread**

Theshelb[ has created](https://forum.zknation.io/t/proposal-review-call-april-9-thread/631) a forum thread for the next ZKsync Delegates Proposal Review Call, scheduled for Wednesday, April 9 at 16:30 UTC. The post invites authors of currently active or in-progress proposals to request time on the call’s agenda and notes that the agenda will be set based on forum updates on the day of the meeting. The call will likely cover two main items: the [ZIP-9] V27 EVM Emulation Upgrade and a final review of Ignite’s program report.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](meet.google.com/qvr-txgr-vja ) - on 9.4 at 15:30.

## **Scroll**

## Active Votes

[Euclid Upgrade](https://gov.scroll.io/proposals/81939631158579841171219988954315753236293867421581097385921335841780903893992) - ends on April 11 at 02:31 UTC.

Scroll’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Strategy & Ecosystem Growth Call](meet.google.com/smr-hxgd-btt) - on 9.4 at 11:30.

[Delegate Training Discussion](meet.google.com/yaj-mpsb-yng) - on 9.4 at 16:30.

[Ecosystem Growth Call](meet.google.com/mhz-ncvc-ipd) - on 9.4 at 17:00.
