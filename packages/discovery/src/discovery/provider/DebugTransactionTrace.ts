import * as z from 'zod'

const BasicDebugTransactionCall = z.object({
  from: z.string(),
  to: z.string(),
  input: z.string(),
  output: z.string().optional(),
  type: z.string(),
  value: z.string().optional(),
})

export type DebugTransactionCall = z.infer<typeof BasicDebugTransactionCall> & {
  calls?: DebugTransactionCall[]
}

const DebugTransactionCall: z.ZodType<DebugTransactionCall> =
  BasicDebugTransactionCall.extend({
    calls: z.lazy(() => DebugTransactionCall.array().optional()),
  })

export const DebugTransactionCallResponse = z.object({
  calls: z.array(DebugTransactionCall).optional(),
})

export type DebugTransactionCallResponse = z.infer<
  typeof DebugTransactionCallResponse
>
