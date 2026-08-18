These steps reproduce the 21 Stone Cairo verifier program hashes in `supported_program_hashes.json`: entries 1-7 (pedersen), 11-17 (poseidon) and 21-27 (blake) of `supported_cairo_verifier_program_hashes`, each group in the layout order `dex`, `recursive`, `small`, `starknet`, `starknet_with_keccak`, `dynamic`, `recursive_with_poseidon`.

The steps are supposed to be run on linux OS. They could also be run on macOS, but two tweaks need to be made: update from `lru-dict==1.1.8` to `lru-dict==1.3.0` in `scripts/requirements.txt` and make `python_interpreter` in `bazel_utils/python/stub.sh` point to the platform-specific interpreter (e.g. `python3_aarch64-apple-darwin/bin/python3`).

1. Install [bazel](https://bazel.build) version 7.4.1 and the `gmp` library:

```
brew install bazelisk
USE_BAZEL_VERSION=7.4.1 bazelisk version
brew install gmp  # or sudo apt-get install libgmp-dev
```

On linux, install JDK if you don't have it: `sudo apt install openjdk-21-jre`.

2. Check out cairo-lang v0.14.3:

```
git clone https://github.com/starkware-libs/cairo-lang.git
cd cairo-lang
git checkout cf9bf972bede402a125e8638bb258e77563ae933
```

3. The repo only declares a verifier build for the `all_cairo` layout. The verifier source is layout-independent except for two import lines, so add the remaining 7 layouts:

```
for L in dex recursive small starknet starknet_with_keccak dynamic recursive_with_poseidon; do
  D=src/starkware/cairo/cairo_verifier/layouts/$L
  mkdir -p $D
  sed "s/air\.layouts\.all_cairo/air.layouts.$L/" \
    src/starkware/cairo/cairo_verifier/layouts/all_cairo/cairo_verifier.cairo > $D/cairo_verifier.cairo
  printf 'package(default_visibility = ["//visibility:public"])\n\nexports_files(["cairo_verifier.cairo"])\n' > $D/BUILD
done
```

and append the same 7 layout names to the `CAIRO_LAYOUTS` list in `src/starkware/cairo/cairo_verifier/cairo_verifier_layouts.bzl`.

4. Build the 7 verifier programs and the hashing tool (roughly 70 seconds per layout):

```
USE_BAZEL_VERSION=7.4.1 bazelisk build \
  //src/starkware/cairo/bootloaders:cairo_hash_program_exe \
  //src/starkware/cairo/cairo_verifier:cairo_verifier_program_{dex,recursive,small,starknet,starknet_with_keccak,dynamic,recursive_with_poseidon}
```

5. Hash every layout with every hash function and compare the outputs with the `supported_cairo_verifier_program_hashes` entries listed above:

```
for L in dex recursive small starknet starknet_with_keccak dynamic recursive_with_poseidon; do
  for F in pedersen poseidon blake; do
    echo "$L $F" $(bazel-bin/src/starkware/cairo/bootloaders/cairo_hash_program_exe \
      --program bazel-bin/src/starkware/cairo/cairo_verifier/cairo_verifier_compiled_$L.json \
      --program-hash-function $F)
  done
done
```
