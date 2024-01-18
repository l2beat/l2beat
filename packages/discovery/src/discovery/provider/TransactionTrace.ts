import * as z from 'zod'

const TraceCreate = z.object({
  action: z.object({
    from: z.string(),
    gas: z.string(),
    init: z.string(),
    value: z.string(),
  }),
  blockHash: z.string().optional(),
  blockNumber: z.number(),
  result: z.object({
    address: z.string(),
    code: z.string(),
    gasUsed: z.string(),
  }),
  subtraces: z.number(),
  traceAddress: z.array(z.number()),
  transactionHash: z.string().optional(),
  transactionPosition: z.number().optional(),
  type: z.literal('create'),
})

const TraceCall = z.object({
  action: z.object({
    from: z.string(),
    callType: z.string(),
    gas: z.string(),
    input: z.string(),
    to: z.string(),
    value: z.string(),
  }),
  blockHash: z.string().optional(),
  blockNumber: z.number(),
  result: z.object({
    gasUsed: z.string(),
    output: z.string(),
  }),
  subtraces: z.number(),
  traceAddress: z.array(z.number()),
  transactionHash: z.string().optional(),
  transactionPosition: z.number().optional(),
  type: z.literal('call'),
})

const TraceSuicide = z.object({
  action: z.object({
    address: z.string(),
    refundAddress: z.string(),
    balance: z.string(),
  }),
  blockHash: z.string().optional(),
  blockNumber: z.number(),
  result: z.null(),
  subtraces: z.number(),
  traceAddress: z.array(z.number()),
  transactionHash: z.string().optional(),
  transactionPosition: z.number().optional(),
  type: z.literal('suicide'),
})

const Trace = z.union([TraceCreate, TraceCall, TraceSuicide])

export type Trace = z.infer<typeof Trace>

export const TraceTransactionResponse = z.array(Trace)
export type TraceTransactionResponse = z.infer<typeof TraceTransactionResponse>
