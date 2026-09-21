/**
 * `entry.meta.json`: the V2-specific facts about an entry.
 *
 * They live next to the entry rather than inside it so V1 consumers of
 * `EntryParameters` (diffing, the frontend, the permission modeller) never
 * see keys they do not know.
 */
import { v } from '@l2beat/validate'

export const PLAN_STATUSES = ['ok', 'partial', 'failed', 'missing'] as const
export type PlanStatus = (typeof PLAN_STATUSES)[number]

export const EntryMeta = v.object({
  version: v.literal(1),
  /**
   * `ok`: every step produced a value; `partial`: a step errored;
   * `failed`: authoring never produced an acceptable plan; `missing`: no plan
   * was authored (for example a stored plan was expected and not found).
   */
  planStatus: v.enum(PLAN_STATUSES),
  planHash: v.string().optional(),
  shapeHash: v.string().optional(),
  stepCount: v.number(),
  failedSteps: v.array(v.string()),
  skipCount: v.number(),
  model: v.string().optional(),
})

export type EntryMeta = v.infer<typeof EntryMeta>
