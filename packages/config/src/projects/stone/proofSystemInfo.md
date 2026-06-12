## Description

Stone is a STARK proof system that is designed to prove the execution of programs written in [Cairo language](https://www.starknet.io/cairo-book/title-page.html) and compiled into Cairo assembly (cASM) byte code. This ISA is highly optimized for the performance of zkVM proving. Stone verifies STARK proofs directly onchain without any final SNARK wraps and thus requires no trusted setup. Stone targets 80 bits of security (e.g. see constructor params on [this contract](https://etherscan.io/address/0x3d57526c1C8D63fa2A8704487Df65e9000166c8E#code)).

## Proof system

Stone is a Cairo-based zkVM with AIR arithmetization over [felt252 field](https://docs.starknet.io/archive/cairo-101/felt/) and FRI-based commitment. The protocol makes use of recursive proof aggregation among many projects utilizing the CairoVM (i.e. Starknet forks and StarkEx systems) using SHARP. Some documentation on the aggregation scheme can be found [here](https://docs.starknet.io/architecture/sharp/) and the Cairo verifier implemented in Cairo can be found [here](https://github.com/starkware-libs/cairo-lang/tree/v0.13.1/src/starkware/cairo/cairo_verifier/layouts/all_cairo).

### StarkNet Operating System (SNOS)

The base layer of Stone proving is a Cairo program called [SNOS](https://docs.starknet.io/architecture/os/) that proves the correct STF from one state to another given the list of transactions. SNOS execution includes checking transaction inputs (e.g. state), executing transactions and processing state diffs. The source code of the Starknet OS can be found [here](https://github.com/starkware-libs/cairo-lang/tree/ee7ce74e1159a349d4b77a5f952241b50b1692de/src/starkware/starknet/core/os).

### Recursive aggregation

Proofs of SNOS executions of several consecutive blocks are recursively aggregated. The correctness of this aggregation is checked by [applicative bootloader](https://github.com/starkware-libs/cairo-lang/blob/8e11b8cc65ae1d0959328b1b4a40b92df8b58595/src/starkware/cairo/bootloaders/applicative_bootloader/applicative_bootloader.cairo#L15) program, which also verifies the correct relation of corresponding SNOS inputs and outputs. Applicative bootloader proofs are aggregated across several blockchains and proven by [SHARP](https://docs.starknet.io/architecture/sharp/#what_is_sharp). The SHARP STARK proof is verified onchain without any SNARK wraps.
