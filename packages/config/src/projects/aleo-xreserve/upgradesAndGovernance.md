Two systems govern the route, USDCx on Aleo and Circle's contracts on Ethereum. Each can change at once. Single keys hold every role except Aleo upgrades, which need a 2/3 multisig.

### USDCx on Aleo

A 2/3 multisig can upgrade five programs: the token `usdcx_stablecoin.aleo`, the bridges `usdcx_bridge.aleo` and `usdcx_bridge_v2.aleo`, the freeze list and the wrapper. An upgrade applies as soon as two signers approve it. One address can upgrade the multisig program `usdcx_multisig_core.aleo` itself, which would let it approve upgrades of all five.

A second address, the role manager, grants and revokes the mint, burn, pause and freeze-list roles. It also sets the attester keys and burn limits of bridge v2. A third address edits the freeze list, and a fourth can pause the token and bridge v2. Each mint needs a signature from Circle's attester key for its source token.

### Circle xReserve and Gateway on Ethereum

The USDC that backs USDCx sits in Circle's GatewayWallet, credited to a depositor contract for Aleo. The balance moves when {{attesterThreshold}} of that contract's {{attesterCount}} attesters sign a burn intent and Circle's Gateway pays it out. The depositor's domain manager, an EOA, can add attesters at once. Removing an attester or changing the threshold takes {{attesterDelay}}.

EOAs own xReserve, the GatewayWallet and the GatewayMinter and can upgrade each at once. Further EOAs can pause each contract or the Aleo domain alone. Others can block an Aleo address in xReserve or an Ethereum address in the Gateway contracts.
