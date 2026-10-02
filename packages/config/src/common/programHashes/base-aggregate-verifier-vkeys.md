Prepare:

1. Install `just`: <https://just.systems/man/en/pre-built-binaries.html>
2. Install sp1 toolchain: `curl -L https://sp1up.succinct.xyz/ | bash`, then `sp1up`.
3. Install docker <https://docs.docker.com/get-started/get-docker/>

Verify:

1. Checkout the correct tag in [base/base](https://github.com/base/base) repo: `git checkout {{version}}`. Commit hash should be `{{commitHash}}`.
2. Make sure docker is running: `docker ps`.
3. From the repo root: `just succinct vkeys --build` to build the range and aggregation SP1 ELFs (reproducible docker build, SP1 toolchain tag `v6.4.0` pinned in `etc/just/succinct.just`) and print their verification key hashes.
