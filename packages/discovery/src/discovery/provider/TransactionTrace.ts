import * as z from 'zod'

const TraceAction = z.object({
  callType: z.string().optional(),
  from: z.string(),
  to: z.string().optional(),
  value: z.string(),
  input: z.string(),
  gas: z.string(),
  init: z.string().optional(),
})

const TraceResult = z.object({
  gasUsed: z.string(),
  output: z.string(),
  address: z.string().optional(),
  code: z.string().optional(),
  refundAddress: z.string().optional(),
})

const Trace = z.object({
  action: TraceAction,
  result: TraceResult.optional(),
  traceAddress: z.array(z.number()),
  subtraces: z.number(),
  type: z.string(),
  blockNumber: z.number(),
  error: z.string().optional(),
})
export type Trace = z.infer<typeof Trace>

export const TraceTransactionResponse = z.array(Trace)
export type TraceTransactionResponse = z.infer<typeof TraceTransactionResponse>
