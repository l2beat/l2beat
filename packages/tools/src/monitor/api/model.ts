import { z } from 'zod'

const UpdateMessage = z.object({
  projectName: z.string(),
  chain: z.string(),
  blockNumber: z.number(),
  timestamp: z.number(),
  message: z.string(),
})

export const UpdateMessagesResponse = z.array(UpdateMessage)
export type UpdateMessagesResponse = z.infer<typeof UpdateMessagesResponse>
