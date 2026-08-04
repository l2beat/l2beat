import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxId,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { FunctionCallParameterProjection } from './getFunctionCallParameterProjection'
import { getFunctionCallParameterProjection } from './getFunctionCallParameterProjection'
import { hasLivenessGrouping } from './getLivenessGroupingKey'
import type { FunctionCallQueryTarget } from './sql/getFunctionCallQuery'

export type FunctionCallConfiguration = Configuration<
  TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
>

export type SharpSubmissionConfiguration = Configuration<
  TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
>

export type SharedBridgeConfiguration = Configuration<
  TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
>

export interface PreparedFunctionCalls {
  readonly functionCalls: readonly FunctionCallConfiguration[]
  readonly sharpSubmissions: readonly SharpSubmissionConfiguration[]
  readonly sharedBridges: readonly SharedBridgeConfiguration[]
  readonly queryTargets: readonly FunctionCallQueryTarget[]
  readonly groupingProjections: ReadonlyMap<
    TrackedTxId,
    FunctionCallParameterProjection
  >
}

export function prepareFunctionCalls(
  functionCalls: readonly FunctionCallConfiguration[],
  sharpSubmissions: readonly SharpSubmissionConfiguration[],
  sharedBridges: readonly SharedBridgeConfiguration[],
): PreparedFunctionCalls {
  const queryTargets = new Map<string, FunctionCallQueryTarget>()
  const groupingProjections = new Map<
    TrackedTxId,
    FunctionCallParameterProjection
  >()

  for (const config of functionCalls) {
    const projection = hasLivenessGrouping(config.properties)
      ? getFunctionCallParameterProjection(
          config.properties.params.signature,
          config.properties.groupBy.path,
        )
      : undefined

    if (projection !== undefined) {
      groupingProjections.set(config.id, projection)
    }

    addQueryTarget(queryTargets, {
      address: config.properties.params.address,
      selector: config.properties.params.selector,
      input: 'selector',
      groupingProjection: projection,
    })
  }

  for (const config of [...sharpSubmissions, ...sharedBridges]) {
    addQueryTarget(queryTargets, {
      address: config.properties.params.address,
      selector: config.properties.params.selector,
      input: 'full',
    })
  }

  return {
    functionCalls,
    sharpSubmissions,
    sharedBridges,
    queryTargets: [...queryTargets.values()],
    groupingProjections,
  }
}

function addQueryTarget(
  queryTargets: Map<string, FunctionCallQueryTarget>,
  next: FunctionCallQueryTarget,
): void {
  const key = getCallKey(next)
  const current = queryTargets.get(key)
  if (current === undefined) {
    queryTargets.set(key, next)
    return
  }

  queryTargets.set(key, {
    ...current,
    input:
      current.input === 'full' || next.input === 'full' ? 'full' : 'selector',
    groupingProjection: mergeProjections(
      current.groupingProjection,
      next.groupingProjection,
    ),
  })
}

function mergeProjections(
  current: FunctionCallParameterProjection | undefined,
  next: FunctionCallParameterProjection | undefined,
): FunctionCallParameterProjection | undefined {
  if (current === undefined) return next
  if (next === undefined) return current

  assert(
    current.start === next.start && current.length === next.length,
    'Conflicting grouping projections for the same function call',
  )
  // SQL only projects the bytes. Each grouped consumer retains its own ABI type.
  return current
}

function getCallKey(config: FunctionCallQueryTarget): string {
  return `${config.address.toLowerCase()}-${config.selector.toLowerCase()}`
}
