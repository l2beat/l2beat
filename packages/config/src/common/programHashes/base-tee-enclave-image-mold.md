Regeneration steps below require Linux OS, they will produce a different hash on MacOS.

Prepare:

1. Install docker <https://docs.docker.com/get-started/get-docker/>
2. Install `just` version `>=1.31.0`: <https://just.systems/man/en/pre-built-binaries.html>

Verify:

1. Checkout the correct tag in [base/base](https://github.com/base/base) repo: `git checkout {{version}}`. Commit hash should be `{{commitHash}}`.
2. In `etc/docker/Dockerfile.nitro-enclave` append ` -C link-arg=-fuse-ld=mold` to `CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_RUSTFLAGS` and add `mold=2.34.1-r1` to the `apk add` list. The unmodified Dockerfile links with the default linker and produces a different image.
3. Make sure docker is running: `docker ps`.
4. From the repo root: `just tee build-eif` to build the TEE image in a docker container.
5. Extract `PCR0` from the build EIF: `just tee describe-eif`
6. Compute image hash as keccak256 of the PCR0: `cast keccak "0x<PCR0_hex>"`, where `PCR0_hex` is taken from the output of the previous step.
