Starknet utilizes the STARK protocol for their system using an AIR for the CairoVM and onchain FRI verification. The scheme makes use of the STARK field.

The protocol makes use of recursive proof aggregation among many projects utilizing the CairoVM (i.e. Starknet forks and StarkEx systems) using SHARP. Some documentation on the aggregation scheme can be found [here](https://book.starknet.io/ch03-03-provers.html) and the Cairo verifier implemented in Cairo can be found [here](https://github.com/starkware-libs/cairo-lang/tree/v0.13.1/src/starkware/cairo/cairo_verifier/layouts/all_cairo). The system doesn’t implement state diffs compression yet.

The final proof is not wrapped in a different proof system. The scheme is fully transparent and doesn’t require a trusted setup.

The source code of the Starknet OS can be found [here](https://github.com/starkware-libs/cairo-lang/tree/ee7ce74e1159a349d4b77a5f952241b50b1692de/src/starkware/starknet/core/os). The source code of the bootloader can be found [here](https://github.com/starkware-libs/cairo-lang/blob/efa9648f57568aad8f8a13fbf027d2de7c63c2c0/src/starkware/cairo/bootloaders/bootloader/bootloader.cairo#L4).
