---
title: "Lighter vs Hyperliquid: Who has control over your collateral, orders, and open positions?"
description: "Perp DEXes can let users keep property rights to their collateral and make execution and position management verifiable. We compare Hyperliquid and Lighter across property rights, order fairness, and position fairness."
publishedOn: "2026-07-02"
authorId: l2beat_research
tag: Research
---

A perpetuals DEX differs from CEXs like Binance or Bybit in two ways. First, custody: it is possible for a perp DEX to let users maintain property rights to their collateral, rather than giving it up for an IOU from the exchange. Second, verifiability: both the execution of the orders and the management of the position can be transparent and verifiable.

Perps in particular (and other leveraged products) require the exchange engine to be able to actively manage users' positions for liquidation. To do so, perp DEXes employ position management mechanisms - such as the auto deleveraging (ADL) algorithm - whose verifiability is crucial, as they give power to the exchange to close and haircut positions while putting exchange solvency directly against user profits.

The comparison of leading perp DEXes, Hyperliquid and Lighter, can be organised into three categories:

1. Property rights - can the operator move your collateral, or stop you from withdrawing it?
2. Order fairness - can the operator see, reorder, front-run, censor, or sandwich what you submit?
3. Position fairness - who decides when you get liquidated and how, and which counterparty absorbs your position?

## Lighter vs Hyperliquid Architecture

The clear architectural difference between Hyperliquid and Lighter is that the former is a standalone L1, while the latter is an Ethereum L2. The main consequence is that the Hyperliquid validator set is the exchange operator, and transaction settlement happens on the same chain the operator runs. Lighter instead settles by posting validity proofs to Ethereum, a chain the Lighter operator does not control. In theory, settling on Ethereum is a structural advantage. Ethereum is the most decentralised and battle-tested chain, with currently about 800k validators and $50 billion in economic security. Hyperliquid validator set is composed of 28 operators, with the foundation directly controlling about 50% of the stake, plus delegated stake through the delegation program. This small group of validators can change the outcome of trades, liquidation, and settlement through ordinary governance - as they did already in the JELLY incident in 2025, when they delisted a manipulated market and force-settled it at a price of their choosing to save the HL vault from a ~$13M loss. Despite Lighter's collateral and exit path living on Ethereum, Lighter's operator can effectively do the same. Currently, the Lighter team can still upgrade the contracts, including the proof verifier, with no delay. Arguably the main difference is where the trust ceiling is, as Lighter's L2 design could eventually allow - once mature enough - to inherit full Ethereum security by giving up upgrade control to meet Stage 2 decentralisation criteria.

Given the governance risk being comparable for both projects, both projects are evaluated based on current architectural designs and contracts deployment.

## Property Rights

During normal operations, Lighter validity proofs are periodically verified on Ethereum, meaning the circuits can enforce that:

1. The operator cannot steal idle USD, or execute unauthorised orders - state transitions require valid signed transactions.
2. The operator cannot mint USDC - total balance accounting must reconcile across accounts on every batch. Also, closing positions cannot create value either, every gain has a matched loss.
3. Operator cannot retroactively change account state. State roots are committed sequentially, modifying old state would fail verification.

On Hyperliquid, these properties are not enforced by cryptographic proofs but by validator consensus. Validators voting together can change state outcomes.

Should the exchange fail or stop operating, Lighter's escape hatch feature allows users to be able to take their funds out of the exchange and back to their wallet from the Ethereum bridge. This is achievable by users independently generating their account proof and verifying it against the latest L2 state root posted on Ethereum. This feature is not achievable on Hyperliquid. Hyperliquid's main bridge on Arbitrum does not use a proof system, and withdrawals are externally secured by permissioned validator subsets totalling 8 validators (2 sets of 4 validators). Other bridges are also externally validated, meaning there is no permissionless way to exit user funds should the operator stop performing their duty.

## Order Fairness

