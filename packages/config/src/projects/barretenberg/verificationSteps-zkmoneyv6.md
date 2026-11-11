Three refund circuits serve both zk.money v6 portals, DAI and sUSDS, through one verifier each. The Noir circuits compile in under a minute on a standard Linux machine.

Prepare:

1. Install the Aztec `6.0.0` toolchain with `aztec-up install 6.0.0`. It provides `aztec-nargo` (Noir `1.0.0-rc.3`) and `aztec-bb` (`6.0.0`).
2. Install `git` and `xxd`.

Verify:

1. Clone [aztec-labs-eng/zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out commit `8fd198412a956f214639b5782d3a86e3d47ca60e`.
2. Compile each circuit, write its verification key for EVM verification and print the key hash. `aztec-nargo` fetches the pinned `aztec-nr` dependencies on the first run.
   ```bash
   cd vendor/oxide/noir-projects
   for c in frozen_notes_refund frozen_deposits_refund unprocessed_deposit_refund; do
     (cd $c \
       && aztec-nargo compile --silence-warnings --package $c \
       && aztec-bb write_vk -t evm -b target/$c.json -o target/keys \
       && echo "$c $(xxd -p -c 0 target/keys/vk_hash)")
   done
   ```
   The printed hashes should be:
   - `frozen_notes_refund`: `2249c28908d7fb322c39421e6c030c96dddbd364163e5b41f378a21953a58135`
   - `frozen_deposits_refund`: `2710bacfccd5568bb732fc67370c3ce2ac817002ea02a099baa47ea42586544f`
   - `unprocessed_deposit_refund`: `1597ef3e1caf60ec4a7d845d676b580e64933bce926ff8cef4f1a80ac000ccec`
3. Regenerate each Solidity verifier and compare it with the verifier committed in the repository. The refund verifiers are generated without the zero-knowledge option:
   ```bash
   for v in frozen_notes_refund:FrozenNotesRefundVerifier \
            frozen_deposits_refund:FrozenDepositsRefundVerifier \
            unprocessed_deposit_refund:UnprocessedDepositRefundVerifier; do
     IFS=: read -r c name <<<"$v"
     aztec-bb write_solidity_verifier -t evm --optimized \
       -k $c/target/keys/vk -o $c/target/verifier.sol
     cmp $c/target/verifier.sol ../l1-contracts/src/generated/$name.sol && echo "$c matches"
   done
   ```
   Each circuit should print `matches`.
4. Compare each regenerated verifier's **full executable source** with the deployed, verified source, including `loadVerificationKey`, the proof decoder, transcript, relations and pairing checks. A matching `VK_HASH` constant alone does not establish that the contract uses that key or verifies proofs correctly. These verifiers link no libraries.

   | Circuit | Ethereum verifier |
   | --- | --- |
   | Frozen notes | [0x880F…5377](https://etherscan.io/address/0x880F3C8356A930522896A7c539157D4c87F95377#code) |
   | Frozen deposits | [0xa460…C6A3](https://etherscan.io/address/0xa460C3130D1701a94f76d1122362C0D127f1C6A3#code) |
   | Unprocessed deposit | [0xF157…8c8a](https://etherscan.io/address/0xF15780eB45c49a7cB4FB0BF178D3DaF0F1D68c8a#code) |
