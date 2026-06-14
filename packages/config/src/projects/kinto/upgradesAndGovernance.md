All critical system smart contracts are upgradeable (can be arbitrarily changed). This permission is held by the {{securityCouncilStats}} Kinto Security Council on Layer 1 and can be executed without any delay.
On the Kinto Layer 2, critical permissions are mostly guarded by an AccessManager contract, and then passed down with configurable delays to both the Security Council and the {{multisig2Stats}} Kinto Multisig 2.

The Appchain designation of Kinto is mainly due to a modified L2 node, which queries a special censoring contract on L2 (called KintoAppRegistry) for a whitelist to filter transactions.
This makes the KintoAppRegistry contract a critical system contract and any change to its configuration equivalent to an upgrade of the Layer 2 system.
The KintoAppRegistry contract is also governed via the AccessManager by the Security Council or the Kinto Multisig 2 with a {{l2critDelay}} delay.

Another critical contract on the Appchain is called KintoID. Permissioned actors with the 'KYC provider' role in the KintoID contract can 'sanction' (freeze) user smart wallets, preventing them from transacting.
To protect users from this role which is mostly held by EOAs, a sanction expires if not confirmed by the Security Council within {{sanctionExpirySeconds}}.
An expired sanction guarantees the user a {{sanctionCooldownWindow}} cooldown window during which they cannot be sanctioned again.

The canonical (enforced) smartwallet for users on Kinto can be upgraded via the KintoWalletFactory, using the same path via the AccessManager.
Additionally, each smart wallet must use a recoverer address custodied by Turnkey. This allows users to reset the wallet signers via their email in case they lose their passkey.
It also necessitates a recovery delay to prevent turnkey from maliciously using their recoverer permission. During this period of {{recoveryTime}}, the user can cancel the recovery process with any transaction in their smart wallet.

The permissioned sanctions logic by KYC providers necessitates at least an {{l2critDelay}} delay on all upgrades that aren't executed by the Security Council, allowing the user at least 7d to exit.
