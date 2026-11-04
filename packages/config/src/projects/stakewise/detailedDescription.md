StakeWise is a marketplace of staking vaults with one liquid token on top. Anyone can open a vault and stake for it; stakers deposit ETH into the vault of their choice and can mint {{osETH}} against their vault shares. {{osETH}} is backed by positions in many vaults rather than by one pool, and its ETH value follows a single reward rate that an oracle committee reports.

### Deposits and staking

A depositor sends ETH to a vault and receives its shares. The vault's key manager, appointed by the vault admin, decides which staking keys are funded; every registration also needs {{validatorThreshold}} of {{oracleCount}} oracle signatures over the exact keys, and withdrawal credentials always point at the vault, so the ETH can only come back there. Vaults are created permissionlessly through factories on code the DAO has approved ({{approvedImplCount}} implementations to date); whoever runs a vault posts no bond that the contracts enforce, and a loss is borne by that vault's shares; {{osETH}} holders are exposed to it only through the collateral rules below.

Any shareholder can mint {{osETH}} against their shares up to the vault's loan-to-value, {{defaultLtv}} by default with liquidation above {{defaultLiqThreshold}}. The DAO sets exceptions per vault: {{noLiqVaultCount}} vaults may mint up to {{maxLtv}} and are never liquidated, so a loss in one of them lowers {{osETH}}'s backing directly. Minting is limited to vaults running approved code and to a total capacity set by the DAO.

![StakeWise deposits](/images/architecture/stakewise-deposits.png#center)

### Exchange rate

{{osETH}}'s ETH value grows at a reward rate written by the Keeper. Every {{rewardsInterval}}, {{oracleThreshold}} oracles sign a Merkle root of each vault's cumulative rewards together with the new rate; the Keeper checks the signatures and a ceiling of {{rateCapYear}} per year on the rate, so one update can raise the rate by at most {{rateCapUpdate}}, and the rate can never fall. {{osFee}} of the rewards are minted to the DAO treasury as {{osETH}}. The per-vault rewards in the root are not bounded: the same quorum sets what every vault is worth, which is what the loan-to-value is measured against. Nothing in the system can be paused.

### Withdrawals

A vault shareholder burns shares into the vault's exit queue. The queue is filled from the vault's spare ETH on each harvest, and a request becomes claimable after a delay fixed per vault type at deployment. If the vault's key manager does not exit stakes within a day, the oracles, who hold pre-signed exit messages, exit them. Nobody can pause the queue, but it only moves with oracle updates. An {{osETH}} holder who did not mint it uses the redeemer's queue, processed every {{redeemInterval}}: the redeemer's owner publishes a list of {{osETH}} positions and its positions manager redeems them at the protocol rate, so queued holders are paid with ETH taken from other stakers' vaults, whose debt is burned in exchange.

![StakeWise withdrawals](/images/architecture/stakewise-withdrawals.png#center)

### Governance

The core contracts are not upgradeable. The {{daoSafe}} DAO multisig owns them and can, without delay, change the oracle set and thresholds, replace the Keeper and with it the rate ceiling, set the {{osETH}} fee, loan-to-value and liquidation rules, approve vault code and appoint the redeemer. SWISE holders reach the same powers through a SafeSnap module: a Snapshot vote is confirmed on Reality.eth with a {{bond}} bond and executes after {{voteDelay}} unless challenged. The same multisig owns the vote-execution module and can invalidate a proposal before it executes. A vault upgrade needs both an approved implementation and the vault admin's call. The redeemer is administered by a separate {{opsSafe}} multisig. Until December 2025 the DAO also owned the {{osETH}} token itself and used that once, in November 2025, to burn an exploiter's {{osETH}} after the Balancer hack and re-mint it to the treasury; that role has since been renounced, and only the vault controller and the flash-loan contract can mint or burn.
