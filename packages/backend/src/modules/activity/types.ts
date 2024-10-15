import { ActivityRecord } from '@l2beat/database'

export type ActivityRecordWithoutRatio = Omit<ActivityRecord, 'ratio'>
