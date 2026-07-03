Prepare:

1. Install cargo make: `cargo install --debug --locked cargo-make`
2. Install sp1 toolchain: `curl -L https://sp1up.succinct.xyz/ | bash`, then `sp1up`.
3. Install docker <https://docs.docker.com/get-started/get-docker/>
4. Install `lld` (required by the repo's `.cargo/config.toml`)

Verify:

1. Checkout the correct tag in [base/base](https://github.com/base/base) repo: `git checkout {{version}}`. Commit hash should be `{{commitHash}}`.
2. Make sure docker is running: `docker ps`.
3. From the repo root: `just succinct build-elfs` to build the range and aggregation SP1 ELFs (reproducible `cargo prove build --docker --tag v6.2.3`). Built elfs are placed in `crates/proof/succinct/elf/`.
4. From the repo root: `just succinct write-manifest` to sync `crates/proof/succinct/elf/manifest.toml` to the freshly built ELFs.
5. From the repo root: `just succinct vkeys` to print the range and aggregation verification key hashes. 