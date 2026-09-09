Rocket Pool is an Ethereum staking pool. Anyone can deposit ETH and receive rETH, a token that appreciates against ETH as the pool's validators earn rewards. Node operators run the validators by putting up part of the stake, with the pool supplying the remainder, and never take custody of depositors' ETH. A permissioned oracle set of {{oracleSetSize}} node operators writes the number that rETH prices itself from, and the same set is the only actor that can change protocol code.

### Depositing

Depositing is open to anyone with a minimum of {{minimumDeposit}} ETH. The protocol keeps a fee of {{depositFee}} and mints rETH with the rest. Incoming ETH first refills the redemption buffer up to {{targetCollateralRate}} of the tracked backing, and the remainder waits in RocketVault until it is matched to a validator, under a cap of {{maximumPoolSize}} ETH on unassigned ETH. Deposits can be switched off instantly by the security council and by RPL governance.

![Rocket Pool deposit flow](/images/architecture/rocketpool-deposits.png#center)

### Redeeming

Redeeming is open to any holder and has no pause switch, but it pays only from liquid ETH, the token contract's buffer plus the deposit pool's unassigned surplus. When that runs out, redemption reverts and holders use the secondary market or wait. The protocol does not implement EIP-7002, so no contract can force a validator exit. Staked ETH returns only when validators leave the beacon chain, at the operator's initiative or through slashing.

![Rocket Pool rewards and withdrawal flow](/images/architecture/rocketpool-withdrawals.png#center)

### The exchange rate

The rETH price is a stored number, total backing ETH divided by rETH supply, written by the oracle set. A report needs {{oracleSetQuorum}} of {{oracleSetSize}} members to agree, can move the price at most {{maxRethDelta}} in either direction, and can land once per {{submitFrequency}}. Reports do not expire, so a silent oracle freezes the price and minting and redemption continue at the stale value. A lying oracle is capped at {{maxRethDelta}} per report, but nothing caps the cumulative drift. Reporting can be switched off instantly by the security council. The same set also reports the RPL price and the rewards tree, and a seat requires a bond of {{oracleSetBond}} RPL that the other members can burn by voting the member out.

### Node operators

Operators post part of each validator's 32 ETH as a bond and borrow the rest from the pool. Registration of new operators is a protocol switch, currently {{registrationStatus}}. Staking RPL is optional, it adds governance voting power and a share of protocol revenue, and unstaking takes {{unstakingPeriod}}. Staked RPL is held by protocol contracts, so a contract upgrade by the oracle set can reach it. Operators cannot take depositors' ETH. Validator withdrawals land in a protocol contract that splits them on-chain between operator and pool, anyone can trigger the split, and exits are proven against beacon-chain state rather than reported. The oracle set can fine an operator in ETH at {{megapoolPenaltyThreshold}} agreement, capped at {{megapoolPenaltyCap}} ETH per penalty and over a rolling window.

### Governance and upgrades

Only an executed oracle-set proposal can change protocol code. Voting cannot open until {{oracleVoteDelay}} after a proposal is made, and a passed upgrade waits another {{upgradeDelay}} before any member can execute it. The lane's reach is nearly total, everything including the deposit pool and the balance oracle is replaceable through it, and only a short fixed list of contracts, among them the vault and the tokens, keeps its code. RPL governance cannot upgrade anything.

**The security council**

Membership is held by a {{securityCouncilSeat}} Safe appointed by RPL governance. The council can veto a pending upgrade while it waits out its delay, and can instantly flip an allowlist of settings, today mostly on and off switches for deposits, registrations, and oracle reporting, plus a capped nudge to the node commission share. It cannot upgrade contracts, move funds, or stop redemption.

**RPL governance**

Registered node operators vote with their staked RPL, counted up to {{votingStakeCap}} of their bonded ETH value. RPL held outside a node carries no vote. Voting power is proven optimistically, a proposer bonds {{proposalBond}} RPL, anyone can challenge a claimed tally with {{challengeBond}} RPL, and an unanswered challenge defeats the proposal after {{challengePeriod}}. What passes can set any protocol parameter, spend the treasury, and change the council's membership, but cannot change code.

**The guardian**

An externally owned account left from deployment. Its original admin powers are permanently disabled, but it still sets the penalty ceiling for legacy validators, with no upper bound and no way for governance to reach or revoke that power.

### What cannot be changed

No party can upgrade the vault or the token contracts, redirect a funded validator's payout, pause redemption, or move a holder's tokens. Withdrawal credentials are fixed to the validator contract when it is funded. The oracle set can misprice rETH by {{maxRethDelta}} per report and, after the delays above and absent a veto, replace the code that computes the price. The security council can stop deposits and freeze the price immediately. Neither can reach the pool's ETH without first changing code through the delayed lane.
