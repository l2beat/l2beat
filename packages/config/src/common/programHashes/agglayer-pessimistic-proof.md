Prepare:

1. Install cargo make: `cargo install --debug --locked cargo-make`
2. Install sp1 toolchain: `curl -L https://sp1up.succinct.xyz/ | bash`, then `sp1up`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct tag in [agglayer repo](https://github.com/agglayer/agglayer/tree/main): `git checkout {{version}}`. Commit hash should be `{{commitHash}}`.
2. Make sure docker is running by running `docker ps`.
3. From the root dir: `cargo make pp-elf` to generate pessimistic program elf from sources.
4. From the pessimistic-proof/elf dir: `cargo prove vkey --elf {{elfTarget}}` to check the verification key of this elf.
