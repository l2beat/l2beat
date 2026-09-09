The epoch verifier stores verification keys for 14 different batched private transfer and withdrawal circuits with varying `(maxTransfers, maxInputsPerTransfer, maxOutputsPerTransfer)` (`s1`, `s4`, `s8`, `s16`, `s32`, `s64`, `s100`, `m1`, `m4`, `m8`, `l1`, `l4`, `l8`, `sp1`). The steps below reproduce all 14 verification keys from circuit sources and trusted setup files. They require 36-64 GiB RAM and ~90 GiB disk space.

Helper scripts implementing all of the reproduction steps are in the
[script archive](https://trusted-setup-hosting.l2beat.com/privacy/privacy-boost/privacy_boost_vk_digest.zip).

1. Download the V1 production ceremony public bundle (about 33 GB) and extract it. The archive
   used for this attestation hashes to
   `3b6a9bfc4e88c135aa34fecce30a6073cc96be50d9baac6dd75a0bbf03078c4c`.

   ```
   curl -LO https://file.ceremony.privacyboost.io/prod-20260401-public.tar.gz
   shasum -a 256 prod-20260401-public.tar.gz
   tar xzf prod-20260401-public.tar.gz
   ```

2. Check that the ceremony's circuit matrix in `public/config.snapshot.json` matches the circuit
   shapes registered on the verifier, and that the manifest's `circuitSpecJson` for each circuit
   agrees with them.

3. Re-derive every key from the transcript. Clone
   [privacy-boost-ceremony](https://github.com/sunnyside-io/privacy-boost-ceremony) at tag `v0.1.9`. Then run:

   ```
   CGO_ENABLED=0 go build -o ./bin/ceremony ./cmd/ceremony
   ./bin/ceremony verify-public --bundle-dir <BUNDLE_DIR>
   ```

   This recomputes every artifact digest, the bundle root and the transcript adjacency chain, then
   recompiles each circuit's R1CS from its spec, fetches the pinned Perpetual Powers of Tau artifact
   for the required power, and re-derives the proving and verifying keys from the ordered phase 2
   outputs, comparing them to the manifest commitments.

   On a smaller machine the same derivation can be done circuit by circuit, which brings the peak down to
   roughly 10 GB at the cost of running the circuits one at a time
   rather than in one pass. The script archive includes a helper that does this.

4. For each circuit, encode the re-derived `public/circuits/<id>/keys/<id>.vk` into the onchain layout (negate `beta`, `gamma`, `delta`; interleave `G1.K`) and confirm its digest equals the value read from chain.
