The verifier was regenerated on Linux. VK generation peaked at approximately 1.7 GiB of memory.

Prepare:

1. Install Nargo 1.0.0-beta.14, e.g. with `noirup -v 1.0.0-beta.14`. `nargo --version` should report noirc git version hash `60ccd48e18ad8ce50d5ecda9baf813b712145051`.
2. Install the Barretenberg CLI release `v3.0.0-nightly.20251030-2`, the version pinned to Nargo 1.0.0-beta.14 in the official [bb-versions.json](https://github.com/AztecProtocol/aztec-packages/blob/next/barretenberg/bbup/bb-versions.json) mapping, e.g. by downloading `barretenberg-amd64-linux.tar.gz` from the [aztec-packages release](https://github.com/AztecProtocol/aztec-packages/releases/tag/v3.0.0-nightly.20251030-2). Note that the Payy repository README refers to this bb version as `3.0.0-manual.20251030`, for which no release artifact exists.

Verify:

1. Clone [polybase/payy](https://github.com/polybase/payy), then check out commit `dcd5d96ee15664a59bc24ed0dc2bb78b73ac5e36`.
2. Compile the `agg_final` circuit from source:
   ```bash
   cd noir
   nargo compile --package agg_final
   ```
3. Generate the UltraHonk verification key with the keccak oracle hash from the newly compiled bytecode:
   ```bash
   mkdir -p /tmp/payy-repro
   bb write_vk --scheme ultra_honk --oracle_hash keccak \
     -b target/agg_final.json -o /tmp/payy-repro
   xxd -p -c 0 /tmp/payy-repro/vk_hash
   ```
   The final command should print `0f8581a994b714ef6fcffeaea9777e69e6bc7c0140a039a23afc764d8e863328`.