# 4. Address parsing

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/types/EthereumAddress.ts`,
`packages/shared-pure/src/types/ChainSpecificAddress.ts`

## Chain-specific addresses follow ERC-3770

A `ChainSpecificAddress` is `shortName:address`, as in
[ERC-3770](https://eips.ethereum.org/EIPS/eip-3770). The address must pass the
ERC-55 checksum. The short name must be one of `SHORT_TO_LONG_CHAIN_NAMES`, a
list kept by hand. ERC-3770 asks for names from
[ethereum-lists/chains](https://github.com/ethereum-lists/chains); nothing
checks ours against it.

## `tryParse` returns `undefined` instead of throwing

Some callers ask "is this an address?" about values that usually are not one.
Throwing that answer would make the common path pay for a stack capture, so
`tryParse` returns `undefined` and only the constructors throw.

`ChainSpecificAddress.tryParse` checks the chain name before the address,
because a set lookup is far cheaper than the ERC-55 checksum and those callers
reject non-addresses in bulk.
