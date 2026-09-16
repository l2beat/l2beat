## Description

Orchard is the shielded protocol of Zcash, activated with NU5 in May 2022. Every shielded spend and output is an *Action* whose validity is proven with [Halo 2](https://zcash.github.io/halo2/), a PLONKish proof system developed by the Electric Coin Company. Halo 2 uses an inner product argument (IPA) polynomial commitment over the [Pasta curve cycle](https://github.com/zcash/pasta_curves) instead of a pairing-based commitment, so the Orchard circuit needs no trusted setup. The older Sprout and Sapling pools use Groth16 with parameters from multi-party ceremonies.

Proofs are verified by every Zcash full node as part of its consensus and there currently is no verifying smart contract light node or trust-minimized bridge on Ethereum.

## Proof system

The [Orchard Action circuit](https://github.com/zcash/orchard/blob/main/src/circuit.rs) proves, for one spent note and one new note, that the spent note exists in the note commitment tree, that its nullifier is derived correctly, that the spender holds the spend authority, and that the value commitments balance. It is implemented with the [halo2_gadgets](https://github.com/zcash/halo2/tree/main/halo2_gadgets) library over 2^11 rows, using custom gates and lookup arguments for Sinsemilla hashes, Poseidon and elliptic curve arithmetic.

Following [ZIP 224](https://zips.z.cash/zip-0224), Orchard uses the Pasta curve cycle: Pallas is the application curve on which keys, commitments and RedPallas signatures are defined, and Vesta is the circuit curve whose scalar field (the base field of Pallas) is the native word type of the circuit. Polynomial commitments and the IPA opening proof are Vesta points. Verifying an IPA proof takes time linear in the circuit size. An Orchard transaction bundles all of its Actions into a single Halo 2 proof. The bundle also carries the RedPallas spend authorization and binding signatures.

## Verification

Nodes such as [zebra](https://github.com/ZcashFoundation/zebra) and zcashd derive the verifying key deterministically from the circuit description at startup, so unlike Sapling there are no proving or verifying parameters to download and trust. Because the circuit has changed twice, nodes keep [three verifying keys](https://github.com/ZcashFoundation/zebra/blob/main/zebra-consensus/src/primitives/halo2.rs) and select one by block height: the original NU5 circuit for historical blocks, the fixed circuit from NU6.2, and the NU6.3 circuit that additionally enforces the cross-address restriction.

## Circuit history

On 2026-05-29 a soundness bug was reported in the variable-base scalar multiplication gadget of halo2_gadgets: a [missing copy constraint](https://github.com/zcash/zcash/security/advisories/GHSA-ghc3-g8w4-whf9) left the multiplication base under-constrained, which would have allowed creating counterfeit ZEC inside the Orchard pool. Orchard was disabled by an emergency soft fork at Mainnet block 3363426 and re-enabled with the corrected circuit at the NU6.2 activation, block 3364600, as documented in [ZIP 257](https://zips.z.cash/zip-0257). The fix shipped in [halo2_gadgets 0.5.0](https://github.com/zcash/halo2/pull/888) and [orchard 0.14.0](https://github.com/zcash/orchard/pull/500).

[NU6.3](https://zips.z.cash/zip-0258) (Mainnet block 3428143, 2026-07-28) created the *Ironwood* pool, which uses the Orchard protocol with [quantum-recoverable notes](https://zips.z.cash/zip-2005), and restricted the legacy Orchard pool to same-address transfers so that value migrates to Ironwood. Both pools are proven with the same NU6.3 Action circuit and the same Halo 2 proving system.
