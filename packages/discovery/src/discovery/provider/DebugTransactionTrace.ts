import { type Validator, v } from '@l2beat/validate'

export interface DebugTransactionCall {
  from: string
  to: string
  input: string
  output?: string
  type: string
  value?: string
  calls?: DebugTransactionCall[]
  logs?: DebugTransactionLog[]
}

const DebugTransactionLog = v.object({
  address: v.string(),
  topics: v.array(v.string()),
  data: v.string(),
  position: v.string(),
})

export type DebugTransactionLog = v.infer<typeof DebugTransactionLog>

const DebugTransactionCall: Validator<DebugTransactionCall> = v.object({
  from: v.string(),
  to: v.string(),
  input: v.string(),
  output: v.string().optional(),
  type: v.string(),
  value: v.string().optional(),
  calls: v.lazy(() => v.array(DebugTransactionCall)).optional(),
  logs: v.array(DebugTransactionLog).optional(),
})

export const DebugTransactionCallResponse = v.object({
  calls: v.array(DebugTransactionCall).optional(),
})

export type DebugTransactionCallResponse = v.infer<
  typeof DebugTransactionCallResponse
>

/**
 *                         {
                                        "address": "0xa6525ae43edcd03dc08e775774dcabd3bb925872",
                                        "topics": [
                                            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                            "0x0000000000000000000000000000000000000000000000000000000000000000",
                                            "0x00000000000000000000000054fe3425f09854e15081fa5b3276afcb4c46fca2"
                                        ],
                                        "data": "0x000000000000000000000000000000000000000000000000000000003d1275e0",
                                        "position": "0x2"
                                    }
 */
