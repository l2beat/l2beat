STRK-20 is a Starknet privacy pool deployed at [`0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a`](https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a). It uses a UTXO-style note model: users deposit ERC20 tokens into the pool, create encrypted notes, spend notes by publishing nullifiers, and withdraw to public Starknet addresses.

Private actions are compiled into public server actions. These actions are applied only when Starknet proof facts show that a matching virtual Starknet execution emitted the expected message. The message commits to the pool contract address, the current class hash, and the serialized server actions.

Recipients discover notes through directional channels and token-specific subchannels. This avoids scanning all pool activity, but the recipient address is visible when channel metadata is written. Normal notes encrypt amounts, while public deposits, public withdrawals, and open-note fills reveal token and amount by design.

The protocol supports private transfers, arbitrary amounts, partial withdrawals through private change notes, and DeFi actions through external helper contracts. DeFi integrations use open notes: the pool creates a note whose final amount is filled after an external helper, such as a swap or lending adapter, measures the onchain output.

The compliance model relies on an auditor public key. Users register an encrypted private viewing key, and withdrawals or open notes include auditor-encrypted metadata. Whoever controls the auditor private key can decrypt traced user metadata offchain; this does not grant spending authority, but it does remove privacy from the auditor.

The pool contract source was reviewed for this entry, but the TypeScript SDK and proving stack are not open source yet. Because the prover is currently closed, users cannot independently audit the software that produces proofs from source.

L2BEAT currently lists STRK-20 as a researched privacy project only. Starknet contracts, permissions, TVS, and privacy flow events are not tracked by this configuration, so the tracked assets, pools, flows, and TVL counters are expected to remain empty until Starknet support is added.
