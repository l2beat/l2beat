#!/usr/bin/env python3
"""
Prints the pedersen, poseidon and blake program hashes of Cairo executable
JSONs (scarb `--executable` artifacts), as computed by the SHARP bootloader.
Run with PYTHONPATH pointing to cairo-lang/src.
"""
import json
import sys

from starkware.cairo.bootloaders.hash_program import (
    HashFunction,
    compute_program_hash_chain,
)
from starkware.cairo.lang.compiler.program import StrippedProgram

PRIME = 2**251 + 17 * 2**192 + 1

for path in sys.argv[1:]:
    document = json.load(open(path))
    (entrypoint,) = [
        e for e in document["entrypoints"] if e["kind"] == "Bootloader"
    ]
    program = StrippedProgram(
        prime=PRIME,
        data=[int(word, 16) % PRIME for word in document["program"]["bytecode"]],
        builtins=entrypoint["builtins"],
        main=entrypoint["offset"],
    )
    print(path)
    for hash_function in HashFunction:
        value = compute_program_hash_chain(
            program=program, program_hash_function=hash_function
        )
        print(f"  {hash_function.name.lower()}: {hex(value)}")
