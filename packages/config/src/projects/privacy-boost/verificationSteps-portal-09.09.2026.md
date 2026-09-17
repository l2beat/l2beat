The portal deposit verifier stores verification keys for 2 different batched portal deposit circuits across 2 registered batch sizes (`p1`, `p6`). The steps below reproduce both verification keys from circuit sources and trusted setup files. They require about 24 GiB RAM with two parallel workers and ~35 GiB disk space.

Helper scripts implementing all of the reproduction steps are in the
[script archive](https://trusted-setup-hosting.l2beat.com/privacy/privacy-boost/privacy_boost_vk_digest_v2.zip).

1. Download the second production ceremony public bundle (about 9.8 GB, gzip-compressed despite the
   `.tar` name) and extract it. The archive used for this attestation hashes to
   `91ad38d7775259116d00e5288630aaec565fbec8ff38a76dc874c13412ae530a`. 

   ```
   curl -LO https://file.ceremony.privacyboost.io/prod-20260902-public.tar
   shasum -a 256 prod-20260902-public.tar
   tar xzf prod-20260902-public.tar
   ```

2. Check that the ceremony's circuit matrix in `public/config.snapshot.json` matches the circuit
   shapes registered on the verifier, and that the manifest's `circuitSpecJson` for each circuit
   agrees with them and with `circuit-setup/configs/production.ceremony.config.json` in
   [privacy-boost-ceremony](https://github.com/sunnyside-io/privacy-boost-ceremony) at commit `e645b68d`.

3. Re-derive every key from the transcript. The circuits are the `frontend/` package of
   [privacy-boost-protocol](https://github.com/sunnyside-io/privacy-boost-protocol) at commit
   `9e3f34e1a91c`. Note that the ceremony
   coordinator compiled them with **gnark v0.15.0 and gnark-crypto v0.20.1**, as recorded in the
   build information embedded in the signed `ceremony/v0.0.x` release binaries. 
   
   The public ceremony
   repository pins gnark v0.14.0 instead, which compiles to different constraint systems, so its
   `verify-public` command fails at the R1CS hash check. The script archive contains a per-circuit
   helper built against gnark v0.15.0 that recompiles each circuit's R1CS from its spec, checks it
   against the manifest, fetches and digest-checks the pinned Perpetual Powers of Tau artifact for
   the required power, recomputes the origin of the phase 2 transcript, verifies every contribution
   against its predecessor, and seals the proving and verifying keys, comparing them to the manifest
   commitments. Reading the transcript lazily keeps the peak below 10 GB per circuit.

   ```
   python3 run.py prepare
   python3 onchain.py
   python3 run.py run --jobs 2
   ```

4. For each circuit, encode the re-derived `.vk` into the onchain layout (negate `beta`, `gamma`,
   `delta`; interleave `G1.K`) and confirm its digest equals the value read from chain. The helper
   reads all registered keys at one finalized OP Mainnet block, recomputing the storage slots from
   the circuit parameters and cross-checking them against the getters.
