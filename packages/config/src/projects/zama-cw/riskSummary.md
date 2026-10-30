## Funds can be stolen if
1. a governance multisig deploys a malicious [upgrade](#upgrades-and-governance), which takes effect instantly.
2. a KMS signer set, which either multisig can create instantly, attests an inflated unwrap amount.
3. {{coprocessorThreshold}} of {{coprocessorSignerCount}} coprocessors accept invalid encrypted inputs that bypass balance checks.
<br>
## Funds can be lost if
1. the coprocessors lose ciphertext data, so balances can no longer be decrypted.
<br>
## Funds can be frozen if
1. an underlying token issuer blacklists a confidential token's address.
2. the token owner or an underlying denylist blocks a user before they unwrap.
3. an ACL, Gateway or token pauser halts tokens and the owner keeps them paused.
4. the KMS or the coprocessors stop, which halts every unwrap.
<br>
## Privacy can be lost if
1. {{kmsKeyThreshold}} of {{kmsSignerCount}} KMS operators combine their key shares (see privileged insider).
2. the token owner appoints an observer or upgrades the token (see privileged insider).
3. a user swaps, since Zama's app and the swap's compliance address see the amount (see privileged insider).
4. a user keeps the vault form's default of sharing their balance with Merkl (see privileged insider).
5. Zama changes its closed-source app to leak amounts to itself or to third parties (see privileged insider).
6. public wraps, unwraps and vault batch totals bound a user's balance (see public observer and chain analyst).
7. elliptic-curve cryptography is broken, which lets anyone impersonate a user to the KMS and decrypt that user's history (see future adversary).
