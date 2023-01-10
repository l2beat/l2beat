# Welcome to the L2BEAT FAQ!

Hi! We are glad you've made it here. Below you will find answers to most frequently asked questions about L2BEAT.

## What is the overall purpose of this site?

L2BEAT was created to provide transparent and verifiable insights into emerging layer two (L2) technologies which, in line with the [rollup-centric Ethereum scaling roadmap](https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698) are aimed at scaling Ethereum.

## Why do you need L2BEAT if you have DeFi Pulse, DeFi Lama, etc.?

While the above-mentioned sites are great, they focus primarily at tracking TVL (Total Value Locked) in DeFi projects on various chain. In comparison L2BEAT will track only L2 projects (at first on Ethereum only) and will eventually report not just TVL but various metrics related to the liveness and security of these projects.

## What exactly are L2s and why Polygon is not included?

We had to draw the line somewhere and&mdash;in the current version&mdash;we define L2 as a chain that fully or partially derives its security from L1 Ethereum so that users do not have to rely on the honesty of L2 validators for the security of their funds. This is in line with the current view of [ethereum.org](https://ethereum.org) on what [layer 2 scaling](https://ethereum.org/en/developers/docs/scaling/) is.

## But isn't Polygon a Plasma, Rollup and Sidechain all in one?

No, in its current implementation it is a PoS sidechain with validators solely responsible for validating Polygon transactions. We are only interested in what is implemented and can be independently verified. When their architecture changes, we will be more than happy to include them.

## Right, so how can L1 help with the security of L2?

There are two primary (and somewhat independent) mechanisms that L2 chains can use.

First, the L2 state can be verified by L1 through either **Validity Proofs** or **Fraud Proofs**. This mechanism is most important as it ensures that L2 validators cannot cheat and include invalid transactions in a L2 block, e.g. mint coins out of thin air or steal your coins.

The second use of L1 is as a **Data Availability** layer for L2 transactions so that, if there is a dispute, users could independently re-create the L2 state and ensure continued system operation or trustlessly exit to L1.

## Can you explain how L1 can help with L2 state validation?

An L2 chain can periodically "commit" its state to L1 by submitting the hash of its current state root. A state root is just a number, e.g: `0x77905a71f4b32221...`. We need a mechanism to ensure that this number corresponds to the actual L2 state.

One way to do so is by providing a zero-knowledge cryptographic **Validity Proof** (zkProof) that will be verified by the L1 smart contract. If the verification passes, users can be sure that the state root is a result of executing valid transaction set.

The other mechanism is to allow any honest L2 chain observer to raise an alarm if they think that the supplied state root is incorrect and provide a **Fraud Proof**. Such a proof allows the L1 contract to trustlessly verify that the state root was incorrect. In such case it will be automatically removed and the chain will roll back.

## What if L2 validators submit a fraudulent state commit to L1?

A state root from L2 is typically used to check coin ownership on L2 that user wants to withdraw to L1. If the fraudulent state root is submitted, it may attest that all coins belong to a dishonest L2 validator rather than legitimate users. These coins can be then withdrawn to L1 from L2&mdash;effectively stealing them. This is why it is not enough to simply commit state roots of L2 to L1, we need to be sure that this state root is valid.

## Are there any other ways L2 validators can steal user's coins?

Most L2 constructions are upgradable and until upgradability mechanism is either fully disabled or controlled by a sufficiently decentralised DAO, the funds can be, in theory, stolen through the upgrade mechanism. L2BEAT will closely monitor how the particular construction is upgradable and who currently controls the upgradability keys.

## What about data availability? Why is it important?

To trustlessly withdraw coins from L2, users need to prove ownership of the coins to L1 smart contract that holds all the funds. For that they need to have access to all L2's transactions or its current state. To not introduce any additional trust assumptions, L2 transactions can simply be recorded on L1 (as cheap calldata), or they may be stored with some external providers that will guarantee (cryptoeconomically or through some other mechanisms) data availability.

For more details on data availability and its importance in security of scaling protocols, see Ethereum.org's [page on the topic](https://ethereum.org/en/developers/docs/data-availability/).

<h2 id="categories">Ok, so what are the main categories of L2s?</h2>

Depending on whether Validity Proofs or Fraud Proofs are used and what is the mechanism for data availability we can broadly categories L2s into the following categories:

- **zkRollups** - Validity Proofs with data on L1 Ethereum,
- **Optimistic Rollups** - Fraud Proofs with data on L1 Ethereum,
- **Validium** - Validity Proofs with data kept off-chain,
- **Plasma** - Fraud Proofs with data kept off-chain.

In the future we expect to see hybrid solution using a mix of the above techniques.

<table class="Faq-Table">
  <thead>
    <tr>
      <td></td>
      <th>Validity Proofs</th>
      <th>Fraud Proofs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Data on-chain</th>
      <td>ZK Rollup</td>
      <td>Optimistic Rollup</td>
    </tr>
    <tr>
      <th>Data off-chain</th>
      <td>Validium</td>
      <td>Plasma</td>
    </tr>
  </tbody>
</table>

## How exactly do you calculate metrics like TVL?

It varies from project to project but we generally track the amount of tokens locked in all token escrow contracts for a given L2. Sometimes it's a single token escrow like for zkSync but sometimes these are multiple token escrows for a single L2 (Optimism).

For more details see our [project definitions](https://github.com/l2beat/l2beat/tree/master/packages/config/src).

## Apart from TVL, what is L2BEAT aiming to track?

We will continuously monitor different L2 technologies with the primary focus on user funds' security. To this end we will track not just the usage of a particular L2 (TVL, frequency of state root commits, number of transactions, gas cost, etc...) but we will try highlight main risks related to their implementation that may affect user's funds security.

## Is L2BEAT performing a security audit for each L2?

No, the L2BEAT team **DOES NOT DO SECURITY AUDITS**. All the information that we present on our site should be independently verified by anyone wanting to use given L2. Our goal is to collect as much information as we can about the "state of L2s" and allow the community to better understand what security assumptions are used to build given L2 solutions.

## Why aren't state channel based solutions like Raiden or Nahmii included?

We are currently focused mainly on rollups, but would love to expand our research to state channels in the future. For the time being we lack resources to properly evaluate those systems.

Nahmii was actually listed on L2BEAT for a time, but was removed for the reason stated above.
If you want to check TVL for Nahmii you can do that [on etherscan](https://etherscan.io/address/0xCc8D82f6ba952966E63001c7B320EEF2Ae729099).

## How can I add a new project or improve some info?

Everything is [open source](https://github.com/l2beat/l2beat) &ndash; just create a PR. If you want
to add a new project you should read our [contributing guidelines](https://github.com/l2beat/l2beat/tree/master/CONTRIBUTING.md).

🔍 Here is also a visual step-by-step guide for creating a Pull Request - [link](https://www.notion.so/l2beat/How-to-add-milestones-0e8684a83c3c48ce8bc7b605d9c9a1bf)
