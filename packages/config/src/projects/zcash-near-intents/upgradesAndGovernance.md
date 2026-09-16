The route touches three governed systems. None of them has an onchain delay that a user could rely on, and the Ethereum side has no contracts at all.

### NEAR Intents Verifier (`intents.near`)

The Verifier is a NEAR contract with `near-plugins` roles. `intents.sputnik-dao.near`, a Sputnik DAO with five council members and a 4/5 threshold, holds the `DAO` role and is super admin, so it can grant every other role. Upgrades go through `ctl-intents.near`, a controller contract whose only admin is the same DAO. A passed proposal deploys the new code at once. Six accounts hold `PauseManager` and can halt all swaps and withdrawals. Nobody holds `UnpauseManager`, so only the DAO can resume. Two EOAs each hold `UnrestrictedAccountLocker` and can lock any user account, which stops its intents and withdrawals while deposits keep arriving, only the DAO can unlock.

### Custodial "PoA" bridge (`omft.near`, `eth.omft.near`)

Despite the name, nothing here is a proof-of-authority consensus or a multisig. The `poa-factory` contract `omft.near` deploys one token per bridged asset and mints on the permission of `TokenDepositer`: `bridge-mng.near`, an EOA, and `int-mnt-dao.sputnik-dao.near`, a three-member DAO whose members can each execute a call alone. The same DAO as above is super admin. Nothing on NEAR verifies that a mint is backed. On Ethereum the funds sit in the escrow [`0x2CfF…2680`](https://etherscan.io/address/0x2CfF890f0378a11913B6129B2E97417a2c302680) and in per-quote deposit accounts, all plain EOAs.

### Zcash connector (`zcash-connector.bridge.near`, `zec.omft.near`, `zcash-client.bridge.near`)

The connector, the token's controller and the light client are all governed by `rainbowbridge.sputnik-dao.near`, a Sputnik DAO with a 2/5 threshold. `bridge-ops.near` (five EOAs) can stage code, pause the connector and run migrations; `pm.bridge.near` can pause. Deposits are credited only after `omni-relayer.bridge.near` or `intents-relayer.near` submit an inclusion proof against the light client, whose headers are relayed by `zcash-relayer.near`. Withdrawals are signed by the NEAR MPC network `v1.signer` (9/15) on request of a whitelisted relayer. A user cannot trigger the signature alone. The one permissionless path is a refund of a deposit that was never credited, executable by anyone after a two-day timelock (fourteen days when the relayer has flagged the request). Bridge fees are 0.0001 ZEC minimum per deposit and withdrawal, adjustable by the DAO.
