import argparse
from enum import Enum
import os
from typing import List

from starkware.cairo.common.hash_chain import compute_hash_chain
from starkware.cairo.lang.compiler.program import Program, ProgramBase
from starkware.cairo.lang.version import __version__
from starkware.cairo.lang.vm.crypto import get_crypto_lib_context_manager, poseidon_hash_many
from starkware.cairo.common.hash_state import compute_hash_on_elements
from starkware.python.utils import from_bytes


APPLICATIVE_BOOTLOADER_COMPILED_PATH = os.path.join(
    os.path.dirname(__file__), "applicative_bootloader", "applicative_bootloader_compiled.json"
)
SIMPLE_BOOTLOADER_COMPILED_PATH = os.path.join(
    os.path.dirname(__file__), "simple_bootloader", "simple_bootloader_compiled.json"
)

def get_simple_bootloader_program() -> str:
    with open(SIMPLE_BOOTLOADER_COMPILED_PATH, "r") as file:
        return Program.Schema().loads(file.read())

def get_applicative_bootloader_program() -> Program:
    with open(APPLICATIVE_BOOTLOADER_COMPILED_PATH, "r") as file:
        return Program.Schema().loads(file.read())

class HashFunction(Enum):
    """
    A hash function. These can be used e.g. for hashing a program within the bootloader.
    """

    PEDERSEN = 0
    POSEIDON = 1


def compute_program_hash_chain(
    program: ProgramBase,
    program_hash_function: HashFunction,
    bootloader_version=0,
):
    """
    Computes a hash chain over a program, including the length of the data chain.
    If `encode_blake2s_input` is True, the data chain is encoded according to the specification
    documented inside the `calculate_blake2s_hash_from_felt252s` function.
    If `little_endian_for_blake2s` is True, the blake input is encoded in little-endian u32s.
    """
    builtin_list = [from_bytes(builtin.encode("ascii")) for builtin in program.builtins]
    # The program header below is missing the data length, which is later added to the data_chain.
    program_header = [bootloader_version, program.main, len(program.builtins)] + builtin_list
    data_chain = program_header + program.data

    if program_hash_function == HashFunction.POSEIDON:
        return poseidon_hash_many(data_chain)
    elif program_hash_function == HashFunction.PEDERSEN:
        return compute_hash_chain([len(data_chain)] + data_chain)


def get_pedersen_program_hash(program: Program) -> int:
    return compute_program_hash_chain(program=program, program_hash_function=HashFunction.PEDERSEN)


def calculate_supported_simple_bootloader_hash_list() -> int:
    simple_bootloader_program: Program = get_simple_bootloader_program()
    return poseidon_hash_many(array=simple_bootloader_program.data)

def main():
    parser = argparse.ArgumentParser(description="A tool to compute the hash of a the bootloaders cairo program")
    parser.add_argument("-v", "--version", action="version", version=f"%(prog)s {__version__}")
    parser.add_argument(
        "--flavor",
        type=str,
        default="Release",
        choices=["Debug", "Release", "RelWithDebInfo"],
        help="Build flavor",
    )

    args = parser.parse_args()

    with get_crypto_lib_context_manager(args.flavor):
        supported_simple_bootloader_hash_list= calculate_supported_simple_bootloader_hash_list()
        print("supported_simple_bootloader_hash:", supported_simple_bootloader_hash_list)

        applicative_bootloader_program = get_applicative_bootloader_program()
        applicative_bootloader_program_hash = get_pedersen_program_hash(program=applicative_bootloader_program)
        print("applicative_bootloader_program_hash:", applicative_bootloader_program_hash)


if __name__ == "__main__":
    main()
