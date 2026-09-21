/**
 * JSON Schema for a plan, version 1.
 *
 * This object is shown to the model verbatim in the authoring prompt, so it
 * is a plain JSON value, every object closes with `additionalProperties:
 * false` and lists its mandatory properties in `required`, and the
 * `description`s are the model's documentation for each field. Recipe `args`
 * stay an open object because each recipe carries its own argument schema,
 * which the validator applies separately. That open object is also why the
 * schema cannot be passed as Codex `--output-schema`: OpenAI's strict
 * structured output requires every object to be closed with every property
 * required (see `author/codex/CodexClient.ts`).
 *
 * The same object is what `validatePlan` checks a plan against, through the
 * milestone 1 `validateSchema`, so there is exactly one definition of a
 * well-formed plan.
 */
import type { Schema } from '../library/validateSchema'
import { SKIP_REASONS, STORAGE_TYPES } from './Plan'

const IDENTIFIER_PATTERN = '^[A-Za-z_$][A-Za-z0-9_$]*$'
const REFERENCE_PATTERN =
  '^(\\$self|\\$baseline\\.[A-Za-z_$][A-Za-z0-9_$]*|\\$step\\.[A-Za-z_$][A-Za-z0-9_$]*)$'
const ADDRESS_OR_REFERENCE_PATTERN =
  '^(0x[0-9a-fA-F]{40}|[a-z0-9-]+:0x[0-9a-fA-F]{40}|\\$self|\\$baseline\\.[A-Za-z_$][A-Za-z0-9_$]*|\\$step\\.[A-Za-z_$][A-Za-z0-9_$]*)$'

const reference: Schema = {
  type: 'string',
  pattern: REFERENCE_PATTERN,
  description:
    "A reference: `$baseline.<field>` (a 0-arg getter value), `$step.<id>` (a prior step's shaped output) or `$self` (this contract's address).",
}

const at: Schema = {
  type: 'string',
  pattern: ADDRESS_OR_REFERENCE_PATTERN,
  description:
    'Contract to read instead of this one: a literal address or a reference that resolves to an address (typically `$baseline.<getter>`). Omit to read this contract.',
}

const method: Schema = {
  type: 'string',
  description:
    'The function to call, as its `name(types)` signature from the worklist (e.g. `committeeThresholds(uint8,uint256)`) or a full human-readable fragment (`function owner() view returns (address)`). A full fragment is required when `at` points to a contract whose ABI is not this one.',
}

const anyJson: Schema = { description: 'Any JSON value.' }

const callFetch: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'method'],
  properties: {
    kind: { const: 'call', description: 'One call, one decoded return value.' },
    method,
    args: {
      type: 'array',
      items: {
        description:
          'A literal typed like the ABI input (addresses as hex strings, integers as numbers or decimal strings, booleans, bytes as hex) or a reference.',
      },
      description:
        'Call arguments in ABI order; omit for a 0-arg function. Prefer `$baseline` over 0-arg calls on this contract, which are already in the baseline.',
    },
    at,
  },
}

const keys: Schema = {
  description:
    'Where the argument values come from. Exactly one of `literal`, `from`, `range`, `untilRevert`.',
  anyOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: ['literal'],
      properties: {
        literal: {
          type: 'array',
          minItems: 1,
          items: {
            description:
              'One key: a scalar for a 1-input method, or an array with one element per input for a multi-input method (e.g. `[1, 0]` for `(uint8,uint256)`).',
          },
          description:
            'Keys known from the source, e.g. enum values or constants the contract writes.',
        },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['from'],
      properties: {
        from: {
          ...reference,
          description:
            'A reference whose value is an array of keys (or an object whose keys are used), e.g. `$step.validators` produced by a `set@1` step.',
        },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['range'],
      properties: {
        range: {
          type: 'object',
          additionalProperties: false,
          required: ['length'],
          properties: {
            length: {
              type: ['integer', 'string'],
              description:
                'Number of indices, as a non-negative integer or a reference to a numeric value such as `$baseline.validatorCount`.',
            },
            start: {
              type: 'integer',
              minimum: 0,
              description: 'First index, default 0.',
            },
          },
          description:
            'Indices `start .. start + length - 1`, for arrays with a length getter.',
        },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['untilRevert'],
      properties: {
        untilRevert: {
          type: 'object',
          additionalProperties: false,
          required: ['max'],
          properties: {
            max: {
              type: 'integer',
              minimum: 1,
              description:
                'Upper bound on indices tried. Reaching it without a revert keeps the values and records an error.',
            },
          },
          description:
            'Indices from 0 until the first revert, for arrays without a length getter.',
        },
      },
    },
  ],
}

const callEachFetch: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'method', 'keys'],
  properties: {
    kind: {
      const: 'callEach',
      description:
        'The same method called once per key; the recipe receives `[{ key, value }]` in key order.',
    },
    method,
    keys,
    at,
  },
}

