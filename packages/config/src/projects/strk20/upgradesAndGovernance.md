The pool uses StarkWare-style role components and an upgradeable replaceability component. As manually checked on Starknet mainnet on 2026-06-17 around block `10,886,198`, the configured upgrade delay is `0`.

No current holder was found for `UPGRADE_GOVERNOR` or `UPGRADE_AGENT`, so no account had direct upgrade execution power at the time of the check. However, either current `GOVERNANCE_ADMIN` can grant `UPGRADE_GOVERNOR`; with a zero configured delay, a newly granted upgrade governor can approve and execute an implementation effectively immediately, subject to the component's activation and expiration checks.

The current permission surface observed during the manual check was:

- `APP_GOVERNOR` can set the fee amount, fee collector, and proof validity window.
- `GOVERNANCE_ADMIN` can grant governance and upgrade-governor roles.
- `SECURITY_ADMIN` can grant pause, unpause, and auditor-key administration roles.
- `SECURITY_AGENT` can pause the pool, if granted.
- `SECURITY_GOVERNOR` can unpause the pool and change the auditor public key, if granted.
- `UPGRADE_GOVERNOR` can approve and execute upgrades, if granted.
- `UPGRADE_AGENT` can execute approved upgrades, if granted.

The live role holders observed during the same manual check were:

- `APP_GOVERNOR`: `0x2796da10aba2e1f445c38eba07e5a4393d6dab30d203d3432deb824e891619a`
- `GOVERNANCE_ADMIN`: `0x3103066e6c7037ba947ea9a7b5b8d110ae7f3d631fa5849435d0dc1fc5ef785`
- `GOVERNANCE_ADMIN` and `SECURITY_ADMIN`: `0x663cc699d9c51b7d4d434e06f5982692167546ce525d9155edb476ac9a117d6`

L2BEAT cannot currently monitor Starknet permissions or contract changes for this project. The role and upgrade information above is a manual snapshot, not an automated live discovery result.
