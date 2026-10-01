## Funds can be stolen if
1. The Panther DAO signers upgrade the Vault or a diamond facet, or point a circuit at a malicious verifying key.
2. All participants of the circuit-specific trusted setup colluded.
<br>
## Funds can be frozen if
1. The trust providers stop signing KYT messages or KYC renewals, or a user's zAccount expires, since every withdrawal needs both.
2. The Panther DAO signers blacklist a zAccount, change a zone's rules or update the static root that every proof must reference.
<br>
## Privacy can be lost if
1. The zone's data escrow operator cooperates with either the DAO or the zone operator, which together can decrypt the full history of a zAccount.
2. A KYC or KYT provider shares the identity behind a master EOA, which is publicly linked to its zAccount and signs every deposit and withdrawal.
3. BabyJubJub elliptic-curve cryptography is broken, e.g. by a quantum computer, exposing every escrow ciphertext and note stored onchain.
