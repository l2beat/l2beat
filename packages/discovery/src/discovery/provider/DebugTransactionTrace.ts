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

const DebugTransactionLog = v.object({ topics: v.array(v.string()) })

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
