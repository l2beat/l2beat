## Funds can be stolen if
1. either governance multisig passes a malicious upgrade of the confidential tokens or Zama's protocol contracts, which takes effect instantly.
2. the current or any retained KMS signer set, which either multisig can create or retune instantly, attests an inflated unwrap amount.
3. Zama's coprocessor ({{coprocessorThreshold}}/{{coprocessorSignerCount}}) accepts invalid encrypted inputs that bypass balance checks.
<br>
## Funds can be lost if
1. an underlying token issuer blacklists a confidential token's address.
2. the token owner or an underlying denylist blocks a user before they unwrap.
3. an appointed pauser halts a token and the owner keeps it paused.
4. the KMS or Zama's coprocessor stops or loses ciphertext data, which halts every unwrap.
<br>
## Privacy can be lost if
1. {{kmsKeyThreshold}} of {{kmsSignerCount}} KMS operators combine their key shares (see privileged insider).
2. the token owner appoints an observer or upgrades the token (see privileged insider).
3. Zama changes its closed-source app to leak amounts to itself or to third parties (see privileged insider and network observer).
4. public wraps and unwraps bound a user's balance (see chain analyst).
5. lattice cryptography is broken or old KMS key shares leak, which decrypts every published ciphertext (see future adversary).
