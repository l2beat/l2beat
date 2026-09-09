Polymarket is a prediction market where users trade shares in the possible outcomes of an event. Once the result is known, each share pays the fraction of one {{collateralSymbol}} assigned to its outcome.

A complete set contains one share of every possible outcome: one YES and one NO share in a binary market, or one share of each outcome in a multi-outcome market. Creating a complete set through the ordinary path consumes one {{collateralSymbol}}. Before resolution, the set can be merged back into that unit; after resolution, its shares collectively redeem for the same unit.

Orders are signed offchain and settled onchain by approved operators. The contracts enforce the signed trade terms and the accounting of outcome shares, but Polymarket's team chooses which markets appear in the product, operators choose which orders to fill, and permissioned actors remain involved in resolution and administration.

### Collateral and positions

Trading uses {{collateralSymbol}}, an upgradeable token backed one-for-one by native USDC or USDC.e held in an upgradeable vault. Anyone can convert between {{collateralSymbol}} and a supported backing asset while that direction is unpaused. Admins can pause either conversion per asset immediately; upgrades to the token or vault must wait {{timelockDelay}} in the Timelock.

Polymarket uses two connected position systems. Many binary and neg-risk markets are created first in the Conditional Token Framework (CTF), whose share ledger and exchange code cannot be upgraded. Polymarket registers many of the same markets in an upgradeable PositionManager, where they use separate share IDs. Holders can surrender registered CTF shares for the corresponding PositionManager shares, and combination positions are built from PositionManager shares.

Ordinary splitting, merging and redemption preserve the one-for-one backing. In the upgradeable system, however, authorised actors can create outcome shares outside the ordinary split flow, and its outcome logic can mint {{collateralSymbol}} when positions are merged or redeemed. A malicious authorised actor or upgrade could therefore create claims against the vault without a matching deposit.

### Trading

The main CTF venues use a central limit order book: a user signs the assets and amounts they accept, then an operator selects and orders the fills. Combination positions use a request-for-quote venue with the same basic model. An operator cannot forge a user's signature or make the pre-fee exchange rate worse than the signed limit, but it can censor, delay or reorder valid orders.

Fees are an exception to the signed terms: the operator supplies them only when settling the trade. {{ctfFeeRule}} A sell fee can consume all sale proceeds, while a buy fee can charge additional collateral up to the user's balance and allowance. The all-in price can therefore be worse than the signed limit. {{combosFeeRule}}

Cancellation is normally requested offchain. To stop all of their signed orders onchain, a user can start a pause that currently takes effect after {{userPauseBlocks}} blocks; orders remain fillable during that window. Admins can change the delay for future pauses, from zero to {{maxUserPauseBlocks}} blocks, and can pause an entire venue immediately.

### Market creation and resolution

Users can suggest markets, but Polymarket's markets team decides which ones are listed. Creating a raw oracle question onchain is a separate step: it does not put the market in the product or make an operator trade its shares.

The main binary and CTF neg-risk markets use a managed UMA optimistic oracle. Only approved Polymarket contracts can request an answer and only whitelisted proposers can submit one. Anyone who supplies the required bond and UMA final fee can dispute an active proposal. Both are paid in the question's collateral token, not in UMA voting power; if there is a dispute, UMA tokenholders vote with UMA voting power. The losing bonded side forfeits its stake after the oracle's fee, and the winner receives the remainder and any reward.

An answer normally has {{oracleLiveness}} to be challenged, and a custom window cannot be shorter than the current {{oracleDisputeWindow}} minimum. On the managed oracle, expiry alone is not final: the answer remains disputable until a permissioned resolver settles it. After settlement, anyone can pass the answer to an unpaused market.

In this integration, the first dispute also restarts the market's resolution. UMA's first vote settles the original bond contest, but the restarted answer must complete its own challenge process before it can decide the market. If that answer is disputed too, it also goes to UMA voting.

Polymarket admins retain direct resolution powers. For the main binary path, they can pause or restart a question and, after {{adapterSafetyPeriod}}, choose YES, NO or an even split. A separate binary path permits any nonzero split after {{legacyAdapterSafetyPeriod}}. For CTF neg-risk questions, admins can block the oracle path and force either outcome {{negRiskOverrideTiming}}. When a CTF market is registered in PositionManager, anyone can copy its settled CTF result into the corresponding PositionManager market unless an admin has paused it. Other PositionManager markets rely on permissioned reporters, which admins can replace, pause or block per market.

### Hosted wallets

Retail deposits are credited to a smart wallet for each user. Polymarket's relayer submits transactions, but it cannot spend by itself: each batch needs a signature from the wallet owner or an owner-authorised session key. A session key can spend the wallet's assets within the authority granted to it.

An owner can pause the wallet and, after the current {{walletPauseDelay}} delay, withdraw assets or revoke approvals directly. Pausing does not invalidate otherwise valid signed batches. Admins can immediately change the delay to any positive value up to {{walletMaxPauseDelay}}, including while an owner is already waiting.

Most wallets follow a shared upgradeable implementation. After pausing and waiting, an owner can opt out and keep the current version instead. Other wallets can be upgraded individually only through an owner-signed action to an implementation approved by the factory.

### Governance and upgrades

A {{adminSafe}} Polymarket multisig holds most operational powers. Without the Timelock it can pause collateral conversion and trading, manage operators and fees, change user-pause delays, configure the managed oracle, and appoint resolution actors. The Timelock waits {{timelockDelay}} before upgrades to the collateral, vault, wallet system or upgradeable position system.

The CTF share ledger and its two exchanges cannot be upgraded, but their existing operator, fee and pause controls remain immediate. The managed UMA oracle is upgraded outside the Polymarket Timelock by a joint {{oracleUpgradeSafe}} multisig requiring both Polymarket and the oracle operators. The immediate CTF neg-risk override is also held by an externally owned account and by OperationsAccount, whose contract code is unverified. The Timelock therefore delays many code changes, but it does not delay powers already granted to admins and operators.
