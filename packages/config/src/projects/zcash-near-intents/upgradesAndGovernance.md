The route touches three governed systems on NEAR, each can change instantly. The Ethereum side runs on EOAs.

### NEAR Intents Verifier (`intents.near`)

`intents.sputnik-dao.near`, a 3/5 multisig, holds the `DAO` role and is super admin, so it can grant every other role. Upgrades go through `ctl-intents.near`, a controller whose only admin is the same multisig, and deploy at once. Six accounts hold `PauseManager` and can halt all swaps and withdrawals, and only the multisig can resume them. One EOA holds `UnrestrictedAccountLocker` and can lock any user account. A locked account keeps receiving deposits, while its intents and withdrawals stop until the multisig unlocks it.

### Custodial "PoA" bridge (`omft.near`, `eth.omft.near`)

The `poa-factory` contract `omft.near` deploys one token per bridged asset. It mints on the signal of `TokenDepositer`: `bridge-mng.near`, an EOA, and `int-mnt-dao.sputnik-dao.near`, a 3/3 multisig. NEAR takes every mint on trust. The NEAR Intents multisig is super admin.

### Zcash connector (`zcash-connector.bridge.near`, `zec.omft.near`, `zcash-client.bridge.near`)

`rainbowbridge.sputnik-dao.near`, a 3/5 multisig, governs the connector, the token's controller and the light client, and sets the bridge fees. `bridge-ops.near` can stage code and pause the connector, and `pm.bridge.near` can pause it. `omni-relayer.bridge.near` and `intents-relayer.near` prove deposits against the light client, whose headers `zcash-relayer.near` relays. Withdrawals are signed by the NEAR MPC network `v1.signer` (11/17, see the [MPC operators page](https://mpc-operators.nearone.org/)) on request of a relayer. These three hold roles that make them relayers. Anyone else becomes one after staking 1,000 NEAR and waiting seven days, and the multisig can reject any relayer. Anyone can refund a deposit the connector never credited, once the light client holds its block. The refund waits two days, or fourteen when the deposit message names no refund address. The multisig or `omni-relayer.bridge.near` can reject the refund until then.
