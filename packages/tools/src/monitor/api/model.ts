import { v } from '@l2beat/validate'

const UpdateMessage = v.object({
  projectId: v.string(),
  timestamp: v.number(),
  message: v.string(),
})

export const UpdateMessagesResponse = v.array(UpdateMessage)
export type UpdateMessagesResponse = v.infer<typeof UpdateMessagesResponse>
