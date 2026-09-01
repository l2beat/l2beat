Rocket Pool is an Ethereum liquid staking protocol. Anyone can deposit ETH and receive rETH, a token that appreciates against ETH as the pool's validators earn rewards. Node operators run validators for the pool by putting up part of the stake, with the pool supplying the remainder. Node operators never take custody of depositors' ETH — validator withdrawal credentials point at a protocol contract, and that contract splits every withdrawal between the operator and the pool using onchain accounting.

A permissioned set of {{oracleSetSize}} node operators, the oracle set, reports staking data from the consensus layer, thus determining the price of rETH. The same set is the only actor that can upgrade the protocol core contracts.

### Depositing

Depositing is open to anyone, it requires a minimum of {{minimumDeposit}} ETH and enough room under the {{maximumPoolSize}} unassigned ETH pool cap (to prevent idle ETH diluting yield). The protocol keeps a fee of {{depositFee}} and mints rETH with the rest of the deposit. Incoming ETH first tops the token contract's redemption buffer up to {{targetCollateralRate}} of the tracked backing; the remainder is booked into RocketVault under the deposit pool's name until it is matched to a validator. Deposits can be disabled via the deposit flag in `RocketDAOProtocolSettingsDeposit` by RPL token governance or the security council. 

### Redeeming

Redeeming is permissionless, although it does depend on liquidity: redeeming requires the ETH held by the rETH token contract plus the deposit pool's unassigned surplus to cover the payout. Governance targets a buffer of {{targetCollateralRate}} of the token's backing and when the buffer is thin, as it is whenever the validator queue is absorbing deposits, onchain redemption reverts and holders have to use the secondary market or wait. Staked ETH is not redeemable on demand: the protocol does not implement EIP-7002, so no contract can trigger a validator exit; ETH comes back only when validators leave the beacon chain, at the operator's initiative or through slashing.

### The exchange rate

`RocketTokenRETH.getEthValue` is `amount × RocketNetworkBalances.getTotalETHBalance() / getTotalRETHSupply()`. Both numbers are written by `RocketNetworkBalances.submitBalances`, which is gated by `onlyTrustedNode` — oracle-set members only. A report lands once submissions reach {{consensusThreshold}} of the set, that is {{oracleSetQuorum}} of {{oracleSetSize}} members, and `executeUpdateBalances` lets anyone finalise a report that already has that many signatures.

Three bounds are enforced in `_updateBalances`. A report may not land until almost a full interval of {{submitFrequency}} has passed since the last one. The price may move at most {{maxRethDelta}} per report, in either direction. And reporting can be switched off entirely through `getSubmitBalancesEnabled` by RPL token governance or the security council. 

Reports do not expire. If the oracle set stops reporting, the last values stand indefinitely: `RocketTokenRETH` has no staleness check, so redemption and minting continue at a price that no longer tracks the validators. If the set reports falsely, each report is capped at {{maxRethDelta}}, but nothing caps the cumulative drift.

The oracle set also writes the RPL price through `RocketNetworkPrices.submitPrices` and the periodic rewards tree through `RocketRewardsPool.submitRewardSnapshot`, both under the same `onlyTrustedNode` gate and oracle consensus. A seat requires a bond of {{oracleSetBond}} RPL, which the other members can burn by voting the member out at {{consensusThreshold}}.

### Node operators

Node operators post part of each validator's 32 ETH as a bond and borrow the rest from the deposit pool. Registration of new operators is controlled by a protocol switch, currently {{registrationStatus}}; the switch does not affect operators already registered. Staking RPL is optional: it is not needed to run validators, but it adds governance voting power and earns a share of protocol revenue. Unstaking RPL takes two steps with a waiting period of {{unstakingPeriod}}. Operators who still run legacy validators must keep a minimum RPL stake in proportion to the ETH they borrowed.

Operators can also be penalised in ETH. For the current validator contracts, a penalty requires {{megapoolPenaltyThreshold}} of the oracle set and is capped at {{megapoolPenaltyCap}} ETH per penalty and over a rolling window. For the legacy contracts, penalties are capped by a rate that is currently {{maxPenaltyRate}}, which disables them entirely.