const logsFetch: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'events'],
  properties: {
    kind: {
      const: 'logs',
      description:
        'Every log of the listed events emitted by this contract from block 0 to the target block, decoded, in chain order.',
    },
    events: {
      type: 'array',
      minItems: 1,
      items: { type: 'string' },
      description:
        'Event names from the ABI (e.g. `RoleGranted`). The recipe receives `[{ event, blockNumber, logIndex, args }]`.',
    },
  },
}

const storageFetch: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'slot', 'as'],
  properties: {
    kind: {
      const: 'storage',
      description: 'One raw storage slot, for state without a getter.',
    },
    slot: {
      type: ['integer', 'string'],
      description:
        'Slot number as a non-negative integer, or as a decimal or `0x` hex string for slots above 2^53 (e.g. EIP-1967 slots).',
    },
    as: {
      enum: [...STORAGE_TYPES],
      description: 'How to decode the 32 bytes.',
    },
    at,
  },
}

const constructorArgsFetch: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind'],
  properties: {
    kind: {
      const: 'constructorArgs',
      description:
        'The decoded constructor arguments of this contract, as an array in declaration order. Use the step id `constructorArgs`.',
    },
  },
}

const hardcodedFetch: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'value'],
  properties: {
    kind: {
      const: 'hardcoded',
      description:
        'A value that is fixed in the source (a constant, an immutable known from the bytecode) and has no getter.',
    },
    value: anyJson,
  },
}

const step: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'fetch', 'reason'],
  properties: {
    id: {
      type: 'string',
      pattern: IDENTIFIER_PATTERN,
      description:
        'Field name in the output. Must be the Solidity identifier the value comes from (the getter, mapping or array name), or the fixed name `accessControl` / `constructorArgs`. Must not repeat a baseline field name.',
    },
    covers: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Worklist item signatures this step answers, e.g. `["validators(address)"]`. Every worklist item must appear in exactly one `covers` or `skips` entry.',
    },
    fetch: {
      description: 'How to read the raw data; one of six kinds.',
      anyOf: [
        callFetch,
        callEachFetch,
        logsFetch,
        storageFetch,
        constructorArgsFetch,
        hardcodedFetch,
      ],
    },
    use: {
      type: 'string',
      pattern: '^[a-z][a-zA-Z0-9]*(\\.[a-z][a-zA-Z0-9]*)*@[0-9]+$',
      description:
        'Recipe that shapes the fetched data, e.g. `set@1`. Omit to output the fetched value as is.',
    },
    args: {
      type: 'object',
      description:
        'Arguments for the recipe named in `use`, as documented in the library. Event argument names refer to the events this step fetches.',
    },
    reason: {
      type: 'string',
      description:
        'One sentence citing the source: which function writes the state and which event it emits, or why these keys are the complete set.',
    },
  },
}

const skip: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['item', 'reason'],
  properties: {
    item: {
      type: 'string',
      description: 'Worklist item signature, e.g. `balanceOf(address)`.',
    },
    reason: {
      enum: [...SKIP_REASONS],
      description:
        '`user-activity`: state written by anyone (balances, allowances). `computation`: a pure function of its inputs. `unbounded`: state whose keys cannot be enumerated from anything available. `covered`: already produced by another step or a 0-arg getter. `not-state`: helpers, versions, interface checks.',
    },
  },
}

export const planSchema: Schema = {
  type: 'object',
  additionalProperties: false,
  required: ['version', 'contract', 'steps', 'skips'],
  properties: {
    version: { const: 1, description: 'Plan format version, always 1.' },
    contract: {
      type: 'string',
      description: 'The contract name from `prepared.name`.',
    },
    shapeHash: {
      type: 'string',
      description:
        'The `shapeHash` from `prepared.json`; copy it verbatim when present.',
    },
    steps: {
      type: 'array',
      items: step,
      description:
        'Fetch-and-shape steps, one per output field. Steps may reference each other with `$step.<id>`; the executor orders them.',
    },
    skips: {
      type: 'array',
      items: skip,
      description:
        'Worklist items deliberately not fetched, each with one reason.',
    },
  },
}
