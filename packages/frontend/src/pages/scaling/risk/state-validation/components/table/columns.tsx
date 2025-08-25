import { createColumnHelper } from '@tanstack/react-table'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type {
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationZkEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskEntries'

const zkColumnHelper = createColumnHelper<ScalingRiskStateValidationZkEntry>()

export const scalingRiskStateValidationColumns = [
  ...getScalingCommonProjectColumns(
    zkColumnHelper,
    (row) => `/scaling/projects/${row.slug}#state-validation`,
  ),
]

const optimisticColumnHelper =
  createColumnHelper<ScalingRiskStateValidationOptimisticEntry>()

export const scalingRiskStateValidationOptimisticColumns = [
  ...getScalingCommonProjectColumns(
    optimisticColumnHelper,
    (row) => `/scaling/projects/${row.slug}#state-validation`,
  ),
]
