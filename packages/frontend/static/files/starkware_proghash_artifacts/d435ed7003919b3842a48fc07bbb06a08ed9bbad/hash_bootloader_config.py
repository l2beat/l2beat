#!/usr/bin/env python3
"""
Recomputes the SHARP bootloader config hash of cairo-lang v0.14.4a0 from compiled programs
and the files committed next to the bootloader, and compares every part with the committed
values.

Usage: PYTHONPATH=<cairo-lang>/src python hash_bootloader_config.py <cairo-lang>/src <dir>
<dir> holds simple_bootloader_compiled.json, no_builtin_simulation_simple_bootloader_compiled.json
and circuit_applicative_bootloader_compiled.json, compiled in proof mode.
"""
import json
import sys

from starkware.cairo.bootloaders.circuit_applicative_bootloader import config_commitment
from starkware.cairo.bootloaders.hash_program import HashFunction, compute_program_hash_chain
from starkware.cairo.bootloaders.supported_bootloaders_hash import combine_bootloader_config_hash
from starkware.cairo.common.cairo_blake2s.blake2s_utils import calculate_blake2s_hash_from_felt252s
from starkware.cairo.common.hash_state import compute_hash_on_elements
from starkware.cairo.lang.compiler.program import Program
from starkware.cairo.lang.vm.crypto import poseidon_hash_many

src, out = sys.argv[1], sys.argv[2]
bootloaders = src + "/starkware/cairo/bootloaders"
published = json.load(open(bootloaders + "/bootloader/supported_program_hashes.json"))
config = json.load(open(bootloaders + "/bootloader/bootloader_config_hash.json"))


def load(name):
    return Program.load(json.load(open(f"{out}/{name}_compiled.json")))


def blake(program):
    return calculate_blake2s_hash_from_felt252s(
        data=program.data, encode=True, prime=program.prime, little_endian=False
    )


def check(label, value, expected):
    print(label, hex(value), "MATCH" if value == int(expected, 16) else "MISMATCH")


simple = load("simple_bootloader")
no_builtin = load("no_builtin_simulation_simple_bootloader")
simple_hashes = [
    poseidon_hash_many(array=simple.data),
    blake(simple),
    poseidon_hash_many(array=no_builtin.data),
    blake(no_builtin),
]
for value, expected in zip(simple_hashes, published["supported_simple_bootloader_hash_list"]):
    check("simple bootloader hash", value, expected)
simple_list_hash = compute_hash_on_elements(data=simple_hashes)
check(
    "simple bootloader list hash",
    simple_list_hash,
    config["supported_simple_bootloader_hash_list_hash"],
)

circuit_applicative_hash = compute_program_hash_chain(
    program=load("circuit_applicative_bootloader"), program_hash_function=HashFunction.BLAKE
)
check(
    "circuit applicative bootloader program hash",
    circuit_applicative_hash,
    published["circuit_applicative_bootloader_program_hash"],
)

# From circuit_verifier_program_hash.json and production_circuit_registry.json.
config_commitment_value = config_commitment.compute_committed_circuit_applicative_config_commitment()
check(
    "circuit applicative config commitment",
    config_commitment_value,
    published["circuit_applicative_config_commitment"],
)

verifier_list_hash = compute_hash_on_elements(
    data=[int(h, 16) for h in published["supported_cairo_verifier_program_hashes"]]
)
check(
    "cairo verifier list hash",
    verifier_list_hash,
    config["supported_cairo_verifier_hash_list_hash"],
)

# The value that the SHARP verifier 0x91C57B64738b80f4494d83b485AD3f9C0f95E2A3 returns from
# getBootloaderConfigHash().
ONCHAIN_CONFIG_HASH = 2806880238119746810536368140979050442273882135835972263431721318985365898844
config_hash = combine_bootloader_config_hash(
    simple_list_hash, circuit_applicative_hash, config_commitment_value, verifier_list_hash
)
print(
    "bootloader config hash",
    config_hash,
    "MATCH" if config_hash == ONCHAIN_CONFIG_HASH else "MISMATCH",
)
