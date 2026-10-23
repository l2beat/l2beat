CRISP (Coercion-Resistant Impartial Selection Protocol) is a secret ballot on Interfold, a network for encrypted computation. Anyone can open a CRISP vote, and the Interfold DAO votes on its proposals with it. A voter picks an option, and only the totals per option are decrypted. Every address that receives a ballot, and its voting power, stays public.

Voters trust the committee of {{committeeMembers}} ciphernodes drawn for each vote, any {{decryptionThreshold}} of whom can decrypt every ballot. They also trust Interfold, which hosts the app and runs the CRISP server that must sign every ballot. Two Interfold multisigs change the protocol instantly, see [upgrades and governance](#upgrades-and-governance).

### Architecture

Each vote is one E3 (encrypted execution environment), a computation over encrypted inputs that the Interfold contract coordinates. CiphernodeRegistry draws a committee of ciphernodes by a lottery weighted by their collateral. The committee generates a shared public key for BFV, a lattice-based fully homomorphic encryption scheme, and each member keeps a share of the secret key. An OpenVM program adds up the encrypted ballots, and the committee decrypts only the sum.

### Flow

1. **Request.** A requester, such as a DAO proposal, opens a CRISP vote and pays for its E3. Voting power is fixed at that moment.
2. **Vote.** Your browser encrypts the ballot to the committee key and proves that it is well formed and signed by your wallet. The CRISP server stores the ciphertext on Avail, signs that it is available and submits it.
3. **Mask.** Anyone can add an encrypted zero to any eligible address, and it looks like a vote. The app sends masks only when the voter adds them.
4. **Re-vote.** A later ballot from your wallet replaces the earlier one.
5. **Tally.** The committee decrypts the sum and publishes the totals per option.

### Voting

A CRISP vote sets who may vote in one of three ways. It reads voting power from a token at a snapshot, as Interfold DAO votes do, or uses an address list built from token holders or supplied by the requester. The Interfold DAO must post each list's Merkle root, so it controls these lists. Each voter counts with their token weight or with the same weight as everyone else. With equal weights, the totals leave nothing to match against.

### App

The ratings assume Interfold DAO votes through Interfold's [governance app](https://governance.theinterfold.com), which is [open source](https://github.com/theinterfold/the-interfold-governance) and hosted by Interfold. By default it counts a random 99 to 100% of the voter's power, so totals do not match balances exactly. A local build removes the host's view of the choice before encryption. A voter can also send the ballot from their own wallet.

### Ciphernodes

Operators register by bonding {{bond}} FOLD and buying tickets with sUSDS. The lottery gives each bond-owner address at most one seat per committee, the only limit on one party filling a committee. Interfold does not name the operators and calls the current set an [initial one](https://blog.theinterfold.com/network-alpha-mainnet/).
