Kinto enforces the use of smart wallets and KYC. A valid state transition in Kinto disallows all transactions by EOAs and new contracts creation, unless specifically whitelisted.
This setup effectively enforces smart wallet use because the auxiliary contracts of the standard KintoWallet smart wallet (like the EntryPoint and the KintoWalletFactory) are whitelisted.
The KYC validation is part of the KintoWallet signature verification. Since all users must use the same implementation of this smart wallet, all user transactions on Kinto check for an up-to-date KYC flag, and are dropped in case the check fails.
The system ensures that KYC can be revoked only if the Security Council proactively agrees to a proposed status change by a KYC provider. The Security Council has been historically following KYC provider decisions and it is explicitly tasked to do so.

The KintoWallet implementation supports different signer thresholds with a maximum of 4 signers. The first signer for each users smart wallet though is enforced to be held by Turnkey in a TEE.
Users can make transactions using this first signer only through Kinto's frontend. Authenticated by a passkey, the Turnkey TEE then signs the transaction for them and submits it to the L2.
The user can still choose to not trust Turnkey by adding 2 EOA signers to their wallet and setting their signer policy to 2/3 during wallet creation.

Contracts outside of the ones necessary to interact with the smart wallet and to withdraw the gas token are out of scope for the stage assessment and might present additional risks.
