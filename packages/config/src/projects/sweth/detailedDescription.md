{{swETH}} is Swell's liquid staking token, backed by ETH staked on the beacon chain.

### Deposits and staking

While deposits are not paused and the whitelist is off, anyone can deposit ETH and receive {{swETH}} at the current rate; the ETH is forwarded in the same call to the deposit manager. Swell's bot role, held by {{bot}}, decides when that ETH is staked and with which providers; each provider's keys are used in the order it registered them. Keys come from a registry of {{swOperators}} staking providers chosen by Swell; providers post no bond, so slashing losses fall on all holders. Each new stake reverts if another deposit changed the beacon deposit root after the bot read it, and ETH reserved for queued exits is never staked. Validators withdraw to the deposit manager.

![Swell deposits](/images/architecture/sweth-deposits.png#center)

### Exchange rate

The ETH value of {{swETH}} is set by reports from the bot role. A report states the beacon-chain balances, the deposit manager's ETH and the rewards. The oracle checks that the report is recent and that the new rate is close to a rate computed from the reported beacon-chain balances and the deposit manager's on-chain ETH. The beacon-chain balances are not verified on-chain, and an optional proof-of-reserves feed is turned off. The token then accepts a change of at most {{repriceCap}} per report, at least {{repriceInterval}} apart, which still allows about {{dailyMax}} a day. {{operatorFee}} of reported rewards is minted to staking providers and {{treasuryFee}} to a fee contract that auctions them for SWELL, which is burned.

In October 2026 the bot key was compromised and used to inflate the rate. Swell paused the system, gave the bot role to its multisig, lowered the rate back to its earlier level on 31 October, and reopened withdrawals on 1 November and deposits on 2 November.

### Withdrawals

A holder burns {{swETH}} for an NFT claim recording the rate at that moment. Claims are processed in order, only inside a bot report, with ETH taken from the deposit manager; a claim pays the lower of the rate at request and at processing, so queued holders bear losses but not gains. A report that lowers the rate also pauses deposits, reports and withdrawals at once. There is no deadline for processing: waits have ranged from hours to more than a month. Any single signer of the {{pauserSafe}} pauser multisig can pause withdrawals, which also blocks claims of processed requests; only the {{adminSafe}} multisig can lift a pause. No pause stops token transfers, so holders can still sell on the market, at whatever price its liquidity allows.

![Swell withdrawals](/images/architecture/sweth-withdrawals.png#center)

### Governance

All upgradeable contracts upgrade through a timelock that waits {{timelockDelay}}, controlled by the {{adminSafe}} multisig; the same path can repoint the addresses every contract resolves, change fees and reprice bounds, and grant the bot role. The multisig also lifts pauses without delay. There is no holder vote or veto.