Both venues do not offer guarantees on order flow fairness, so standard order-flow attacks apply e.g., front-running, sandwiching, censoring, last-look, stop hunting etc. However, Lighter validity proof guarantees order integrity once submitted. In particular, the operator cannot modify the order price or size, and cannot match it at the wrong price. The order book enforces price-time priority within the matching algorithm, meaning that a match at a price worse than the user limit fails the validity proof. Moreover, the matching circuit proves the maker the order trades against is the highest-priority resting order on the opposite side. This fair-algorithm guarantee is weakened by the operator control over the inputs mentioned above, where for instance, the operator can insert its own order to become the best maker quote on the book.

## Position Fairness

Liquidation has three knobs: when (timing), at what price (the mark), and who takes the other side (counterparty selection). On both venues, the operator controls all three knobs. On Lighter however, the proofs put some boundaries on what can be done to a solvent account.

Starting on how users can be rugged:

1. Mark-price / oracle manipulation. Liquidations and unrealized PnL are based on mark prices, which are derived from oracle feeds. Oracle signatures are currently not verified onchain or in-proof, opening up users to oracle attacks such as position liquidation due to mark spike and funding rate manipulation transferring value from longs to shorts (and vice versa). Users are also exposed to settlement at adverse price when desert (escape) mode activates. Open positions cash-settle at the last published mark price, so if the operator can choose when to stop operating, they can choose to do it at a mark unfavorable to active position-holders.
2. Position-management timing. Even without manipulating the price itself, the operator controls when things happen. For instance, the operator could perform mass liquidations at a chosen mark to maximize self-benefit. ADL counterparty selection is also arbitrary. The circuit enforces that the counterparty holds the opposite side, that the deleverage price is computed from the bankrupt account state and that the bankrupt account is genuinely bankrupt. But it places no ordering constraint on which eligible counterparty is chosen. This also means the operator can choose when to socialize losses vs when to backstop them through the insurance fund.

So on Lighter the operator can liquidate you at a moment and mark price of their choosing, but cannot liquidate an account that is genuinely solvent at the committed mark, cannot invent the liquidation price, and cannot deleverage more than the bankrupt size.

On Hyperliquid, there is no validity proof constraint on deleveraging: HLP automatically inherits bankrupt positions, so the house pool is the counterparty by design. During the JELLY incident, with HLP underwater, the validators simply voted to delist the market and force-settle every open position at a price of their choosing. So what Lighter bounds in the proof circuit, Hyperliquid leaves to governance, which can rewrite even the settlement of an already-cleared position after the fact.

## Summary Assessment

<table style="width: 100%; border-collapse: collapse; table-layout: auto; font-size: 15px; line-height: 1.45;">
  <thead>
    <tr>
      <th style="border: 1px solid #9ca3af; padding: 10px; text-align: left; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Activity / Risk</th>
      <th style="border: 1px solid #9ca3af; padding: 10px; text-align: left; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Lighter</th>
      <th style="border: 1px solid #9ca3af; padding: 10px; text-align: left; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Hyperliquid</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Passive USDC holding</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Permissionless exit, subject to Stage 0 upgrade risk</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">No permissionless exit path, custody rests on validator consensus</td>
    </tr>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Resting limit orders</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator has order flow discretion</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator has order flow discretion</td>
    </tr>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Order matching</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator sees full quote ladder, matching follows proven price-time priority</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator sees full quote ladder, matching unproven</td>
    </tr>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Active position with TP/SL</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator has order management discretion, proof enforces floor conditions</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator has order management discretion, no enforced floor</td>
    </tr>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Leveraged positions with liquidation risk</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator has mark-price discretion, validity proof enforce floor conditions</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Operator has mark price discretion, no enforced floor, governance can re-settle</td>
    </tr>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Enforcement basis</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Public circuit + onchain validity proof, rules are auditable and cryptographically enforced</td>
      <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top; word-break: normal; overflow-wrap: anywhere;">Closed-source execution, no validity proof - rules rest on validator consensus, not independently verifiable</td>
    </tr>
  </tbody>
</table>
