import { Queue } from 'bullmq'

export type TokenUpdateQueue = ReturnType<typeof wrapTokenQueue>
export type DeploymentUpdatedQueue = ReturnType<
  typeof wrapDeploymentUpdatedQueue
>

/**
 * These both thin abstractions are  over the queue so we explicitly assign the job id to
 * prevent duplicate jobs if token is already awaiting for processing
 */

export function wrapTokenQueue(queue: Queue) {
  return {
    add: async (tokenId: string) => {
      await queue.add('TokenUpdateRequest', { tokenId }, { jobId: tokenId })
    },
  }
}

export function wrapDeploymentUpdatedQueue(queue: Queue) {
  return {
    add: async (tokenId: string) => {
      await queue.add('DeploymentUpdated', { tokenId }, { jobId: tokenId })
    },
  }
}
