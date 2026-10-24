ether.fi is a liquid staking protocol for ETH. Deposit ETH for {{eethSymbol}} (rebasing) or its wrapper {{weethSymbol}}, and the pool stakes it both through its own permissioned operators and through third-party liquid staking tokens it accepts. Operators are approved by a multisig and start running validators only after a timelock, a committee sets the exchange rate, and privileged functions are controlled by multisigs behind timelocks.

![ether.fi deposit, staking and exchange-rate flow](/images/architecture/etherfi-deposits.png#center)

### The exchange rate

A {{oracleQuorum}}-of-{{oracleMembers}} oracle committee reports staking rewards and EtherFiAdmin applies them. Hard caps bound every report: at most {{maxPositiveRebase}} up per report and {{acceptableRebaseApr}} implied APR, with negative moves capped tighter. Each report executes only after a delay of {{reportWaitDelay}} past consensus, in which the operating multisig can cancel it.

### Custody and exit

eETH is a staking aggregator rather than a single validator set. ETH deposits fund new compounding validators of {{validatorSize}} each, run by ether.fi's permissioned operators. Their withdrawal credentials are fixed in code to a protocol-controlled address, the EigenLayer pod of the ether.fi node they belong to or, for a node created without a pod, the node contract itself, so operators run the keys but cannot redirect the stake. The Liquifier accepts already-staked liquid staking tokens from other providers against a governance-set whitelist and mints eETH for them, and EtherFiRestaker holds them and can unwind them to ETH through the provider's own exit. To exit, burn {{eethSymbol}} for a withdrawal NFT that the oracle must finalize before the pool pays, or swap instantly through a buffer for a fee up to {{maxExitFee}}. On-chain finalization depends on the {{oracleQuorum}}-of-{{oracleMembers}} committee, and the permissionless stale-oracle backstop only opens if the committee stops reporting entirely. Only a small buffer is instantly liquid, so large exits wait for validators to unwind.

![ether.fi withdrawal and redemption flow](/images/architecture/etherfi-withdrawals.png#center)

### Who holds the keys

Upgrades and every role grant sit behind a {{upgradeDelay}} timelock. A shorter {{operatingDelay}} timelock tunes parameters within fixed ceilings and registers validator spawners, the accounts that register validator keys, so a newly whitelisted operator can only run validators after that delay. Multisigs handle the rest without delay: whitelisting and removing operators, pausing and blacklisting.
