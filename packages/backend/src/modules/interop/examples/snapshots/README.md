# Snapshot Testing

This directory contains sealed snapshots for interop examples.

## Files

- `manifest.json` - Tracks which examples have been sealed and their definition hashes
- `*-inputs.json.gz` - Captured RPC inputs (compressed)
- `*-outputs.json.gz` - Expected outputs (compressed)

## Manifest Format

```json
{
  "version": 1,
  "examples": {
    "example-name": {
      "definitionHash": "sha256-hash-of-definition",
      "sealedAt": "2026-01-20T12:34:56.789Z"
    }
  }
}
```

## How It Works

1. **Sealing** (`--seal` flag): Runs example against live RPC, captures inputs/outputs, computes definition hash
2. **Testing**: Replays captured inputs, validates outputs match, validates definition hasn't changed
3. **Hash Validation**: Detects when `examples.jsonc` is modified without re-sealing

## Usage

```bash
# Seal a single example
pnpm interop:example allbridge --seal

# Seal all examples
pnpm interop:example all --seal

# Run tests (validates hashes and outputs)
pnpm test
```

## When to Re-seal

You must re-seal when:
- Adding a new example to `examples.jsonc`
- Modifying an existing example definition (txs, events, messages, transfers)
- Hash validation test fails

You don't need to re-seal when:
- Modifying plugin code (unless it changes expected outputs)
- Updating comments in `examples.jsonc`
