Rocket Pool is an Ethereum staking pool. Anyone can deposit ETH and receive {{rethSymbol}}, a token that appreciates against ETH as the pool's validators earn rewards. Anyone can also become a node operator: run validators for the pool by putting up part of the stake yourself, with the pool supplying the remainder. Neither side is permissioned, and node operators never take custody of depositors' ETH — validator withdrawal credentials point at a contract, and that contract splits every withdrawal between the operator and the pool using accounting it holds itself.

Two things are trusted rather than proven. A permissioned set of {{oracleSetSize}} node operators, the oracle set, writes the number that {{rethSymbol}} prices itself from. The same set is the only body that can change which code the protocol runs.

### Contract layout

The protocol keeps all of its state in one contract, RocketStorage, as typed key-value maps. Logic contracts hold no state of their own; they read and write through the registry and find each other by resolving `RocketStorage.getAddress(keccak256("contract.address", name))` at call time. Repointing one name is therefore a single storage write that moves every caller to new code. `RocketStorage.onlyLatestRocketNetworkContract` restricts writes to addresses flagged as registered contracts, and imposes no delay of its own: whatever delay exists comes from the contract doing the writing.

### Depositing

`RocketDepositPool.deposit` is open to anyone. It requires the deposit flag in `RocketDAOProtocolSettingsDeposit` to be on, a minimum of {{minimumDeposit}} ETH, and enough room under the {{maximumPoolSize}} ETH pool cap once queued validators are accounted for. It keeps a fee of {{depositFee}} and calls `RocketTokenRETH.mint` for the rest. Incoming ETH first tops the token contract's redemption buffer up to {{targetCollateralRate}} of the tracked backing; the remainder is booked into RocketVault under the deposit pool's name until it is matched to a validator.

### Redeeming

`RocketTokenRETH.burn` is open to any holder. There is no admin gate, no pause flag, and no governance switch on it — the security council's allowlist covers deposits but not redemption. It does depend on liquidity: the function requires `getTotalCollateral()`, the ETH held by the token contract plus the deposit pool's unassigned surplus, to cover the payout. Governance targets a buffer of {{targetCollateralRate}} of the token's backing through `RocketDAOProtocolSettingsNetwork.getTargetRethCollateralRate`, and when the buffer is thin, as it is whenever the validator queue is absorbing deposits, on-chain redemption reverts and holders have to use the secondary market or wait. Staked ETH is not redeemable on demand; it returns to the pool only as validators exit.

### The exchange rate

`RocketTokenRETH.getEthValue` is `amount × RocketNetworkBalances.getTotalETHBalance() / getTotalRETHSupply()`. Both numbers are written by `RocketNetworkBalances.submitBalances`, which is gated by `onlyTrustedNode` — oracle-set members only. A report lands once submissions reach {{consensusThreshold}} of the set, that is {{oracleSetQuorum}} of {{oracleSetSize}} members, and `executeUpdateBalances` lets anyone finalise a report that already has that many signatures, so the set cannot sit on a report it has signed.

Three bounds are enforced in `_updateBalances`. A report may not land until almost a full interval of {{submitFrequency}} has passed since the last one. The price may move at most {{maxRethDelta}} per report, in either direction. And reporting can be switched off entirely through `getSubmitBalancesEnabled`.

Reports do not expire. If the oracle set stops reporting, the last values stand indefinitely: `RocketTokenRETH` has no staleness check, so redemption and minting continue at a price that no longer tracks the validators. If the set reports falsely, each report is capped at {{maxRethDelta}}, but nothing caps the cumulative drift of a sustained campaign.

The oracle set also writes the {{rplSymbol}} price through `RocketNetworkPrices.submitPrices` and the periodic rewards tree through `RocketRewardsPool.submitRewardSnapshot`, both under the same `onlyTrustedNode` gate and the same consensus share. A seat costs {{oracleSetBond}} {{rplSymbol}}, posted as a bond that a passed kick proposal can fine.

### Node operators

Node operators may stake {{rplSymbol}} through `RocketNodeStaking.stakeRPL`; it is not required for running validators, counts toward governance voting power, and earns a share of protocol revenue. Unstaking takes two steps with a waiting period of {{unstakingPeriod}}, and operators with legacy validators must keep a minimum stake proportional to their borrowed ETH while those validators run. Staked collateral is reachable by protocol code: `burnRPL`, `transferRPL`, and `lockRPL` carry only the `onlyLatestNetworkContract` modifier, so any contract registered in the registry can move it, and `slashRPL` is callable by a registered validator contract. An operator's collateral is exposed to whatever code is registered at those names.

Operators can also be penalised in ETH. For the pooled per-node contracts, `RocketMegapoolPenalties.penalise` is `onlyTrustedNode` and applies once submissions reach {{megapoolPenaltyThreshold}} of the oracle set, capped at {{megapoolPenaltyCap}} ETH per penalty and by the same figure as a running total over a rolling window whose length is a constant in the contract's code. For the older one-validator contracts, `RocketNetworkPenalties.submitPenalty` votes a rate, but the effect is capped by `RocketMinipoolPenalty.getMaxPenaltyRate`, currently {{maxPenaltyRate}} — at that value no legacy penalty can be applied at all.

