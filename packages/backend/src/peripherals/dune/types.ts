import { v } from '@l2beat/validate'

export type DuneExecutionState = v.infer<typeof DuneExecutionState>
export const DuneExecutionState = v.enum([
  'QUERY_STATE_PENDING',
  'QUERY_STATE_EXECUTING',
  'QUERY_STATE_FAILED',
  'QUERY_STATE_COMPLETED',
  'QUERY_STATE_CANCELED',
  'QUERY_STATE_TIMED_OUT',
  'QUERY_STATE_COMPLETED_PARTIAL',
])

export const DuneExecuteSqlResponse = v.object({
  execution_id: v.string(),
  state: DuneExecutionState,
})

export const DuneExecutionStatusResponse = v.union([
  v.object({
    execution_id: v.string(),
    state: v.enum([
      'QUERY_STATE_PENDING',
      'QUERY_STATE_EXECUTING',
      'QUERY_STATE_FAILED',
      'QUERY_STATE_CANCELED',
      'QUERY_STATE_TIMED_OUT',
      'QUERY_STATE_COMPLETED_PARTIAL',
    ]),
    execution_cost_credits: v.number(),
  }),
  v.object({
    execution_id: v.string(),
    state: v.literal('QUERY_STATE_COMPLETED'),
    result_metadata: v.object({
      datapoint_count: v.number(),
    }),
    execution_cost_credits: v.number(),
  }),
])

export const DuneExecutionResultResponse = v.object({
  result: v.object({
    rows: v.array(v.unknown()),
  }),
})
