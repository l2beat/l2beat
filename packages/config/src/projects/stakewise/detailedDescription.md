StakeWise is a marketplace of staking vaults with one liquid token on top. Anyone can open a vault and stake for it. Stakers deposit ETH into the vault of their choice and can mint {{osETH}} against their shares, so {{osETH}} is backed by positions in many vaults rather than by one pool. Its ETH value follows a single reward rate that an oracle committee reports. Only the ETH that stakers mint against is tokenised as {{osETH}}. The rest of the stake is not, so this page tracks the token, not the whole marketplace.

### Deposits and staking

1. A depositor sends ETH to a vault and receives its shares.
2. The vault's key manager, appointed by the vault admin, picks the staking keys to fund. Each registration needs {{validatorThreshold}} of {{oracleCount}} oracle signatures over the exact keys and makes the vault the withdrawal address. Consolidating stake into a validator the vault does not track also needs the oracles, and the contracts do not check where that validator withdraws.
3. A shareholder can mint {{osETH}} against the shares up to the vault's loan-to-value, {{defaultLtv}} by default, with liquidation above {{defaultLiqThreshold}}.

Vaults are created through factories on code the DAO has approved ({{approvedImplCount}} implementations), or registered directly by the DAO multisig. The contracts require no bond from whoever runs a vault, and a vault's losses fall on its own shares. {{osETH}} holders are exposed to them only through the collateral rules, which the DAO can set per vault: {{noLiqVaultCount}} vaults may mint up to {{maxLtv}} and are never liquidated, so a loss in one of them lowers {{osETH}}'s backing directly. Only registered vaults that report approved code can mint, up to a total capacity set by the DAO.

![StakeWise deposits](/images/architecture/stakewise-deposits.png#center)

### Exchange rate

{{osETH}}'s ETH value grows at a reward rate written by the Keeper. At most once every {{rewardsInterval}}, {{oracleThreshold}} oracles sign a new rate together with a Merkle root of each vault's cumulative rewards. The Keeper checks the signatures and caps the rate at {{rateCapYear}} a year, about {{rateCapInterval}} every {{rewardsInterval}}. The rate accrues continuously and {{osETH}}'s value can never fall. {{osFee}} of the rewards is minted to the DAO treasury as {{osETH}}. The per-vault rewards in the root have no cap. Through them the same quorum decides what each vault is worth, and so how much {{osETH}} can be minted against it.

### Withdrawals

A vault shareholder exits through the vault's queue:

1. The shareholder moves shares into the queue, where they keep earning rewards and bearing losses until paid.
2. The vault pays the queue from its spare ETH, but only after an oracle update. If the key manager does not exit validators within a day, the oracles exit them with pre-signed exit messages.
3. The request becomes claimable after any claim delay set by the vault's code.

An {{osETH}} holder who did not mint it exits through the redeemer:

1. The holder queues {{osETH}} in the redeemer, minus a fee, now {{redeemFee}}, that the DAO multisig can raise to {{maxRedeemFee}}.
2. The redeemer's owner, a {{opsSafe}} multisig, publishes a list of {{osETH}} positions, and its positions manager redeems them at the protocol rate. Those stakers' vaults pay out ETH and their {{osETH}} debt is burned.
3. The queue is paid in batches at least {{redeemInterval}} apart. Anyone can also buy queued {{osETH}} with ETH, which funds the next batch.

![StakeWise withdrawals](/images/architecture/stakewise-withdrawals.png#center)

### Governance

The core contracts cannot be upgraded and have no pause function. The {{daoSafe}} DAO multisig owns all of them except the {{osETH}} token and the redeemer, and can, without delay, change the oracle set and thresholds, replace the Keeper and with it the rate cap, set the {{osETH}} fee and the collateral rules, approve vault code in the vaults registry and appoint the redeemer. It can also register any contract as a vault, and a registered vault can mint {{osETH}} and burn it from any holder. A vault admin can only upgrade to the next approved version of the vault's code. A SafeSnap module, meant for SWISE Snapshot votes, can execute any transaction through the DAO multisig: a Reality.eth answer backed by a {{bond}} bond that no one outbids for {{questionTimeout}} executes {{questionCooldown}} later, unless the DAO multisig, which owns the module, invalidates it first. The {{osETH}} token has no owner, so its minters are fixed: the vault controller and the flash-loan contract.
