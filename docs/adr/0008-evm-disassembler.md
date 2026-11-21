# 8. EVM disassembler

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/utils/disasmEVM.ts`

The opcode table follows [evm.codes](https://www.evm.codes/).

DUPN, SWAPN and EXCHANGE (EIP-8024) take a one-byte immediate. JUMPDEST
analysis does not skip those immediates, so the EIP forbids a JUMPDEST or a
PUSH1–PUSH32 byte there (EXCHANGE's forbidden range starts lower, at `0x52`).
When the immediate is such a byte, the disassembler reads the opcode as
`INVALID_<name>` with no immediate and starts the next instruction at that
byte. That keeps the output aligned with JUMPDEST analysis. The test
"decodes a disallowed immediate as the next instruction" uses the EIP's test
vectors.