What operators cannot do is take depositors' ETH. Validator withdrawals land in the operator's validator contract, which computes the split on-chain. Triggering that split is open to anyone: `RocketMegapoolDelegate.distribute` and `RocketMinipoolDelegate.distributeBalance` carry no caller restriction, while only moving the operator's own share out (`RocketMegapoolDelegate.claim`) is owner-gated, so an absent operator cannot hold the pool's share. Exit and final-balance facts are proven against beacon-chain state through `RocketMegapoolManager` and `BeaconStateVerifier` rather than asserted by a reporter.

### Changing the code

`RocketDAONodeTrustedUpgrade.upgrade` is the only path that changes which code the protocol runs, and it accepts calls only from `rocketDAONodeTrustedProposals`, that is from an executed oracle-set proposal. It does not apply the change; it records it as pending and sets the earliest application time {{upgradeDelay}} later. After that, `execute` is callable by any oracle-set member. An oracle-set proposal cannot open for voting until {{oracleVoteDelay}} after it is made, so the two delays apply in sequence.

`_upgradeContract` refuses a fixed list of names outright: the vault, the token contracts, the beacon-chain deposit contract, and the penalty-cap contract. Those addresses can never be replaced. Everything else can, including the balance oracle and the deposit pool. The exclusion does not close the registry: `_addContract` can register an entirely new name at any address, and that address immediately gains write access to the registry.

Token-holder governance cannot upgrade anything. `RocketDAOProtocolProposals` has no upgrade entry point, and the upgrade contract accepts no caller but the oracle set's proposal contract.

### The security council

`RocketDAOSecurity.getMemberCount` returns {{securityCouncilSize}}, and a council proposal needs {{securityCouncilQuorum}} of those seats to pass. Membership is held by a {{securityCouncilSeat}} Safe. The council holds two powers.

It can cancel a pending upgrade. `RocketDAOSecurityUpgrade.proposeVeto` requires the change to still be inside its waiting period and passes at {{upgradeVetoQuorum}} of the council's seats. `RocketDAOProposal.getState` returns `Succeeded` the moment votes reach the threshold rather than at the end of the voting window, so a veto lands well inside that window.

It can also flip an allowlist of settings. `RocketDAOSecurityProposals.proposalSettingUint`, `proposalSettingBool`, and `proposalSettingAddress` check a per-key flag in the registry and revert otherwise. Which keys are open is itself registry state that token-holder governance sets, one flag per setting. Today the open keys are on/off switches — deposits, deposit assignment, node registration, node deposits, smoothing-pool registration, vacant validators, bond reduction, withdrawable submission, auction lot creation and bidding, and the oracle reporting switches — plus one number, an additive nudge to the node commission share, which the same function caps at the configured maximum and at the voter share. The council can therefore halt new deposits and freeze the oracle, immediately and with no delay of its own. It cannot upgrade a contract, move funds, or stop redemption.

Council membership is set by token-holder governance, not by the council: `RocketDAOProtocolProposals.proposalSecurityInvite`, `proposalSecurityKick`, and `proposalSecurityReplace`.

### Token-holder governance

{{rplSymbol}} holders vote through `RocketDAOProtocolProposal`. Voting power is proven optimistically rather than tallied on-chain: a proposer stakes {{proposalBond}} {{rplSymbol}} on a claimed voting-power tree, anyone can stake {{challengeBond}} {{rplSymbol}} to challenge a node of it, and a challenge left unanswered for {{challengePeriod}} defeats the proposal and transfers the bond to the challengers, refereed by `RocketDAOProtocolVerifier`. A proposal needs {{proposalQuorum}} of voting power in support and is blocked by {{proposalVetoQuorum}} voting to veto.

What passes can set any protocol parameter, split reward inflation between claimant groups, spend the treasury through `RocketClaimDAO`, and change the security council's membership.

### The guardian

`RocketStorage.getGuardian` is an externally owned account. It was the deployment-time administrator, and every function it once held on `RocketDAOProtocol`, `RocketDAONodeTrusted`, and `RocketDAONodeTrustedUpgrade` also carries `onlyBootstrapMode`. Both bootstrap flags read true on-chain, which makes that modifier revert permanently — the flags can be set but never cleared. Those powers are gone.

Two ungated powers remain. `RocketMinipoolPenalty.setMaxPenaltyRate` is `onlyGuardian` with no bootstrap check and no upper bound in the code; it sets the ceiling on legacy validator penalties, and the contract stores that ceiling outside the registry so the oracle set cannot reach it, while the registry refuses to repoint the contract, so the power is permanent. `RocketUpgradeOneDotThree.fixPubkeys` is also `onlyGuardian` with no bootstrap check and no one-shot flag, but it only rewrites public-key-to-contract lookups for validators that already exist. The guardian can additionally hand its own role to another address through `setGuardian` and `confirmGuardian`.

### What no one can do

No party can upgrade the vault or the token contracts, redirect a funded validator's payout, pause redemption of {{rethSymbol}}, or move a holder's tokens. The payout point is not a setting: withdrawal credentials are derived from the validator contract's own address (`RocketMinipoolManager.getMinipoolWithdrawalCredentials` is `pure`, `RocketMegapoolDelegate.getWithdrawalCredentials` returns this contract's address) and are passed to the beacon-chain deposit at funding time. The token has no admin transfer path: the only hook on transfers is the post-deposit delay in `RocketTokenRETH._beforeTokenTransfer`. The oracle set can misprice {{rethSymbol}} by a {{maxRethDelta}} step per report and, given the delays above and no veto, replace the code that computes it. The security council can stop deposits and freeze the price at its last value immediately. Neither can withdraw the pool's ETH without first replacing the code that holds it.
