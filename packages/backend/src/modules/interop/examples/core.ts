import { v } from '@l2beat/validate'
import type { Type } from 'cmd-ts'
import { readFileSync } from 'fs'
import { type ParseError, parse } from 'jsonc-parser'
import { join } from 'path'
import type {
  InteropEvent,
  InteropMessage,
  InteropTransfer,
} from '../plugins/types'

export const ExpectedEvent = v.union([
  v.string(),
  v.record(v.string(), v.unknown()), // Any object shape - validated at runtime
])
export type ExpectedEventType = v.infer<typeof ExpectedEvent>

export const ExpectedMessage = v.union([
  v.string(),
  v.record(v.string(), v.unknown()), // Any object shape - validated at runtime
])
export type ExpectedMessageType = v.infer<typeof ExpectedMessage>

export const ExpectedTransfer = v.union([
  v.string(),
  v.record(v.string(), v.unknown()), // Any object shape - validated at runtime
])
export type ExpectedTransferType = v.infer<typeof ExpectedTransfer>

export const Expects = v.object({
  events: v.array(ExpectedEvent).optional(),
  messages: v.array(ExpectedMessage).optional(),
  transfers: v.array(ExpectedTransfer).optional(),
})
export type ExpectsType = v.infer<typeof Expects>

export interface CoreResult {
  events: InteropEvent[]
  matchedEventIds: Set<string>
  messages: InteropMessage[]
  transfers: InteropTransfer[]
}

export interface TransactionSpec {
  chain: string
  tx: string
}

const TxEntry = v.object({
  chain: v.string(),
  tx: v.string(),
})

export type Example = v.infer<typeof Example>
export const Example = v.object({
  name: v.string().optional(),
  tags: v.array(v.string()).optional(),
  loadConfigs: v.array(v.string()).optional(),
  txs: v.array(TxEntry),
  // New structured expectations field
  expects: Expects.optional(),
  // Legacy fields - kept for backward compatibility
  events: v.array(v.string()).optional(),
  messages: v
    .array(
      v.union([
        v.string(),
        v.object({
          type: v.string(),
          app: v.string().optional(),
        }),
      ]),
    )
    .optional(),
  transfers: v.array(v.string()).optional(),
})

function readJsonc(path: string): JSON {
  const contents = readFileSync(path, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(contents, errors, {
    allowTrailingComma: true,
  }) as JSON
  if (errors.length !== 0) {
    throw new Error(`Cannot parse file ${path}`)
  }
  return parsed
}

export function readExamples(): Record<string, Example> {
  return v
    .record(v.string(), Example)
    .validate(readJsonc(join(__dirname, 'examples.jsonc')))
}

export function Separated<T>(
  type: Type<string, T>,
  separator = ',',
): Type<string, T[]> {
  return {
    async from(str) {
      const values = str.split(separator)
      const parsed = await Promise.all(values.map(type.from))
      return parsed
    },
  }
}
