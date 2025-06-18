import { v } from '@l2beat/validate'

const UpdateMessage = v.object({
  projectId: v.string(),
  chain: v.string(),
  blockNumber: v.number(),
  timestamp: v.number(),
  message: v.string(),
})

export const UpdateMessagesResponse = v.array(UpdateMessage)
export type UpdateMessagesResponse = v.infer<typeof UpdateMessagesResponse>
