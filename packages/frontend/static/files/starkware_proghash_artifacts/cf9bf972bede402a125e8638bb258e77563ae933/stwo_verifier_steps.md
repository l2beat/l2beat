These steps reproduce the 9 Stwo Cairo verifier program hashes in `supported_program_hashes.json`: entries 8-10 (pedersen), 18-20 (poseidon) and 28-30 (blake) of `supported_cairo_verifier_program_hashes`, each group in the build order listed in step 3.

1. Install [scarb](https://docs.swmansion.com/scarb/) 2.18.0 (cairo 2.18.0, sierra 1.8.0); the repo pins this version in `.tool-versions`.

2. Check out stwo-cairo at tag `sharp-7.4.RC3`:

```
git clone https://github.com/starkware-libs/stwo-cairo.git
cd stwo-cairo
git checkout sharp-7.4.RC3  # commit 9b93cc39c87838cee3132ee1f8237590700f0689
```

Apply the `stwo_features.patch` file (fetch it from the top-level verification steps), which forwards the `qm31_opcode` feature flag to the `stwo_constraint_framework` crate: `git apply stwo_features.patch`.

3. Build the three verifier flavors. Every build writes the same output file, so copy each artifact aside:

```
cd stwo_cairo_verifier
for FEATURES in poseidon252_verifier,poseidon_outputs_packing qm31_opcode,poseidon_outputs_packing qm31_opcode,blake_outputs_packing; do
  scarb --profile proving build --package stwo_cairo_verifier --features $FEATURES
  cp target/proving/stwo_cairo_verifier.executable.json stwo_cairo_verifier.$FEATURES.executable.json
done
```

4. Hash each executable with the `hash_stwo_verifiers.py` script (fetch it from the top-level verification steps). It needs the cairo-lang checkout from the Stone verifier steps and a python 3.9 environment with cairo-lang's `scripts/requirements.txt` installed:

```
PYTHONPATH=<path to cairo-lang>/src python hash_stwo_verifiers.py \
  stwo_cairo_verifier.poseidon252_verifier,poseidon_outputs_packing.executable.json \
  stwo_cairo_verifier.qm31_opcode,poseidon_outputs_packing.executable.json \
  stwo_cairo_verifier.qm31_opcode,blake_outputs_packing.executable.json
```

The script prints the pedersen, poseidon and blake program hash for each artifact; compare them with the `supported_cairo_verifier_program_hashes` entries listed above.
