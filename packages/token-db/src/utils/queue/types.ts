import { Queue } from 'bullmq'

export type InferQueueDataType<T> = T extends Queue<infer DataType>
  ? DataType
  : never
export type InferQueueResultType<T> = T extends Queue<unknown, infer ResultType>
  ? ResultType
  : never