Operators cannot take depositors' ETH. Validator withdrawals land in a protocol contract that splits them onchain between the operator and the pool. Anyone can trigger the split; only the operator's own share is gated to the operator. Validator exits and final balances are proven against beacon-chain state through EIP-4788, not reported by an oracle.

### Governance and upgrades

The oracle set can upgrade the protocol core contracts by reaching the {{consensusThreshold}} threshold. An oracle-set proposal cannot open for voting until {{oracleVoteDelay}} after it is made. A successful vote records the upgrade proposal as pending and sets the earliest application time {{upgradeDelay}}. Once the delay has elapsed, `execute` is callable by any oracle-set member. 

The lane's reach is total: an executed proposal can replace or add protocol contracts, and any registered contract can write the protocol's entire state — so everything, including the deposit pool and the balance oracle, is replaceable through it. Only the vault and token contracts themselves keep their code.

RPL governance cannot upgrade anything. `RocketDAOProtocolProposals` has no upgrade entry point, and the upgrade contract accepts no caller but the oracle set's proposal contract.

#### The security council

`RocketDAOSecurity.getMemberCount` returns {{securityCouncilSize}}, and a council proposal needs {{securityCouncilQuorum}} of those seats to pass. Membership is held by a {{securityCouncilSeat}} Safe. The council holds two powers:

It can cancel a pending upgrade. `RocketDAOSecurityUpgrade.proposeVeto` requires the change to still be inside its waiting period and passes at {{upgradeVetoQuorum}} of the council's seats. `RocketDAOProposal.getState` returns `Succeeded` the moment votes reach the threshold rather than at the end of the voting window, so a veto needs to land inside that window.

It can also flip an allowlist of settings. `RocketDAOSecurityProposals.proposalSettingUint`, `proposalSettingBool`, and `proposalSettingAddress` check a per-key flag in the registry and revert otherwise. Which keys are open is itself registry state that RPL governance sets, one flag per setting. Today the open keys are on/off switches: deposits, deposit assignment, node registration, node deposits, smoothing-pool registration, vacant validators, bond reduction, withdrawable submission, auction lot creation and bidding, and the oracle reporting switches. The one numeric key is a capped additive nudge to the node commission share. The council can therefore halt new deposits and freeze the oracle, immediately and with no delay of its own. It cannot upgrade a contract, move funds, or stop redemption.

Council membership is set by RPL governance, not by the council: `RocketDAOProtocolProposals.proposalSecurityInvite`, `proposalSecurityKick`, and `proposalSecurityReplace`.

#### RPL governance

Voting is by registered node operators through `RocketDAOProtocolProposal`, weighted by the square root of their staked RPL and counted only up to {{votingStakeCap}} of their bonded ETH's value; RPL held outside a registered node carries no vote. Voting power is proven optimistically rather than tallied on-chain: a proposer stakes {{proposalBond}} RPL on a claimed voting-power tree, anyone can stake {{challengeBond}} RPL to challenge a node of it, and a challenge left unanswered for {{challengePeriod}} defeats the proposal and transfers the bond to the challengers, refereed by `RocketDAOProtocolVerifier`. A proposal needs {{proposalQuorum}} of voting power in support and is blocked by {{proposalVetoQuorum}} voting to veto.

What passes can set any protocol parameter, split reward inflation between claimant groups, spend the treasury through `RocketClaimDAO`, and change the security council's membership.

#### The guardian

RocketStorage.getGuardian is an externally owned account left from deployment. Its original admin powers are permanently disabled, but two remain live. It can set the penalty ceiling for legacy validators (RocketMinipoolPenalty.setMaxPenaltyRate) with no upper bound; governance cannot reach or revoke this power. It can also repair the public-key index for existing validators (fixPubkeys), but only to values already recorded on-chain, and nothing that moves funds reads that index. The guardian can hand the role to another address.
