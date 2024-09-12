import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

export function setupQueue({ connection }: { connection: Redis }) {
  return <DataType, ReturnType = unknown, NameType extends string = string>({
    name,
  }: { name: string }) =>
    new Queue<DataType, ReturnType, NameType>(name, {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 50,

        backoff: {
          type: 'exponential',
          delay: 5_000,
        },
      },
    })
}
