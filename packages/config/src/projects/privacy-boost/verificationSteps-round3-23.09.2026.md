The epoch, forced withdrawal and gift claim verifiers store the 12 verification keys of the third production ceremony: epoch shapes `s1`, `s5`, `m1`, `m4`, `l1`, `l3`, `sp1`, `w51` and `w201`, forced withdrawal `f13` and gift claims `g1` and `g3`. The steps below re-derive all 12 keys from the circuit sources and the ceremony transcript and match them to the keys the verifiers read. The re-derivation takes about 2 hours, stays under 6 GiB of RAM and needs about 10 GB of disk.

A [helper script](/files/privacy_boost_artifacts/ceremony-r3.sh) runs all four steps, with the
untrusted builds in Docker: `ceremony-r3.sh <workdir> all`, with `BASE_RPC_URL` set to a Base endpoint.

1. Download the public bundle and the keys, and check their digests against the
   [round record](https://github.com/sunnyside-io/privacy-boost-ceremony/blob/e1e5a01d9bc4ce5b0917d6302aa4d294b6539894/rounds/2026-03.md):
   `d584146c…` for the bundle, `3dfe30e5…` for the keys and `626faf00…` for `public/manifest.json`.

   ```
   curl -LO https://file.ceremony.privacyboost.io/prod-20260923-public.tar.gz
   curl -LO https://file.ceremony.privacyboost.io/prod-20260923-keys.tar.gz
   shasum -a 256 prod-20260923-public.tar.gz prod-20260923-keys.tar.gz
   tar xzf prod-20260923-public.tar.gz
   tar xzf prod-20260923-keys.tar.gz
   shasum -a 256 public/manifest.json
   ```

2. Build the verifier from [privacy-boost-ceremony](https://github.com/sunnyside-io/privacy-boost-ceremony)
   at commit `e1e5a01d`. It compiles the `frontend/` circuits of
   [privacy-boost-protocol](https://github.com/sunnyside-io/privacy-boost-protocol) at `f8a866ce`
   with gnark v0.16.3 and gnark-crypto v0.21.0, the versions embedded in the signed
   `ceremony/v0.0.5` release binaries. The protocol commit linked above, `5792c139`, differs from
   `f8a866ce` only in tests and a Solidity constants file.

   ```
   git clone https://github.com/sunnyside-io/privacy-boost-ceremony
   cd privacy-boost-ceremony
   git checkout e1e5a01d9bc4ce5b0917d6302aa4d294b6539894
   go build -o ./bin/ceremony ./cmd/ceremony
   ```

3. Run the public verification. It checks the bundle root and each contribution chain, recompiles
   every circuit and matches its R1CS hash, fetches the Perpetual Powers of Tau `pot28_0080` file
   for the circuit's power and checks its hash, verifies the 16 contributions in order from a freshly
   computed origin, and matches the re-derived proving and verifying keys with the manifest.

   ```
   ./bin/ceremony verify-public --bundle-dir public
   ```

4. Check that each `keys/<id>.vk` hashes to the manifest's `vkSha256` and compare it with the chain.
   The verifier reads 448 bytes of constants (alpha, then the negated beta, gamma and delta, each G2
   point as x1, x0, y1, y0) and the x and y coordinates of the IC points from SSTORE2 contracts.
   `getEpochVKInfo(maxTransfers, maxInputsPerTransfer, maxOutputsPerTransfer)` on the epoch verifier
   and `getVKInfo(param)` on the forced withdrawal (`13`) and gift claim (`1`, `3`) verifiers return
   the IC length and the constants contract. The IC contracts sit in the key registry at storage
   slot 5 for the epoch verifier, keyed by the three parameters, and at slot 2 for the other two.
