Swell issues two liquid staking tokens from two copies of the same contracts. {{swETH}} is backed by ETH staked on the beacon chain. {{rswETH}} is backed by beacon-chain stakes whose withdrawals pass through EigenLayer. Each token has its own deposit manager, exit queue, oracle, provider registry and role registry, so the ETH behind one never backs the other. The roles that control them, the timelock and the multisigs are shared.

### Deposits and staking

Anyone can deposit ETH and receive tokens at the current rate; the ETH is forwarded in the same call to the token's deposit manager. A Swell bot decides when that ETH is staked and with which providers; each provider's keys are used in the order it registered them. Keys come from a registry of staking providers chosen by Swell ({{swOperators}} registered for {{swETH}}, {{rswOperators}} for {{rswETH}}); providers post no bond, so slashing losses fall on all holders. Each new stake reverts if another deposit changed the beacon deposit root after the bot read it, and ETH reserved for queued exits is never staked.

{{swETH}} stakes withdraw to the deposit manager itself. {{rswETH}} stakes withdraw to Swell-controlled EigenPods, so their ETH comes back through EigenLayer's withdrawal queue. Swell's multisig picks the EigenLayer operator each account delegates to without delay; restaked ETH can only be slashed once that operator allocates stake to a service.

![Swell deposits](/images/architecture/swell-staking-deposits.png#center)

### Exchange rate

The ETH value of each token is set by reports from the Swell bot. A report states the beacon-chain balances and rewards; the oracle checks that it is recent and that the new rate is close to a rate computed from the same reported balances, so the beacon-chain balances are not verified on-chain: only {{swETH}}'s oracle compares one figure, the ETH held by its deposit manager, with the real balance, and an optional proof-of-reserves feed is turned off. The token then accepts a change of at most {{repriceCap}} per report, at least {{repriceInterval}} apart, which still allows about {{dailyMax}} a day. {{operatorFee}} of reported rewards is minted to staking providers and {{treasuryFee}} to a fee contract that auctions them for SWELL, which is burned.

On {{rswETH}}, the multisig can also force a report. A forced report skips the pause and reference checks, and since the reported reward is not bounded by the rate check, each forced report can mint fee shares worth up to about a ninth of the supply, without changing the rate, to provider fee addresses the same multisig can change. Repeated every {{repriceInterval}}, this dilution compounds without limit and needs no delay.

In October 2026 the bot key was compromised and used to inflate both rates; Swell paused the system and removed the key's roles.

### Withdrawals

A holder burns tokens for an NFT claim recording the rate at that moment. Claims are processed in order, only inside a bot report, with ETH taken from the deposit manager; a claim pays the lower of the rate at request and at processing, so queued holders bear losses but not gains. A report that lowers the rate also pauses deposits, reports and withdrawals at once. There is no deadline for processing: waits have ranged from hours to more than a month, longer for {{rswETH}} because of EigenLayer's queue. Any single signer of the {{pauserSafe}} pauser multisig can pause withdrawals, which also blocks claims of processed requests; only the {{adminSafe}} multisig can lift a pause. No pause stops token transfers, so holders can always sell on the market.

![Swell withdrawals](/images/architecture/swell-staking-withdrawals.png#center)

### Governance

All contracts upgrade through a timelock with a {{timelockDelay}} delay, controlled by the {{adminSafe}} multisig; the same path can repoint the addresses every contract resolves, change fees and reprice bounds, and grant the bot role. The multisig also acts without delay as unpauser, as the {{rswETH}} provider registry manager and EigenLayer delegator, and through forced {{rswETH}} reports. There is no holder vote or veto.
