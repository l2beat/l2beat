export interface FaqItem {
  question: string
  answer: string | string[]
}

// TODO: move this to collections
export const faqItems: FaqItem[] = [
  {
    question: 'What is the overall purpose of this site?',
    answer:
      'L2BEAT was created to provide transparent and verifiable insights into emerging layer two (L2) technologies which, in line with the [rollup-centric Ethereum scaling roadmap](https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698) are aimed at scaling Ethereum.',
  },
  {
    question:
      'Why do you need L2BEAT when you already have DeFiLlama, growthepie and other analytics platforms?',
    answer:
      'While those platforms are great, they primarily focus on tracking value locked in DeFi projects and other performance metrics across various chains. In comparison, L2BEAT focuses exclusively on the decentralization and trust assumptions of Ethereum scaling projects (L2s and L3s) and reports not just TVS but also various metrics related to the liveness and security of these projects.',
  },
  {
    question: 'Why was TVL renamed to TVS?',
    answer: [
      'The term TVL (Total Value Locked) is often associated with value locked in DeFi projects, or in general in some smart contracts. When we started, we only tracked value locked in canonical bridges, but as we expanded our scope to include externally bridged and natively minted assets, which are not necessarily locked, we decided to rename the metric to Total Value Secured (TVS) to better reflect the broader scope of assets we track, i.e. all assets managed in some form by the project.',
    ],
  },
  {
    question:
      'Why does the Total Value Secured (TVS) on L2BEAT differ from DefiLlama TVL?',
    answer: [
      'L2BEAT and DefiLlama use different methodologies for calculating TVS and TVL. The TVS on L2BEAT is a sum of canonically bridged, externally bridged, and natively minted assets (e.g. L2-native governance tokens like ARB and OP), while DefiLlama TVL focuses on assets actively engaged in dApps on specific networks.',
      "Example: let's assume L2BEAT reports a TVS of 2.5 billion, while DefiLlama reports a TVL of 1 billion for the same Layer 2 network (e.g., Arbitrum). This suggests that 1.5 billion worth of assets have been bridged (canonically or externally) or natively minted on Arbitrum, but are not yet being used in any dApps listed by DefiLlama. For instance, if you deposit 1 ETH to Optimism, L2BEAT would include it in their TVS calculation, but DefiLlama TVL would not. However, if you use that 1 ETH on Optimism to provide liquidity on Uniswap, DefiLlama would then include it in their TVL calculation.",
    ],
  },
  {
    question: 'What exactly are L2s?',
    answer: [
      'Layer 2 (L2) is a category of technical solutions aimed to scale the base layer in a trust minimized way. This category includes solutions like rollups as well as state channels and plasma. Other solutions are able to scale further, but with the introduction of additional trust assumptions, which are therefore not trust minimized. Sometimes the term Layer 2 is used to refer to include these solutions too, like validiums and optimiums, but to distinguish between trust minimized and non trust minimized solutions they are often referred to as "light" L2s, opposed to "strong" L2s like rollups.',
    ],
  },
  {
    question:
      'Why does the main table contain projects that are not trust-minimized L2s yet?',
    answer:
      'We want to track the progress of the projects that are credibly committed towards becoming trust-minimized L2s. Our goal is to provide the community with the most up-to-date information about the state of these projects and to provide insights and guidance for them to become fully trust minimized.',
  },
  {
    question: 'Are Validiums and Optimiums L2s?',
    answer:
      'We originally excluded Validiums and Optimiums from our definition of L2s due to the additional trust assumptions they introduce. However, the broader community often includes them in the L2 category, so we consider them to be "light" L2s as opposed to "strong" L2s like rollups. We will continue to track these projects to provide the community with a broader perspective on the state of the space and to provide tools to evaluate the different tradeoffs between the various solutions.',
  },
  {
    question: 'How do L2s derive their security from L1?',
    answer: [
      'There are two primary (and somewhat independent) mechanisms that L2 chains use.',
      'First, the L2 state can be verified by L1 through either **Validity Proof** or **Fraud Proof**. This mechanism is most important as it ensures that L2 proposers cannot cheat and include invalid transactions in an L2 block, e.g. mint coins out of thin air or steal your coins.',
      'The second use of L1 is as a **Data Availability** layer for L2 transactions so that users can independently re-create the L2 state and ensure continued and safe system operation or trustlessly exit to L1. If the data is published on another chain, then the security of the L2 is dependent on the security of that chain as well.',
    ],
  },
  {
    question: 'Can you explain how L1 can help with L2 state validation?',
    answer: [
      'An L2 chain can periodically "commit" its state to L1 by submitting the hash of its current state root. A state root is just a number, e.g: <code>0x77905a71f4b32221...</code> . We need a mechanism to ensure that this number corresponds to the actual L2 state.',
      'One way to do so is by providing a cryptographic **Validity Proof** (zkProof) that will be verified by the L1 smart contract. If the verification passes, users can be sure that the state root represents the results of valid transaction execution.',
      'Alternatively, an honest L2 chain observer can challenge roots. They can do this by producing a **Fraud Proof**. This proof empowers the L1 contract to autonomously confirm the inaccuracy of the state root and subsequently reject it.',
    ],
  },
  {
    question: 'What if an L2 proposer submits a fraudulent state commit to L1?',
    answer:
      'A state root from L2 is typically used to check coin ownership on L2 that user wants to withdraw to L1. If the fraudulent state root is submitted, it may attest that all coins belong to a dishonest L2 validator rather than legitimate users. These coins can be then withdrawn to L1 from L2&mdash;effectively stealing them. This is why it is not enough to simply commit state roots of L2 to L1, we need to be sure that this state root is valid.',
  },
  {
    question: "Are there any other ways L2 validators can steal user's coins?",
    answer:
      'Most L2 constructions are upgradable and until upgradability mechanism is either fully disabled or controlled by a sufficiently decentralized DAO, the funds can be, in theory, stolen through the upgrade mechanism. L2BEAT will closely monitor how the particular construction is upgradable and who currently controls the upgradability keys.',
  },
  {
    question: 'What about data availability? Why is it important?',
    answer: [
      "To trustlessly withdraw coins from L2, users need to prove ownership of the coins to L1 smart contract that holds all the funds. For that they need to have access to all L2's transactions or its current state. To not introduce any additional trust assumptions, L2 transactions can simply be recorded on L1 (as cheap calldata).",
      "For more details on data availability and its importance in security of scaling protocols, see our [DA page](https://l2beat.com/data-availability/summary), as well as Ethereum.org's [page on the topic](https://ethereum.org/en/developers/docs/data-availability/).",
    ],
  },
  {
    question: 'Ok, so what are the main categories of L2s?',
    answer: [
      'We currently acknowledge the following possible designs of trust-minimized L2s:',
      '- **zkRollup** - they publish data on L1 (Ethereum) to inherit data availability and consensus guarantees, and use validity proofs to guarantee state roots correctness.',
      '- **Optimistic Rollup** - they publish data on L1 to inherit data availability and consensus guarantees, and use fraud proofs to guarantee state roots correctness.',
      '- **State channel** - they don’t publish data onchain, but require users to keep their data in order to exit. They’re not general and require users participation.',
      '- **Plasma** - they don’t publish data onchain and use fraud proofs for disputes. Similarly to state channels, users are required to keep their data to correctly exit. They don’t require users participation, but they do not support general computation.',
      'By introducing more trust assumptions we can also specify the following categories that fall outside of the trust-minimized L2s category:',
      '- **Validium** - Those systems rely on validity proofs and data published externally.',
      '- **Optimium** - historically named Optimistic Chain. Those systems rely on fraud proofs and data published externally.',
      'For more details see the [Incomplete guide to Rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html) by Vitalik Buterin.',
    ],
  },
  {
    question: 'What happened to Optimistic Chains?',
    answer: 'They got renamed to Optimiums for clarity.',
  },
  {
    question: 'How exactly do you calculate metrics like TVS?',
    answer: [
      'It varies from project to project but in general, the TVS is defined as the sum of canonically bridged, externally bridged, and native assets of a given L2. Depending on the token type we might apply a different formula to count the value of this particular token:',
      '- **Canonically bridged token:** tokens_locked_on_L1 * price',
      '- **Externally bridged token:** total_supply_on_L2 * price',
      '- **Omnichain native token:** total_supply_on_L2 * price',
      '- **Regular native token:** circulating_supply * price',
      'Please note that in some cases formula might actually be different (for example we may use circulating supply instead of total supply for some tokens)',
    ],
  },
  {
    question: 'What do the values in the TVS breakdown mean?',
    answer: [
      '- **Canonically Bridged Value (CBV)** is the value of assets that use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token.',
      '- **Externally Bridged Value (EBV)** is the value of assets that use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token.',
      '- **Natively Minted Value (NMV)** is the value of assets that use an L2 as their ledger and are minted directly on the L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge.',
      'For more information read the [L2 Assets blog post](https://medium.com/l2beat/redefining-total-value-locked-for-l2s-756160602747).',
    ],
  },
  {
    question: 'Apart from TVS, what is L2BEAT aiming to track?',
    answer:
      "We will continuously monitor different L2 technologies with the primary focus on user funds' security. To this end we will track not just the usage of a particular L2 (TVS, frequency of state root commits, number of transactions, gas cost, etc...) but we will try to highlight the main risks related to their implementation that may affect user's funds security.",
  },
  {
    question: 'Is L2BEAT performing a security audit for each L2?',
    answer: `No, the L2BEAT team **DOES NOT DO SECURITY AUDIT**. All the information
    that we present on our site should be independently verified by anyone
    wanting to use given L2. Our goal is to collect as much information as
    we can about the "state of L2s" and allow the community to
    better understand what security assumptions are used to build given L2
    solutions.`,
  },
  {
    question:
      "Why aren't state channel based solutions like Raiden or Nahmii included?",
    answer: [
      'We are currently focused mainly on rollups, but would love to expand our research to state channels in the future. For the time being we lack resources to properly evaluate those systems.',
      'Nahmii was actually listed on L2BEAT for a time, but was removed for the reason stated above. If you want to check TVS for Nahmii you can do that [on etherscan](https://etherscan.io/address/0xCc8D82f6ba952966E63001c7B320EEF2Ae729099).',
    ],
  },
  {
    question: 'How can I add a new project or improve some info?',
    answer: [
      'Everything is [open source](https://github.com/l2beat/l2beat) &ndash; just create a PR. If you want to add a new project you should read our [contributing guidelines](https://github.com/l2beat/l2beat/tree/main/CONTRIBUTING.md).',
      '🔍 Here is also a visual step-by-step guide for creating a Pull Request - [link](https://www.notion.so/l2beat/How-to-add-milestones-0e8684a83c3c48ce8bc7b605d9c9a1bf)',
    ],
  },
  {
    question: 'Which third-party services do you use?',
    answer: [
      'We use Alchemy, QuickNode, Blast API, Google BigQuery, CoinGecko, Etherscan, and Blockscout for different types of data.',
    ],
  },
]
