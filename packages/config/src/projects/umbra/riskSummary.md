## Funds can be lost if
1. a recipient loses the keys needed to identify and spend payments sent to their stealth addresses.
2. an unsupported ERC-20, such as a fee-on-transfer or rebasing token, causes the Umbra contract's internal accounting to diverge from its token balance.
<br>
## Privacy can be lost if
1. a recipient sends funds from a stealth address to a publicly linked address or consolidates payments in a recognizable way.
2. public timing, amount, token, or ENS registration patterns let an observer narrow down the possible recipient.
<br>
## New payments can be stopped if
1. the Umbra owner sets an arbitrarily high toll for contract-routed payments.
