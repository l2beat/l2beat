ether.fi is a liquid staking and restaking protocol for ETH. Deposit ETH for {{eethSymbol}} (rebasing) or its wrapper {{weethSymbol}} ({{weethRate}} ETH each), and the pool stakes it both through its own permissioned operators and through third-party liquid staking tokens it accepts. Operators are whitelisted, a committee sets the exchange rate, and privileged functions are controlled by multisigs behind timelocks.

![ether.fi deposit, staking and exchange-rate flow](/images/architecture/etherfi-deposits.png#center)

### The exchange rate

A {{oracleQuorum}}-of-{{oracleMembers}} oracle committee reports staking rewards and EtherFiAdmin applies them. Hard caps bound every report: at most {{maxPositiveRebase}} up per report and {{acceptableRebaseApr}} implied APR, with negative moves capped tighter. Each report executes only after a delay of {{reportWaitDelay}} past consensus, in which the operating multisig can cancel it.

### Custody and exit

eETH is a staking aggregator rather than a single validator set. ETH deposits fund 32-ETH validators run by ether.fi's permissioned operators, whose withdrawal credentials are fixed in code to protocol-controlled EigenLayer pods, so operators run the keys but cannot redirect the stake. The Liquifier accepts already-staked liquid staking tokens from other providers against a governance-set whitelist and mints eETH for them, and EtherFiRestaker can hold them, restake them in EigenLayer, or unwind them to ETH through the provider's own exit. To exit, burn {{eethSymbol}} for a withdrawal NFT that the oracle must finalize before the pool pays, or swap instantly through a buffer for a fee up to {{maxExitFee}}. On-chain finalization depends on the {{oracleQuorum}}-of-{{oracleMembers}} committee, and the permissionless stale-oracle backstop only opens if the committee stops reporting entirely. Only {{bufferPct}} of the pool is instantly liquid, so large exits wait for validators to unwind.

### Who holds the keys

Upgrades and every role grant sit behind a {{upgradeDelay}} timelock. A shorter {{operatingDelay}} timelock and a set of multisigs run day-to-day operations: pausing, blacklisting, approving operators, and tuning parameters within fixed ceilings.
